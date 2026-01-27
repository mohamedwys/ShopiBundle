# Database Migration Plan - ShopiBundle V2

**Date:** January 2026
**Risk Level:** Medium
**Estimated Downtime:** 0 (rolling migration)

---

## Overview

This document outlines the migration plan from the current ShopiBundle schema to the enhanced V2 schema. The migration is designed to be non-destructive and reversible.

---

## Current State

### Existing Tables

| Table | Records (Est.) | Purpose |
|-------|----------------|---------|
| `session` | Variable | OAuth sessions |
| `active_stores` | ~50-500 | Installed shops |
| `oauth_state` | Temporary | CSRF protection |
| `bundle_discount_id` | ~100-1000 | Bundle-discount mapping |
| `auto_bundle_rules` | ~50-200 | Auto-bundling rules |
| `auto_bundle_data` | Deprecated | Legacy auto-bundle (single rule) |
| `ai_fbt_bundles` | ~500-5000 | AI-generated FBT bundles |
| `ai_fbt_config` | ~50-500 | AI config per shop |
| `ai_bundle_events` | ~10000+ | Event tracking |
| `ai_bundle_ab_assignments` | ~5000+ | A/B test assignments |

### Data to Migrate

1. **bundle_discount_id** → New `Bundle` + `BundleDiscount` tables
2. **auto_bundle_rules** → New `AutoBundleRule` table (enhanced)
3. **ai_fbt_bundles** → New `Bundle` table with AI source flag

---

## Migration Strategy

### Phase 1: Add New Tables (No Downtime)

```sql
-- Run Prisma migration to add new tables
-- Old tables remain untouched
prisma migrate deploy
```

**New Tables:**
- `Bundle`
- `BundleComponent`
- `ComponentGroup`
- `BundlePricingRule`
- `BundleDiscount`
- `BundleInventory`
- `BundleAnalytics`
- `BundleEvent`
- `InventorySyncLog`
- `AutoBundleRule` (enhanced)
- `SubscriptionBundle`
- `GiftBundleSettings`

### Phase 2: Dual-Write Period (1-2 weeks)

During this phase:
- New bundle operations write to BOTH old and new tables
- Read operations use old tables by default
- Feature flag controls which tables are read

```typescript
// Dual-write example
async function createBundle(input) {
  // Write to new table
  const newBundle = await prisma.bundle.create({ ... });

  // Write to old table for backward compatibility
  await prisma.bundle_discount_id.create({
    bundleId: newBundle.shopifyMetaobjectId,
    bundleName: newBundle.name,
    discountId: newBundle.discounts[0]?.shopifyDiscountId,
    shop: newBundle.shop,
  });

  return newBundle;
}
```

### Phase 3: Data Migration (Batch Process)

**Script: migrate-bundles.ts**

```typescript
import { prisma } from '@/lib/db/prisma';
import { logger } from '@/lib/monitoring/logger';

interface MigrationStats {
  total: number;
  migrated: number;
  failed: number;
  skipped: number;
}

async function migrateBundles(): Promise<MigrationStats> {
  const stats: MigrationStats = { total: 0, migrated: 0, failed: 0, skipped: 0 };

  // Get all existing bundles from old table
  const oldBundles = await prisma.bundle_discount_id.findMany();
  stats.total = oldBundles.length;

  for (const oldBundle of oldBundles) {
    try {
      // Check if already migrated
      const existing = await prisma.bundle.findFirst({
        where: {
          shop: oldBundle.shop,
          shopifyMetaobjectId: oldBundle.bundleId,
        },
      });

      if (existing) {
        stats.skipped++;
        continue;
      }

      // Fetch metaobject data from Shopify
      const metaobjectData = await fetchMetaobjectData(
        oldBundle.shop,
        oldBundle.bundleId
      );

      if (!metaobjectData) {
        logger.warn('Metaobject not found', { bundleId: oldBundle.bundleId });
        stats.failed++;
        continue;
      }

      // Create new bundle record
      await prisma.bundle.create({
        data: {
          shop: oldBundle.shop,
          name: oldBundle.bundleName,
          title: metaobjectData.title || oldBundle.bundleName,
          description: metaobjectData.description,
          slug: generateSlug(oldBundle.bundleName),
          type: 'FIXED',
          status: 'ACTIVE',
          shopifyMetaobjectId: oldBundle.bundleId,
          components: {
            create: metaobjectData.products.map((p, i) => ({
              shopifyProductId: p.productId,
              shopifyVariantId: p.variantId,
              quantity: p.quantity || 1,
              isRequired: true,
              displayOrder: i,
              minQuantity: 0,
              maxQuantity: 1,
              priceAdjustmentType: 'NONE',
            })),
          },
          pricingRules: {
            create: [{
              name: 'Bundle Discount',
              priority: 0,
              isActive: true,
              ruleType: 'BUNDLE_DISCOUNT',
              conditions: {},
              discountType: 'PERCENTAGE',
              discountValue: metaobjectData.discount || 0,
              usageCount: 0,
            }],
          },
          discounts: {
            create: [{
              shopifyDiscountId: oldBundle.discountId,
              discountType: 'automatic',
              isActive: true,
            }],
          },
          inventoryRecords: {
            create: [{
              trackingMethod: 'COMPONENT_BASED',
              lowStockThreshold: 10,
              availableQuantity: 0,
              reservedQuantity: 0,
              allowOversell: false,
              autoSyncEnabled: true,
            }],
          },
        },
      });

      stats.migrated++;
      logger.info('Bundle migrated', {
        bundleId: oldBundle.bundleId,
        shop: oldBundle.shop,
      });
    } catch (error) {
      stats.failed++;
      logger.error('Failed to migrate bundle', error, {
        bundleId: oldBundle.bundleId,
        shop: oldBundle.shop,
      });
    }
  }

  return stats;
}

async function migrateAIBundles(): Promise<MigrationStats> {
  const stats: MigrationStats = { total: 0, migrated: 0, failed: 0, skipped: 0 };

  const aiBundles = await prisma.ai_fbt_bundles.findMany({
    where: { isActive: true },
  });
  stats.total = aiBundles.length;

  for (const aiBundle of aiBundles) {
    try {
      // Check if already migrated
      const existing = await prisma.bundle.findFirst({
        where: {
          shop: aiBundle.shop,
          metadata: {
            path: ['ai_bundle_id'],
            equals: aiBundle.id,
          },
        },
      });

      if (existing) {
        stats.skipped++;
        continue;
      }

      // Create bundle from AI data
      await prisma.bundle.create({
        data: {
          shop: aiBundle.shop,
          name: `AI Bundle - ${aiBundle.productId}`,
          title: 'Frequently Bought Together',
          slug: `ai-fbt-${aiBundle.id}`,
          type: 'FIXED',
          status: aiBundle.isActive ? 'ACTIVE' : 'PAUSED',
          shopifyMetaobjectId: aiBundle.bundleMetaobjectId,
          metadata: {
            ai_bundle_id: aiBundle.id,
            source: 'AI',
            confidence: aiBundle.confidenceScore,
            support: aiBundle.support,
            lift: aiBundle.lift,
          },
          components: {
            create: [
              // Primary product
              {
                shopifyProductId: aiBundle.productId,
                quantity: 1,
                isRequired: true,
                displayOrder: 0,
                minQuantity: 0,
                maxQuantity: 1,
                priceAdjustmentType: 'NONE',
              },
              // Bundled products
              ...aiBundle.bundledProductIds.map((pid, i) => ({
                shopifyProductId: pid,
                quantity: 1,
                isRequired: true,
                displayOrder: i + 1,
                minQuantity: 0,
                maxQuantity: 1,
                priceAdjustmentType: 'NONE',
              })),
            ],
          },
          discounts: aiBundle.discountId ? {
            create: [{
              shopifyDiscountId: aiBundle.discountId,
              discountType: 'automatic',
              isActive: aiBundle.isActive,
            }],
          } : undefined,
          inventoryRecords: {
            create: [{
              trackingMethod: 'COMPONENT_BASED',
              lowStockThreshold: 10,
              availableQuantity: 0,
              reservedQuantity: 0,
              allowOversell: false,
              autoSyncEnabled: true,
            }],
          },
        },
      });

      stats.migrated++;
    } catch (error) {
      stats.failed++;
      logger.error('Failed to migrate AI bundle', error, {
        bundleId: aiBundle.id,
      });
    }
  }

  return stats;
}

// Run migration
async function runMigration() {
  logger.info('Starting bundle migration');

  const bundleStats = await migrateBundles();
  logger.info('Manual bundles migration complete', undefined, bundleStats);

  const aiStats = await migrateAIBundles();
  logger.info('AI bundles migration complete', undefined, aiStats);

  return { bundles: bundleStats, aiBundles: aiStats };
}

export { runMigration, migrateBundles, migrateAIBundles };
```

### Phase 4: Switch Read Operations

After migration validation:

```typescript
// config/feature-flags.ts
V2_BUNDLE_ENGINE: true,  // Enable new read path
```

### Phase 5: Cleanup (After 30 days)

1. Remove dual-write logic
2. Archive old tables (don't delete yet)
3. Remove legacy API endpoints

---

## Rollback Procedure

### Immediate Rollback (Phase 2-3)

```bash
# Disable new features
export FEATURE_FLAG_V2_BUNDLE_ENGINE=false
export FEATURE_FLAG_V2_PRICING_ENGINE=false

# Restart application
npm run deploy
```

### Full Rollback (If needed)

```sql
-- Preserve new data for analysis
CREATE TABLE bundle_v2_backup AS SELECT * FROM "Bundle";
CREATE TABLE bundle_component_backup AS SELECT * FROM "BundleComponent";

-- Drop new tables
DROP TABLE IF EXISTS "BundleEvent" CASCADE;
DROP TABLE IF EXISTS "BundleAnalytics" CASCADE;
DROP TABLE IF EXISTS "BundleInventory" CASCADE;
DROP TABLE IF EXISTS "BundleDiscount" CASCADE;
DROP TABLE IF EXISTS "BundlePricingRule" CASCADE;
DROP TABLE IF EXISTS "ComponentGroup" CASCADE;
DROP TABLE IF EXISTS "BundleComponent" CASCADE;
DROP TABLE IF EXISTS "Bundle" CASCADE;

-- Revert to old API
export FEATURE_FLAG_V2_BUNDLE_ENGINE=false
```

---

## Validation Checklist

### Pre-Migration

- [ ] Backup all existing data
- [ ] Test migration script in staging
- [ ] Verify Shopify API access for all shops
- [ ] Set up monitoring alerts
- [ ] Notify support team

### During Migration

- [ ] Monitor error rates
- [ ] Check migration progress
- [ ] Verify dual-write consistency
- [ ] Test read operations from both paths

### Post-Migration

- [ ] Verify all bundles migrated correctly
- [ ] Compare counts: old vs new tables
- [ ] Test bundle CRUD operations
- [ ] Verify storefront proxy responses
- [ ] Check analytics data flow

---

## Data Validation Queries

```sql
-- Compare bundle counts by shop
SELECT
  'old' as source,
  shop,
  COUNT(*) as count
FROM bundle_discount_id
GROUP BY shop
UNION ALL
SELECT
  'new' as source,
  shop,
  COUNT(*) as count
FROM "Bundle"
GROUP BY shop
ORDER BY shop, source;

-- Find unmigrated bundles
SELECT bd.*
FROM bundle_discount_id bd
LEFT JOIN "Bundle" b ON b."shopifyMetaobjectId" = bd."bundleId"
WHERE b.id IS NULL;

-- Verify discount mappings
SELECT
  b.id,
  b.name,
  bd."shopifyDiscountId",
  old."discountId" as old_discount_id,
  bd."shopifyDiscountId" = old."discountId" as match
FROM "Bundle" b
JOIN "BundleDiscount" bd ON bd."bundleId" = b.id
JOIN bundle_discount_id old ON old."bundleId" = b."shopifyMetaobjectId"
WHERE bd."shopifyDiscountId" != old."discountId";
```

---

## Timeline

| Day | Phase | Actions |
|-----|-------|---------|
| 1 | Prep | Backup data, test scripts in staging |
| 2 | Phase 1 | Deploy schema migration |
| 3-4 | Phase 2 | Enable dual-write, monitor |
| 5-7 | Phase 3 | Run batch migration |
| 8-10 | Validation | Verify data, fix issues |
| 11-14 | Phase 4 | Switch to new read path |
| 30+ | Phase 5 | Cleanup old tables |

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Migration script failure | Medium | High | Transaction rollback, retry logic |
| Shopify API unavailable | Low | High | Queue failed items, retry later |
| Data inconsistency | Medium | Medium | Validation queries, reconciliation |
| Performance degradation | Low | Medium | Batch processing, off-peak migration |
| Rollback needed | Low | High | Feature flags, preserved old tables |

---

## Contacts

| Role | Contact | Responsibility |
|------|---------|----------------|
| Tech Lead | TBD | Migration execution |
| DBA | TBD | Database operations |
| Support | TBD | Merchant communication |
| On-Call | TBD | Incident response |

---

**Document Version:** 1.0
**Status:** Ready for Review
**Next Review:** Before Migration Start

# STEP 8: Subscription Integration + Feature Flags

## Context
This is the final step. It creates a Selling Plans service for SUBSCRIPTION bundles (Shopify Selling Plans API), wires it into the integration service, and enables the relevant feature flags so all bundle types are unlocked.

**Current feature flag state** (`config/feature-flags.ts` lines 42-70):
- `BOGO_BUNDLES: false` (line 50)
- `TIERED_PRICING: false` (line 51)
- `MIX_MATCH_BUNDLES: false` (line 55)
- `BUILD_YOUR_OWN: false` (line 56)
- `COMPONENT_GROUPS: false` (line 57)
- `SUBSCRIPTION_BUNDLES: false` (line 62)
- `GIFT_BUNDLES: false` (line 63)
- `DISCOUNT_STACKING_CONFIG: false` (line 64)

**Shopify Integration Service** (`lib/services/shopify-integration.service.ts`):
- `ShopifyIntegrationService` class (line 256) with `onBundlePublish`, `onBundleUpdate`, `onBundleUnpublish`, `onBundleDelete`
- Uses `RateLimitedShopifyClient` from `lib/shopify/client.ts`
- `createFunctionDiscount` (line 592) creates `discountAutomaticApp` with metafield config

## DO NOT re-analyze the codebase. All info is below. Just make the edits.

---

## Task 1: Create Selling Plans Service

**File (NEW):** `lib/services/selling-plans.service.ts`

Shopify Selling Plans API enables subscription products. A Selling Plan Group contains one or more Selling Plans (delivery frequencies). When a SUBSCRIPTION bundle is published, we create a Selling Plan Group and associate it with all bundle products.

```typescript
/**
 * Selling Plans Service
 *
 * Manages Shopify Selling Plan Groups for subscription bundles.
 * Each subscription bundle gets one Selling Plan Group with
 * configurable delivery frequencies (plans).
 *
 * Shopify GraphQL mutations used:
 *   - sellingPlanGroupCreate: Create a new group with plans + product associations
 *   - sellingPlanGroupUpdate: Update plans or add/remove products
 *   - sellingPlanGroupDelete: Remove the group when bundle is unpublished
 */

import { RateLimitedShopifyClient } from '@/lib/shopify/client';
import { logger } from '@/lib/monitoring/logger';

// ============================================
// Types
// ============================================

export interface SubscriptionConfig {
  bundleId: string;
  bundleName: string;
  frequencies: Array<{
    value: string;
    label: string;
    intervalCount: number;
    interval: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  }>;
  discountPercent: number;
  productIds: string[];
}

export interface SellingPlanGroupResult {
  sellingPlanGroupId: string | null;
  errors: string[];
}

// ============================================
// GraphQL Mutations
// ============================================

const SELLING_PLAN_GROUP_CREATE = `
  mutation CreateSellingPlanGroup($input: SellingPlanGroupInput!, $resources: SellingPlanGroupResourceInput) {
    sellingPlanGroupCreate(input: $input, resources: $resources) {
      sellingPlanGroup {
        id
        name
        sellingPlans(first: 10) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const SELLING_PLAN_GROUP_UPDATE = `
  mutation UpdateSellingPlanGroup($id: ID!, $input: SellingPlanGroupInput!) {
    sellingPlanGroupUpdate(id: $id, input: $input) {
      sellingPlanGroup {
        id
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const SELLING_PLAN_GROUP_DELETE = `
  mutation DeleteSellingPlanGroup($id: ID!) {
    sellingPlanGroupDelete(id: $id) {
      deletedSellingPlanGroupId
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const SELLING_PLAN_GROUP_ADD_PRODUCTS = `
  mutation AddProductsToSellingPlanGroup($id: ID!, $productIds: [ID!]!) {
    sellingPlanGroupAddProducts(id: $id, productIds: $productIds) {
      sellingPlanGroup {
        id
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const SELLING_PLAN_GROUP_REMOVE_PRODUCTS = `
  mutation RemoveProductsFromSellingPlanGroup($id: ID!, $productIds: [ID!]!) {
    sellingPlanGroupRemoveProducts(id: $id, productIds: $productIds) {
      removedProductIds
      userErrors {
        field
        message
        code
      }
    }
  }
`;

// ============================================
// Service
// ============================================

export class SellingPlansService {
  /**
   * Create a Selling Plan Group for a subscription bundle.
   *
   * Creates one group with N plans (one per delivery frequency).
   * Each plan has a recurring delivery policy and optionally a
   * percentage discount (subscribe & save).
   */
  async createSellingPlanGroup(
    client: RateLimitedShopifyClient,
    config: SubscriptionConfig
  ): Promise<SellingPlanGroupResult> {
    const errors: string[] = [];

    try {
      const sellingPlans = config.frequencies.map((freq) => ({
        name: freq.label,
        options: freq.label,
        position: 1,
        billingPolicy: {
          recurring: {
            interval: freq.interval,
            intervalCount: freq.intervalCount,
          },
        },
        deliveryPolicy: {
          recurring: {
            interval: freq.interval,
            intervalCount: freq.intervalCount,
          },
        },
        pricingPolicies: config.discountPercent > 0
          ? [
              {
                fixed: {
                  adjustmentType: 'PERCENTAGE',
                  adjustmentValue: {
                    percentage: config.discountPercent,
                  },
                },
              },
            ]
          : [],
      }));

      // Build product GIDs
      const productGids = config.productIds.map((id) =>
        id.startsWith('gid://') ? id : `gid://shopify/Product/${id}`
      );

      const response = await client.mutate<{
        sellingPlanGroupCreate: {
          sellingPlanGroup: { id: string } | null;
          userErrors: Array<{ field: string[]; message: string; code: string }>;
        };
      }>(SELLING_PLAN_GROUP_CREATE, {
        input: {
          name: `Subscribe & Save: ${config.bundleName}`,
          merchantCode: `bundle-${config.bundleId}`,
          options: ['Delivery frequency'],
          sellingPlansToCreate: sellingPlans,
        },
        resources: {
          productIds: productGids,
        },
      });

      const result = response.data?.sellingPlanGroupCreate;
      if (!result) {
        errors.push('No response from selling plan group creation');
        return { sellingPlanGroupId: null, errors };
      }

      if (result.userErrors.length > 0) {
        const errorMessages = result.userErrors.map((e) => e.message).join(', ');
        errors.push(`Selling plan group errors: ${errorMessages}`);
        return { sellingPlanGroupId: null, errors };
      }

      if (!result.sellingPlanGroup) {
        errors.push('Selling plan group creation returned no group');
        return { sellingPlanGroupId: null, errors };
      }

      logger.info('Created selling plan group', {
        bundleId: config.bundleId,
        sellingPlanGroupId: result.sellingPlanGroup.id,
        planCount: config.frequencies.length,
      });

      return { sellingPlanGroupId: result.sellingPlanGroup.id, errors: [] };
    } catch (error: any) {
      errors.push(`Failed to create selling plan group: ${error.message}`);
      logger.error('Selling plan group creation failed', {
        bundleId: config.bundleId,
        error: error.message,
      });
      return { sellingPlanGroupId: null, errors };
    }
  }

  /**
   * Delete a Selling Plan Group.
   * Called when a subscription bundle is unpublished or deleted.
   */
  async deleteSellingPlanGroup(
    client: RateLimitedShopifyClient,
    sellingPlanGroupId: string
  ): Promise<void> {
    try {
      const response = await client.mutate<{
        sellingPlanGroupDelete: {
          deletedSellingPlanGroupId: string | null;
          userErrors: Array<{ field: string[]; message: string; code: string }>;
        };
      }>(SELLING_PLAN_GROUP_DELETE, {
        id: sellingPlanGroupId,
      });

      const result = response.data?.sellingPlanGroupDelete;
      if (result?.userErrors && result.userErrors.length > 0) {
        logger.warn('Selling plan group delete had errors', {
          sellingPlanGroupId,
          errors: result.userErrors.map((e) => e.message),
        });
      }
    } catch (error: any) {
      // Best-effort deletion — log but don't throw
      logger.error('Failed to delete selling plan group', {
        sellingPlanGroupId,
        error: error.message,
      });
    }
  }

  /**
   * Update product associations for a selling plan group.
   * Adds new products and removes old ones.
   */
  async updateProductAssociations(
    client: RateLimitedShopifyClient,
    sellingPlanGroupId: string,
    newProductIds: string[],
    oldProductIds: string[]
  ): Promise<void> {
    const toGid = (id: string) =>
      id.startsWith('gid://') ? id : `gid://shopify/Product/${id}`;

    const newGids = newProductIds.map(toGid);
    const oldGids = oldProductIds.map(toGid);

    const toAdd = newGids.filter((gid) => !oldGids.includes(gid));
    const toRemove = oldGids.filter((gid) => !newGids.includes(gid));

    if (toAdd.length > 0) {
      try {
        await client.mutate(SELLING_PLAN_GROUP_ADD_PRODUCTS, {
          id: sellingPlanGroupId,
          productIds: toAdd,
        });
      } catch (error: any) {
        logger.error('Failed to add products to selling plan group', {
          sellingPlanGroupId,
          error: error.message,
        });
      }
    }

    if (toRemove.length > 0) {
      try {
        await client.mutate(SELLING_PLAN_GROUP_REMOVE_PRODUCTS, {
          id: sellingPlanGroupId,
          productIds: toRemove,
        });
      } catch (error: any) {
        logger.error('Failed to remove products from selling plan group', {
          sellingPlanGroupId,
          error: error.message,
        });
      }
    }
  }
}

// Singleton
let sellingPlansServiceInstance: SellingPlansService | null = null;

export function getSellingPlansService(): SellingPlansService {
  if (!sellingPlansServiceInstance) {
    sellingPlansServiceInstance = new SellingPlansService();
  }
  return sellingPlansServiceInstance;
}
```

---

## Task 2: Wire SellingPlansService into ShopifyIntegrationService

**File:** `lib/services/shopify-integration.service.ts`

### 2a. Add import at the top (after the existing imports, around line 13):

```typescript
import { getSellingPlansService, SubscriptionConfig } from './selling-plans.service';
```

### 2b. Add selling plan group creation to onBundlePublish.

The `onBundlePublish` method (starts at line 275) creates metaobject + discount. After the discount creation try/catch block (ends around line 308), add:

```typescript
    // Create selling plan group for subscription bundles
    if (bundle.bundleType === 'SUBSCRIPTION' && bundle.subscriptionSettings) {
      try {
        let subscriptionConfig: SubscriptionConfig;
        try {
          const settings = JSON.parse(bundle.subscriptionSettings);
          subscriptionConfig = {
            bundleId: bundle.id,
            bundleName: bundle.name,
            frequencies: settings.frequencies || [],
            discountPercent: settings.discountPercent || 0,
            productIds: bundle.components.map((c) => c.shopifyProductId),
          };
        } catch (parseError: any) {
          throw new Error(`Invalid subscription settings JSON: ${parseError.message}`);
        }

        const sellingPlansService = getSellingPlansService();
        const spResult = await sellingPlansService.createSellingPlanGroup(client, subscriptionConfig);

        if (spResult.sellingPlanGroupId) {
          log.info('Selling plan group created', { sellingPlanGroupId: spResult.sellingPlanGroupId });
        }
        if (spResult.errors.length > 0) {
          errors.push(...spResult.errors);
        }
      } catch (error: any) {
        const errorMsg = `Failed to create selling plan group: ${error.message}`;
        log.error(errorMsg, { error: error.message });
        errors.push(errorMsg);
      }
    }
```

### 2c. Extend ShopifyIntegrationResult to include sellingPlanGroupId.

**Current (lines 41-45):**
```typescript
export interface ShopifyIntegrationResult {
  metaobjectId: string | null;
  discountId: string | null;
  errors: string[];
}
```

**Replace with:**
```typescript
export interface ShopifyIntegrationResult {
  metaobjectId: string | null;
  discountId: string | null;
  sellingPlanGroupId?: string | null;
  errors: string[];
}
```

---

## Task 3: Add sellingPlanGroupId to Prisma schema

**File:** `prisma/schema.prisma`

In the Bundle model (starts around line 266), find the `shopifyDiscountId` field (around line 301) and add after it:

```prisma
  sellingPlanGroupId     String?
```

This stores the Shopify Selling Plan Group ID so it can be cleaned up on unpublish/delete.

After adding the field, run: `npx prisma generate` (do NOT run `npx prisma db push` or `npx prisma migrate` — those are manual ops).

---

## Task 4: Enable feature flags for all bundle types

**File:** `config/feature-flags.ts`

### 4a. Enable Sprint 3-4 flags (lines 49-52):

**Current:**
```typescript
  // Sprint 3-4: Core Bundle Types - ENABLED for Sprint 3
  INVENTORY_SYNC: true,
  BOGO_BUNDLES: false,
  TIERED_PRICING: false,
  WEBHOOK_INVENTORY: true,
```

**Replace with:**
```typescript
  // Sprint 3-4: Core Bundle Types - ENABLED
  INVENTORY_SYNC: true,
  BOGO_BUNDLES: true,
  TIERED_PRICING: true,
  WEBHOOK_INVENTORY: true,
```

### 4b. Enable Sprint 5-6 flags (lines 54-58):

**Current:**
```typescript
  // Sprint 5-6: Mix & Match
  MIX_MATCH_BUNDLES: false,
  BUILD_YOUR_OWN: false,
  COMPONENT_GROUPS: false,
  THEME_EXTENSION_V2: false,
```

**Replace with:**
```typescript
  // Sprint 5-6: Mix & Match - ENABLED
  MIX_MATCH_BUNDLES: true,
  BUILD_YOUR_OWN: true,
  COMPONENT_GROUPS: true,
  THEME_EXTENSION_V2: true,
```

### 4c. Enable Sprint 7-8 flags (lines 60-64):

**Current:**
```typescript
  // Sprint 7-8: Advanced
  SUBSCRIPTION_BUNDLES: false,
  GIFT_BUNDLES: false,
  DISCOUNT_STACKING_CONFIG: false,
  CHECKOUT_UI_EXTENSION: false,
```

**Replace with:**
```typescript
  // Sprint 7-8: Advanced - ENABLED
  SUBSCRIPTION_BUNDLES: true,
  GIFT_BUNDLES: true,
  DISCOUNT_STACKING_CONFIG: true,
  CHECKOUT_UI_EXTENSION: false,
```

Note: `CHECKOUT_UI_EXTENSION` stays `false` — it requires a separate Shopify extension deployment.

---

## Task 5: Add feature flag guards to bundle creation API

**File:** `pages/api/v2/bundles/index.ts`

This is the POST handler for creating bundles. It should check that the requested bundle type is enabled.

After the existing validation in the POST handler (around line 71-80), add a feature flag check:

```typescript
    // Check feature flags for non-FIXED bundle types
    const { isFeatureEnabled } = await import('@/config/feature-flags');
    const typeToFlag: Record<string, string> = {
      'BOGO': 'BOGO_BUNDLES',
      'TIERED': 'TIERED_PRICING',
      'MIX_MATCH': 'MIX_MATCH_BUNDLES',
      'BUILD_YOUR_OWN': 'BUILD_YOUR_OWN',
      'SUBSCRIPTION': 'SUBSCRIPTION_BUNDLES',
      'GIFT': 'GIFT_BUNDLES',
    };

    if (input.type && typeToFlag[input.type]) {
      const flag = typeToFlag[input.type] as any;
      if (!isFeatureEnabled(flag)) {
        return res.status(403).json({
          success: false,
          error: `Bundle type ${input.type} is not enabled. Contact support to enable this feature.`,
        });
      }
    }
```

---

## Task 6: Clean up selling plan groups during app uninstall

**File:** `utils/webhooks/app_uninstalled.ts`

In the comprehensive cleanup handler (rewritten in a previous step), add selling plan group cleanup to Phase 2 (Shopify resource cleanup).

After the discount deletion loop, add:

```typescript
    // Clean up selling plan groups
    const bundlesWithSellingPlans = await prisma.bundle.findMany({
      where: { shop: shopDomain, sellingPlanGroupId: { not: null } },
      select: { sellingPlanGroupId: true },
    });

    for (const bundle of bundlesWithSellingPlans) {
      if (bundle.sellingPlanGroupId) {
        try {
          await retryOnRateLimit(async () => {
            await client.request(`
              mutation DeleteSellingPlanGroup($id: ID!) {
                sellingPlanGroupDelete(id: $id) {
                  deletedSellingPlanGroupId
                  userErrors { message }
                }
              }
            `, {
              variables: { id: bundle.sellingPlanGroupId },
            });
          });
        } catch (err) {
          console.error(`Failed to delete selling plan group ${bundle.sellingPlanGroupId}:`, err);
        }
      }
    }
```

---

## Verification
1. Run: `npx prisma generate` — generates client with new `sellingPlanGroupId` field
2. Run: `npx tsc --noEmit` — 0 errors
3. Verify feature flags: `BOGO_BUNDLES`, `TIERED_PRICING`, `MIX_MATCH_BUNDLES`, `BUILD_YOUR_OWN`, `SUBSCRIPTION_BUNDLES`, `GIFT_BUNDLES` are all `true`
4. Verify selling plan group creation flow compiles
5. Verify bundle creation API rejects disabled types with 403

## Commit message
```
Add Selling Plans service for subscriptions and enable all bundle type flags

- SellingPlansService: create/delete/update Selling Plan Groups via GraphQL
- Wire subscription bundle publish into ShopifyIntegrationService
- Add sellingPlanGroupId to Bundle model for cleanup tracking
- Enable feature flags: BOGO, TIERED, MIX_MATCH, BUILD_YOUR_OWN,
  SUBSCRIPTION, GIFT, DISCOUNT_STACKING_CONFIG, COMPONENT_GROUPS
- API guards: return 403 for disabled bundle types
- Clean up selling plan groups during app uninstall
```

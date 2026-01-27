# Product Decisions - ShopiBundle Enhanced

**Date:** January 2026
**Status:** Approved

---

## GO/NO-GO Result: GO (with adjustments)

### Approved Items
- Overall architecture approach
- Full schema implementation (feature-flagged)
- Monitoring from day 1

### Adjustments Required
- Reduce Sprint 1-2 scope to fixed bundles only
- Add rate limiting before Shopify API calls
- Create detailed migration plan before production

---

## Key Product Decisions

### 1. Bundle-as-Product Strategy

**Decision:** Only create Shopify products for subscription bundles (Sprint 7+)

| Bundle Type | Implementation |
|-------------|----------------|
| Fixed | Metaobjects + Automatic Discounts |
| Mix & Match | Metaobjects + Automatic Discounts |
| Tiered | Metaobjects + Automatic Discounts |
| BOGO | Metaobjects + Automatic Discounts |
| Build Your Own | Metaobjects + Automatic Discounts |
| **Subscription** | **Shopify Product + Selling Plans** |
| Gift | Metaobjects + Automatic Discounts |

**Rationale:** Creating products adds complexity and inventory management overhead. Only subscriptions need selling plans which require products.

---

### 2. Feature Priority

**Decision:** Mix-and-Match before Subscriptions

```
Sprint 3-4: Fixed bundles + BOGO + Tiered (Core)
Sprint 5-6: Mix-and-Match + Build Your Own (High value)
Sprint 7-8: Subscriptions + Gift bundles (Advanced)
```

**Rationale:** Mix-and-match has higher merchant demand and doesn't require selling plan integration.

---

### 3. Multi-Currency Support

**Decision:** NOT in MVP

| Phase | Action |
|-------|--------|
| Now | Add currency fields to database schema |
| Sprint 1-8 | USD only, hardcoded |
| Sprint 9-10 | Implement multi-currency |

**Database Fields to Add:**
```prisma
model Bundle {
  // ... existing fields
  currencyCode    String    @default("USD")
}

model BundlePricingRule {
  // ... existing fields
  currencyCode    String    @default("USD")
}
```

---

### 4. Discount Stacking

**Decision:** NO stacking by default

| Setting | Default | Configurable |
|---------|---------|--------------|
| Stack with product discounts | No | Sprint 6+ |
| Stack with order discounts | Yes | Sprint 6+ |
| Stack with shipping discounts | Yes | Sprint 6+ |

**Implementation:**
```typescript
// Default discount configuration
const DEFAULT_COMBINES_WITH = {
  productDiscounts: false,  // Don't stack with product-level discounts
  orderDiscounts: true,     // Allow order-level discounts
  shippingDiscounts: true,  // Allow shipping discounts
};
```

---

## Revised Sprint Scope

### Sprint 1-2: Foundation (Reduced Scope)

**In Scope:**
- [ ] Database schema migration (full schema, feature-flagged)
- [ ] Bundle Engine core (fixed bundles only)
- [ ] Pricing Engine (percentage discounts only)
- [ ] Rate limiting for Shopify API
- [ ] Monitoring/logging setup
- [ ] Migration plan documentation

**Out of Scope (Moved to Sprint 3+):**
- Tiered pricing calculations
- BOGO pricing calculations
- Mix & Match component groups
- Inventory sync system

### Sprint 3-4: Core Bundle Types

**In Scope:**
- [ ] Inventory synchronization
- [ ] BOGO bundle type
- [ ] Tiered/volume pricing
- [ ] Webhook handlers

### Sprint 5-6: Mix & Match (Priority over Subscriptions)

**In Scope:**
- [ ] Mix & Match bundles
- [ ] Build Your Own box
- [ ] Component groups
- [ ] Theme extension

### Sprint 7-8: Advanced (Subscriptions)

**In Scope:**
- [ ] Subscription bundles with selling plans
- [ ] Gift bundles
- [ ] Discount stacking configuration

---

## Technical Requirements Added

### Rate Limiting (Sprint 1)
```typescript
// Required before any Shopify API calls
const rateLimiter = new ShopifyRateLimiter({
  maxRequestsPerSecond: 2,  // Conservative limit
  bucketSize: 40,           // Shopify's bucket size
  bufferPercent: 0.2,       // Stay 20% below limit
});
```

### Monitoring (Sprint 1)
- Error tracking: Sentry
- API metrics: Custom middleware
- Bundle analytics: Database + aggregation

### Migration Plan (Sprint 1)
- Document all existing bundle data
- Create rollback procedures
- Test migration in staging
- Schedule maintenance window

---

## Feature Flags

All new features will be behind feature flags:

```typescript
const FEATURE_FLAGS = {
  // Sprint 1-2
  V2_BUNDLE_ENGINE: false,
  V2_PRICING_ENGINE: false,

  // Sprint 3-4
  INVENTORY_SYNC: false,
  BOGO_BUNDLES: false,
  TIERED_PRICING: false,

  // Sprint 5-6
  MIX_MATCH_BUNDLES: false,
  BUILD_YOUR_OWN: false,

  // Sprint 7-8
  SUBSCRIPTION_BUNDLES: false,
  GIFT_BUNDLES: false,
  DISCOUNT_STACKING_CONFIG: false,

  // Sprint 9-10
  MULTI_CURRENCY: false,
};
```

---

**Document Version:** 1.0
**Approved By:** Product Team
**Implementation Start:** Sprint 1

# STEP 1: Foundation — Unlock All Bundle Types in Schema, Service, and API

## Context
ShopiBundle is a Shopify app (Next.js 14 + Prisma + TypeScript). Currently only FIXED bundles can be created. The schema already defines 7 bundle types (FIXED, TIERED, BOGO, MIX_MATCH, BUILD_YOUR_OWN, SUBSCRIPTION, GIFT) but `bundle.service.ts` hardcodes `type: 'FIXED'` and the API only accepts `discountPercent`. This step unlocks all types.

## DO NOT re-analyze the codebase. All info is below. Just make the edits described.

---

## Task 1: Add 3 JSON fields to Bundle model in Prisma schema

**File:** `prisma/schema.prisma`
**Location:** After line 294 (`metadata Json?`), before line 296 (`// Timestamps`)

**Add these 3 fields:**
```prisma
  // Type-specific settings (JSON for flexibility)
  selectionRules         Json?    // MIX_MATCH/BUILD_YOUR_OWN: {minProducts, maxProducts, groups[]}
  giftSettings           Json?    // GIFT: {allowGiftMessage, maxMessageLength, allowGiftWrap, wrapProductId, wrapPrice}
  subscriptionSettings   Json?    // SUBSCRIPTION: {sellingPlanGroupId, frequencies[], subscriberDiscount, trialDays}
```

After editing, run: `npx prisma generate` (do NOT run migrate — just generate the client).

---

## Task 2: Expand CreateBundleInput and CreateComponentInput types

**File:** `lib/services/bundle.service.ts`

**Current `CreateBundleInput` (lines 21-30):**
```typescript
export interface CreateBundleInput {
  shop: string;
  name: string;
  title: string;
  description?: string;
  components: CreateComponentInput[];
  discountPercent: number;
  tags?: string[];
  featuredImage?: string;
}
```

**Replace with:**
```typescript
export interface CreateBundleInput {
  shop: string;
  name: string;
  title: string;
  description?: string;
  components: CreateComponentInput[];
  tags?: string[];
  featuredImage?: string;

  // Type — defaults to FIXED for backward compat
  type?: 'FIXED' | 'TIERED' | 'BOGO' | 'MIX_MATCH' | 'BUILD_YOUR_OWN' | 'SUBSCRIPTION' | 'GIFT';

  // Pricing — discountPercent kept for FIXED backward compat
  discountPercent?: number;
  pricingRules?: CreatePricingRuleInput[];

  // Type-specific settings
  selectionRules?: Record<string, unknown>;
  giftSettings?: Record<string, unknown>;
  subscriptionSettings?: Record<string, unknown>;

  // Inventory overrides
  inventoryConfig?: {
    trackingMethod?: 'COMPONENT_BASED' | 'BUNDLE_SPECIFIC' | 'UNLIMITED';
    lowStockThreshold?: number;
    allowOversell?: boolean;
  };

  // Visual overrides (persisted to Bundle.metadata.visual)
  visual?: Record<string, unknown>;
}

export interface CreatePricingRuleInput {
  name: string;
  ruleType: 'BUNDLE_DISCOUNT' | 'VOLUME_TIER' | 'BOGO' | 'MEMBER_PRICE' | 'TIME_LIMITED' | 'FIRST_PURCHASE';
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FIXED_PRICE' | 'FREE_ITEM';
  discountValue: number;
  conditions?: Record<string, unknown>;
  startsAt?: string;
  endsAt?: string;
  priority?: number;
}
```

**Current `CreateComponentInput` (lines 32-36):**
```typescript
export interface CreateComponentInput {
  shopifyProductId: string;
  shopifyVariantId?: string;
  quantity?: number;
}
```

**Replace with:**
```typescript
export interface CreateComponentInput {
  shopifyProductId: string;
  shopifyVariantId?: string;
  quantity?: number;
  isRequired?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  groupId?: string;
  priceAdjustment?: number;
  priceAdjustmentType?: 'NONE' | 'FIXED_AMOUNT' | 'PERCENTAGE' | 'FIXED_PRICE';
}
```

---

## Task 3: Update `createBundle()` method to use dynamic type + component fields

**File:** `lib/services/bundle.service.ts`
**Location:** The `prisma.bundle.create()` call at lines 146-199.

**In the `data` object (line 147-156), change:**
- Line 153: `type: 'FIXED',` → `type: input.type || 'FIXED',`
- After line 156, add:
```typescript
        selectionRules: input.selectionRules || undefined,
        giftSettings: input.giftSettings || undefined,
        subscriptionSettings: input.subscriptionSettings || undefined,
        metadata: input.visual ? { visual: input.visual } : undefined,
```

**In the `components.create` map (lines 158-167), change:**
- Line 161: `quantity: comp.quantity || 1,` → stays the same
- Line 162: `isRequired: true,` → `isRequired: comp.isRequired !== undefined ? comp.isRequired : true,`
- Line 164: `minQuantity: 0,` → `minQuantity: comp.minQuantity ?? 0,`
- Line 165: `maxQuantity: 1,` → `maxQuantity: comp.maxQuantity ?? 1,`
- Line 166: `priceAdjustmentType: 'NONE',` → `priceAdjustmentType: comp.priceAdjustmentType || 'NONE',`
- After line 166, add:
```typescript
            groupId: comp.groupId || undefined,
            priceAdjustment: comp.priceAdjustment ?? undefined,
```

**In the `pricingRules.create` block (lines 169-178), replace the entire block with:**
```typescript
        pricingRules: {
          create: input.pricingRules && input.pricingRules.length > 0
            ? input.pricingRules.map((rule, idx) => ({
                name: rule.name,
                priority: rule.priority ?? idx,
                isActive: true,
                ruleType: rule.ruleType,
                conditions: rule.conditions || {},
                discountType: rule.discountType,
                discountValue: rule.discountValue,
                startsAt: rule.startsAt ? new Date(rule.startsAt) : undefined,
                endsAt: rule.endsAt ? new Date(rule.endsAt) : undefined,
              }))
            : [{
                name: 'Bundle Discount',
                priority: 0,
                isActive: true,
                ruleType: 'BUNDLE_DISCOUNT',
                conditions: {},
                discountType: 'PERCENTAGE',
                discountValue: input.discountPercent ?? 0,
              }],
        },
```

**In the `inventoryRecord.create` block (lines 180-188), replace with:**
```typescript
        inventoryRecord: {
          create: {
            trackingMethod: input.inventoryConfig?.trackingMethod || 'COMPONENT_BASED',
            lowStockThreshold: input.inventoryConfig?.lowStockThreshold ?? 10,
            availableQuantity: 0,
            reservedQuantity: 0,
            allowOversell: input.inventoryConfig?.allowOversell ?? false,
            autoSyncEnabled: true,
          },
        },
```

**Change the metric at line 202:**
- `BundleMetrics.created({ shop: input.shop, bundleType: 'FIXED' });`
- → `BundleMetrics.created({ shop: input.shop, bundleType: input.type || 'FIXED' });`

---

## Task 4: Update the POST handler in the bundles API

**File:** `pages/api/v2/bundles/index.ts`
**Location:** Lines 71-107 (POST handler)

**Replace lines 85-102 (validation + input building) with:**
```typescript
    const bundleType = body.type || 'FIXED';

    // For FIXED backward compat: require discountPercent
    if (bundleType === 'FIXED') {
      if (body.discountPercent === undefined || body.discountPercent < 0 || body.discountPercent > 100) {
        return sendError(res, 'Discount percent must be between 0 and 100');
      }
    }

    // For non-FIXED types: require pricingRules
    if (bundleType !== 'FIXED' && (!body.pricingRules || body.pricingRules.length === 0)) {
      if (body.discountPercent === undefined) {
        return sendError(res, 'Either discountPercent or pricingRules is required');
      }
    }

    const input: CreateBundleInput = {
      shop,
      name: body.name.trim(),
      title: body.title.trim(),
      description: body.description?.trim(),
      type: bundleType,
      components: body.components.map((c: any) => ({
        shopifyProductId: c.shopifyProductId,
        shopifyVariantId: c.shopifyVariantId,
        quantity: c.quantity || 1,
        isRequired: c.isRequired,
        minQuantity: c.minQuantity,
        maxQuantity: c.maxQuantity,
        groupId: c.groupId,
        priceAdjustment: c.priceAdjustment,
        priceAdjustmentType: c.priceAdjustmentType,
      })),
      discountPercent: body.discountPercent,
      pricingRules: body.pricingRules,
      selectionRules: body.selectionRules,
      giftSettings: body.giftSettings,
      subscriptionSettings: body.subscriptionSettings,
      inventoryConfig: body.inventoryConfig,
      visual: body.visual,
      tags: body.tags,
      featuredImage: body.featuredImage,
    };
```

Keep lines 76-84 (name/title/components validation) unchanged.
Keep lines 104-106 (createBundle call + response) unchanged.

Also add the type import if not present — `CreateBundleInput` is already imported from the bundle service.

---

## Task 5: Enable feature flags

**File:** `config/feature-flags.ts`
**Lines 50-51:** Change:
```typescript
  BOGO_BUNDLES: false,
  TIERED_PRICING: false,
```
To:
```typescript
  BOGO_BUNDLES: true,
  TIERED_PRICING: true,
```

---

## Task 6: Run prisma generate

```bash
npx prisma generate
```

---

## Verification
After all edits:
1. `npx prisma generate` should succeed
2. `npx tsc --noEmit 2>&1 | grep "bundle.service\|bundles/index\|feature-flags\|schema.prisma"` should show 0 errors from these files
3. The existing FIXED bundle creation flow still works (backward compatible — `discountPercent` still accepted, `type` defaults to `'FIXED'`)

## Commit message
```
Unlock all 7 bundle types in schema, service, and API

- Add selectionRules, giftSettings, subscriptionSettings JSON fields to Bundle model
- Expand CreateBundleInput to accept type, pricingRules[], component flexibility
- Bundle service createBundle() now uses dynamic type instead of hardcoded FIXED
- Components support isRequired, min/maxQuantity, groupId, priceAdjustment
- API POST /v2/bundles accepts type + pricingRules alongside legacy discountPercent
- Enable BOGO_BUNDLES and TIERED_PRICING feature flags
- Full backward compatibility: FIXED bundles with discountPercent still work
```

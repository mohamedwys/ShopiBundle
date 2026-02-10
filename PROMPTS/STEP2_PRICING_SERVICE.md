# STEP 2: Pricing Service — All Discount Types + Stacking

## Context
`lib/services/pricing.service.ts` (240 lines) only has `calculateFixedBundlePrice()` (percentage discount). The `calculateBundlePrice()` method at line 134 filters for `ruleType === 'BUNDLE_DISCOUNT' && discountType === 'PERCENTAGE'` only — ignoring all other rule types and discount types. This step adds full pricing for every bundle type and discount type.

## DO NOT re-analyze the codebase. All info is below. Just make the edits.

---

## Task 1: Add new pricing methods to the PricingService class

**File:** `lib/services/pricing.service.ts`

**After `calculateFixedBundlePrice()` (ends at line 128), add these methods inside the class (before `calculateBundlePrice` at line 134):**

### Method: `calculateWithDiscount` (replaces the single-type logic)
```typescript
  /**
   * Apply any discount type to a set of components.
   * Handles PERCENTAGE, FIXED_AMOUNT, FIXED_PRICE, FREE_ITEM.
   */
  private calculateWithDiscount(
    components: PricingComponent[],
    discountType: string,
    discountValue: number,
    freeComponentIds?: string[]
  ): PricingResult {
    const lineItems: PricingLineItem[] = components.map((comp) => {
      const unitPrice = comp.cachedPrice || 0;
      const linePrice = unitPrice * comp.quantity;
      return {
        componentId: comp.id,
        productId: comp.shopifyProductId,
        title: comp.cachedTitle || `Product ${comp.shopifyProductId}`,
        quantity: comp.quantity,
        unitPrice,
        linePrice,
        discountedLinePrice: linePrice,
        lineDiscount: 0,
      };
    });

    const originalPrice = lineItems.reduce((sum, item) => sum + item.linePrice, 0);
    let discountAmount = 0;

    switch (discountType) {
      case 'PERCENTAGE': {
        const pct = Math.min(Math.max(discountValue, 0), 100);
        discountAmount = originalPrice * (pct / 100);
        // Distribute proportionally
        if (originalPrice > 0) {
          lineItems.forEach((item) => {
            const proportion = item.linePrice / originalPrice;
            item.lineDiscount = discountAmount * proportion;
            item.discountedLinePrice = item.linePrice - item.lineDiscount;
          });
        }
        break;
      }
      case 'FIXED_AMOUNT': {
        discountAmount = Math.min(discountValue, originalPrice);
        // Distribute proportionally
        if (originalPrice > 0) {
          lineItems.forEach((item) => {
            const proportion = item.linePrice / originalPrice;
            item.lineDiscount = discountAmount * proportion;
            item.discountedLinePrice = item.linePrice - item.lineDiscount;
          });
        }
        break;
      }
      case 'FIXED_PRICE': {
        // Total bundle costs exactly discountValue
        const targetPrice = Math.max(discountValue, 0);
        discountAmount = Math.max(0, originalPrice - targetPrice);
        if (originalPrice > 0) {
          lineItems.forEach((item) => {
            const proportion = item.linePrice / originalPrice;
            item.lineDiscount = discountAmount * proportion;
            item.discountedLinePrice = item.linePrice - item.lineDiscount;
          });
        }
        break;
      }
      case 'FREE_ITEM': {
        // Make specific components free
        lineItems.forEach((item) => {
          if (freeComponentIds && freeComponentIds.includes(item.componentId)) {
            item.lineDiscount = item.linePrice;
            item.discountedLinePrice = 0;
            discountAmount += item.linePrice;
          }
        });
        break;
      }
    }

    const discountedPrice = Math.max(0, originalPrice - discountAmount);

    return {
      originalPrice: this.roundPrice(originalPrice),
      discountedPrice: this.roundPrice(discountedPrice),
      savings: this.roundPrice(discountAmount),
      savingsPercentage: originalPrice > 0 ? this.roundPrice((discountAmount / originalPrice) * 100) : 0,
      lineItems,
      appliedDiscount: discountAmount > 0 ? {
        type: discountType as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FIXED_PRICE',
        value: discountValue,
        amount: this.roundPrice(discountAmount),
        description: this.buildDiscountDescription(discountType, discountValue),
      } : null,
    };
  }

  private buildDiscountDescription(discountType: string, value: number): string {
    switch (discountType) {
      case 'PERCENTAGE': return `${value}% bundle discount`;
      case 'FIXED_AMOUNT': return `$${value} off bundle`;
      case 'FIXED_PRICE': return `Bundle for $${value}`;
      case 'FREE_ITEM': return `Free item included`;
      default: return `Bundle discount`;
    }
  }
```

### Method: `calculateTieredBundlePrice`
```typescript
  /**
   * Calculate price for a tiered/volume bundle.
   * Finds the best matching tier based on quantity, applies that tier's discount.
   */
  calculateTieredBundlePrice(
    components: PricingComponent[],
    tiers: PricingRule[],
    quantity: number
  ): PricingResult {
    // Sort tiers by minQuantity descending to find best match
    const sortedTiers = [...tiers]
      .filter(t => t.isActive && t.ruleType === 'VOLUME_TIER')
      .sort((a, b) => {
        const aMin = (a.conditions as any)?.minQuantity ?? 0;
        const bMin = (b.conditions as any)?.minQuantity ?? 0;
        return bMin - aMin;
      });

    // Find the best matching tier (highest minQuantity that quantity satisfies)
    const matchedTier = sortedTiers.find(t => {
      const minQty = (t.conditions as any)?.minQuantity ?? 1;
      return quantity >= minQty;
    });

    if (!matchedTier) {
      // No tier matches — return full price
      return this.calculateWithDiscount(components, 'PERCENTAGE', 0);
    }

    // Scale components by quantity
    const scaledComponents = components.map(c => ({
      ...c,
      quantity: c.quantity * quantity,
    }));

    const result = this.calculateWithDiscount(
      scaledComponents,
      matchedTier.discountType,
      Number(matchedTier.discountValue)
    );

    PricingMetrics.calculated('TIERED', 0);
    if (result.savings > 0) PricingMetrics.discountApplied('VOLUME_TIER', result.savings);
    return result;
  }
```

### Method: `calculateBogoBundlePrice`
```typescript
  /**
   * Calculate BOGO pricing.
   * buyComponents are at full price, freeComponents are discounted per the rule.
   */
  calculateBogoBundlePrice(
    buyComponents: PricingComponent[],
    freeComponents: PricingComponent[],
    bogoRule: PricingRule
  ): PricingResult {
    const allComponents = [...buyComponents, ...freeComponents];
    const freeIds = freeComponents.map(c => c.id);

    if (bogoRule.discountType === 'FREE_ITEM') {
      // "Get" items are completely free
      const result = this.calculateWithDiscount(allComponents, 'FREE_ITEM', 0, freeIds);
      PricingMetrics.calculated('BOGO', 0);
      return result;
    }

    // "Get" items at a discount (e.g. 50% off the free items)
    // Calculate full price of all items, then discount only the free items
    const lineItems: PricingLineItem[] = allComponents.map((comp) => {
      const unitPrice = comp.cachedPrice || 0;
      const linePrice = unitPrice * comp.quantity;
      const isFree = freeIds.includes(comp.id);
      let lineDiscount = 0;

      if (isFree) {
        if (bogoRule.discountType === 'PERCENTAGE') {
          lineDiscount = linePrice * (Number(bogoRule.discountValue) / 100);
        } else if (bogoRule.discountType === 'FIXED_AMOUNT') {
          lineDiscount = Math.min(Number(bogoRule.discountValue), linePrice);
        }
      }

      return {
        componentId: comp.id,
        productId: comp.shopifyProductId,
        title: comp.cachedTitle || `Product ${comp.shopifyProductId}`,
        quantity: comp.quantity,
        unitPrice,
        linePrice,
        discountedLinePrice: linePrice - lineDiscount,
        lineDiscount,
      };
    });

    const originalPrice = lineItems.reduce((sum, i) => sum + i.linePrice, 0);
    const discountAmount = lineItems.reduce((sum, i) => sum + i.lineDiscount, 0);

    PricingMetrics.calculated('BOGO', 0);
    return {
      originalPrice: this.roundPrice(originalPrice),
      discountedPrice: this.roundPrice(originalPrice - discountAmount),
      savings: this.roundPrice(discountAmount),
      savingsPercentage: originalPrice > 0 ? this.roundPrice((discountAmount / originalPrice) * 100) : 0,
      lineItems,
      appliedDiscount: discountAmount > 0 ? {
        type: bogoRule.discountType as any,
        value: Number(bogoRule.discountValue),
        amount: this.roundPrice(discountAmount),
        description: 'Buy one get one deal',
      } : null,
    };
  }
```

### Method: `calculateMixMatchBundlePrice`
```typescript
  /**
   * Calculate price for mix-and-match bundles.
   * Only selected components are priced; discount applies to the selection total.
   */
  calculateMixMatchBundlePrice(
    selectedComponents: PricingComponent[],
    rule: PricingRule
  ): PricingResult {
    const result = this.calculateWithDiscount(
      selectedComponents,
      rule.discountType,
      Number(rule.discountValue)
    );
    PricingMetrics.calculated('MIX_MATCH', 0);
    return result;
  }
```

---

## Task 2: Rewrite `calculateBundlePrice()` to dispatch by rule type

**Replace lines 134-147 with:**

```typescript
  /**
   * Calculate price with multiple rules.
   * Dispatches to type-specific calculators, then applies stacked secondary rules.
   */
  calculateBundlePrice(
    components: PricingComponent[],
    rules: PricingRule[],
    context?: PricingContext
  ): PricingResult {
    const activeRules = rules.filter(r => r.isActive);

    // Check time-limited rules: filter out expired/not-started rules
    const now = context?.now || new Date();
    const validRules = activeRules.filter(r => {
      if (r.ruleType === 'TIME_LIMITED') {
        const conditions = r.conditions as any;
        if (conditions?.startsAt && new Date(conditions.startsAt) > now) return false;
        if (conditions?.endsAt && new Date(conditions.endsAt) < now) return false;
      }
      return true;
    });

    // Find the primary discount rule (highest priority)
    const primaryRule = validRules
      .filter(r => ['BUNDLE_DISCOUNT', 'VOLUME_TIER', 'BOGO', 'TIME_LIMITED'].includes(r.ruleType))
      .sort((a, b) => (a as any).priority - (b as any).priority)[0];

    if (!primaryRule) {
      // No active discount — return full price
      return this.calculateWithDiscount(components, 'PERCENTAGE', 0);
    }

    // Calculate base result from primary rule
    let result: PricingResult;

    if (primaryRule.ruleType === 'VOLUME_TIER') {
      const tierRules = validRules.filter(r => r.ruleType === 'VOLUME_TIER');
      result = this.calculateTieredBundlePrice(components, tierRules, context?.quantity || 1);
    } else {
      result = this.calculateWithDiscount(
        components,
        primaryRule.discountType,
        Number(primaryRule.discountValue)
      );
    }

    // Apply secondary stacked discounts (MEMBER_PRICE, FIRST_PURCHASE)
    const secondaryRules = validRules.filter(r =>
      ['MEMBER_PRICE', 'FIRST_PURCHASE'].includes(r.ruleType)
    );

    for (const rule of secondaryRules) {
      if (rule.ruleType === 'MEMBER_PRICE' && context?.customerTags) {
        const requiredTags = (rule.conditions as any)?.requiredTags || [];
        const hasTag = requiredTags.some((tag: string) => context.customerTags!.includes(tag));
        if (!hasTag) continue;
      }
      if (rule.ruleType === 'FIRST_PURCHASE' && !context?.isFirstPurchase) {
        continue;
      }

      // Apply additional discount on already-discounted price
      const additionalDiscount = rule.discountType === 'PERCENTAGE'
        ? result.discountedPrice * (Number(rule.discountValue) / 100)
        : Math.min(Number(rule.discountValue), result.discountedPrice);

      result = {
        ...result,
        discountedPrice: this.roundPrice(result.discountedPrice - additionalDiscount),
        savings: this.roundPrice(result.savings + additionalDiscount),
        savingsPercentage: result.originalPrice > 0
          ? this.roundPrice(((result.savings + additionalDiscount) / result.originalPrice) * 100)
          : 0,
      };
    }

    const bundleType = primaryRule.ruleType === 'VOLUME_TIER' ? 'TIERED' : 'FIXED';
    PricingMetrics.calculated(bundleType, 0);

    return result;
  }
```

---

## Task 3: Expand PricingContext

**At lines 215-220, replace PricingContext with:**
```typescript
export interface PricingContext {
  customerId?: string;
  customerTags?: string[];
  quantity?: number;
  currencyCode?: string;
  now?: Date;
  isFirstPurchase?: boolean;
}
```

This interface already has `customerId` and `customerTags` but is missing `now` and `isFirstPurchase`. Add them.

---

## Verification
1. `npx tsc --noEmit 2>&1 | grep "pricing.service"` should show 0 errors
2. The existing `calculateFixedBundlePrice()` method is UNTOUCHED — backward compatible
3. `calculateBundlePrice()` still returns a `PricingResult` (same type)

## Commit message
```
Implement full pricing engine for all discount types and bundle types

- Add calculateWithDiscount() supporting PERCENTAGE, FIXED_AMOUNT, FIXED_PRICE, FREE_ITEM
- Add calculateTieredBundlePrice() for volume-based tier matching
- Add calculateBogoBundlePrice() for buy-X-get-Y pricing
- Add calculateMixMatchBundlePrice() for customer-selected component pricing
- Rewrite calculateBundlePrice() to dispatch by ruleType with stacked discount support
- Support MEMBER_PRICE (customer tag check) and FIRST_PURCHASE secondary discounts
- TIME_LIMITED rules filtered by current time
- Expand PricingContext with now and isFirstPurchase fields
- Full backward compatibility: calculateFixedBundlePrice() untouched
```

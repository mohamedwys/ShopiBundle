# STEP 3: Discount Function — BOGO Free Items + MIX_MATCH Optional Components

## Context
The Shopify Discount Function at `extensions/bundle-discount/src/` enforces bundle presence in cart at checkout. It currently handles `percentage` and `fixed_amount` discount types. This step adds `free_item` support for BOGO and optional-component matching for MIX_MATCH/BUILD_YOUR_OWN.

## DO NOT re-analyze the codebase. All info is below. Just make the edits.

---

## Task 1: Extend types in `extensions/bundle-discount/src/types.ts`

**Current `BundleDiscountConfig` (line 54-60):**
```typescript
export interface BundleDiscountConfig {
  bundleId: string;
  bundles: BundleDefinition[];
}
```

**Replace with:**
```typescript
export interface BundleDiscountConfig {
  bundleId: string;
  bundleType?: "FIXED" | "TIERED" | "BOGO" | "MIX_MATCH" | "BUILD_YOUR_OWN" | "SUBSCRIPTION" | "GIFT";
  bundles: BundleDefinition[];
}
```

**Current `BundleDefinition` (lines 62-77):**
```typescript
export interface BundleDefinition {
  tierId?: string;
  minBundleSets: number;
  maxBundleSets: number;
  components: BundleComponent[];
  discount: BundleDiscountValue;
}
```

**Replace with:**
```typescript
export interface BundleDefinition {
  tierId?: string;
  minBundleSets: number;
  maxBundleSets: number;
  components: BundleComponent[];
  discount: BundleDiscountValue;

  // BOGO: items that become free/discounted when bundle is matched
  freeItems?: BundleComponent[];
  freeItemDiscount?: BundleDiscountValue;

  // MIX_MATCH / BUILD_YOUR_OWN: optional product pool
  optionalComponents?: BundleComponent[];
  minRequiredOptional?: number;
}
```

**Current `BundleDiscountValue` (lines 90-96):**
```typescript
export interface BundleDiscountValue {
  type: "percentage" | "fixed_amount";
  value: number;
}
```

**Replace with:**
```typescript
export interface BundleDiscountValue {
  type: "percentage" | "fixed_amount" | "free_item";
  value: number;
}
```

---

## Task 2: Add `_bundle_tier` attribute to run.graphql

**File:** `extensions/bundle-discount/src/run.graphql`

**Current (25 lines):**
```graphql
query RunInput {
  cart {
    lines {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          id
          product {
            id
          }
        }
      }
      attribute(key: "_bundle_id") {
        value
      }
    }
  }
  discountNode {
    metafield(namespace: "shopibundle", key: "bundle_config") {
      value
    }
  }
}
```

**Replace with:**
```graphql
query RunInput {
  cart {
    lines {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          id
          product {
            id
          }
        }
      }
      attribute(key: "_bundle_id") {
        value
      }
      tierAttribute: attribute(key: "_bundle_tier") {
        value
      }
    }
  }
  discountNode {
    metafield(namespace: "shopibundle", key: "bundle_config") {
      value
    }
  }
}
```

**Also update the `CartLine` interface in types.ts.** Current (lines 21-26):
```typescript
export interface CartLine {
  id: string;
  quantity: number;
  merchandise: ProductVariant;
  attribute: CartAttribute | null;
}
```

**Replace with:**
```typescript
export interface CartLine {
  id: string;
  quantity: number;
  merchandise: ProductVariant;
  attribute: CartAttribute | null;
  tierAttribute: CartAttribute | null;
}
```

---

## Task 3: Add `free_item` to `buildDiscountValue` in index.ts

**File:** `extensions/bundle-discount/src/index.ts`

**Current `buildDiscountValue` (lines 292-318):**
```typescript
function buildDiscountValue(definition: BundleDefinition): Discount["value"] | null {
  const { discount } = definition;

  if (discount.type === "percentage") {
    // ... returns percentage
  }

  if (discount.type === "fixed_amount") {
    // ... returns fixedAmount
  }

  return null;
}
```

**Replace the entire function with:**
```typescript
function buildDiscountValue(definition: BundleDefinition): Discount["value"] | null {
  const { discount } = definition;

  if (discount.type === "percentage") {
    if (discount.value <= 0 || discount.value > 100) {
      return null;
    }
    return {
      percentage: {
        value: discount.value.toString(),
      },
    };
  }

  if (discount.type === "fixed_amount") {
    if (discount.value <= 0) {
      return null;
    }
    return {
      fixedAmount: {
        amount: discount.value.toString(),
      },
    };
  }

  if (discount.type === "free_item") {
    // Free items get 100% discount
    return {
      percentage: {
        value: "100",
      },
    };
  }

  return null;
}
```

---

## Task 4: Add BOGO free-item discount building in `buildDiscount`

**File:** `extensions/bundle-discount/src/index.ts`

**Current `buildDiscount` function (lines 258-290).** After the existing `targets` and `value` building, and BEFORE the `return` statement, add handling for free items.

**Replace the entire `buildDiscount` function with:**
```typescript
function buildDiscount(
  definition: BundleDefinition,
  matchResult: BundleMatchResult
): Discount | null {
  if (!matchResult.matched || matchResult.matchedLines.length === 0) {
    return null;
  }

  const discounts: Discount[] = [];

  // Primary discount: applies to all matched lines
  const primaryTargets: ProductVariantTarget[] = matchResult.matchedLines.map((ml) => ({
    productVariant: {
      id: ml.variantId,
      quantity: ml.quantityUsed,
    },
  }));

  const primaryValue = buildDiscountValue(definition);
  if (primaryValue) {
    const tierLabel = definition.tierId ? ` (${definition.tierId})` : "";
    const setsLabel = matchResult.bundleSets > 1 ? ` x${matchResult.bundleSets}` : "";
    discounts.push({
      message: `Bundle discount${tierLabel}${setsLabel}`,
      targets: primaryTargets,
      value: primaryValue,
    });
  }

  // BOGO free-item discount: applies to freeItems matched lines
  if (matchResult.freeItemLines && matchResult.freeItemLines.length > 0) {
    const freeTargets: ProductVariantTarget[] = matchResult.freeItemLines.map((ml) => ({
      productVariant: {
        id: ml.variantId,
        quantity: ml.quantityUsed,
      },
    }));

    const freeDiscount = definition.freeItemDiscount || { type: "free_item" as const, value: 100 };
    const freeValue = buildDiscountValue({ ...definition, discount: freeDiscount });
    if (freeValue) {
      discounts.push({
        message: "Free item (BOGO)",
        targets: freeTargets,
        value: freeValue,
      });
    }
  }

  // Return the first discount (Shopify applies one discount per target)
  // For BOGO, we return both — Shopify handles multiple discounts via FIRST strategy
  return discounts[0] || null;
}
```

Wait — the function returns a single `Discount`. But we need to return multiple discounts for BOGO (primary items get no discount, free items get 100% off). The caller in `run()` pushes into `allDiscounts[]`. So change `buildDiscount` to return `Discount[]`:

**Actually, replace the return type and adjust.** Change the function signature:
```typescript
function buildDiscount(
  definition: BundleDefinition,
  matchResult: BundleMatchResult
): Discount[] {
```

And change the call site in `run()` at lines 76-79:
```typescript
    // OLD:
    // const discount = buildDiscount(bundleDef, result);
    // if (discount) {
    //   allDiscounts.push(discount);
    // }

    // NEW:
    const discounts = buildDiscount(bundleDef, result);
    for (let i = 0; i < discounts.length; i++) {
      allDiscounts.push(discounts[i]);
    }
```

---

## Task 5: Add `freeItemLines` to BundleMatchResult and update matchBundle

**In types.ts, update `BundleMatchResult`:**
```typescript
export interface BundleMatchResult {
  matched: boolean;
  bundleSets: number;
  matchedLines: MatchedLine[];
  freeItemLines?: MatchedLine[];
  definition: BundleDefinition;
}
```

**In index.ts `matchBundle()` function, after the main matching logic (after line 247 `return { matched: true, ... }`), add free-item matching.**

Replace the success return at the end of matchBundle (currently lines 242-248):
```typescript
  // Match free items (BOGO)
  let freeItemLines: MatchedLine[] = [];
  if (definition.freeItems && definition.freeItems.length > 0) {
    for (const freeComp of definition.freeItems) {
      let needed = freeComp.quantity * bundleSets;

      for (const line of cartLines) {
        if (needed <= 0) break;
        const available = remainingQuantity.get(line.id) || 0;
        if (available <= 0) continue;
        if (line.merchandise.product.id !== freeComp.productId) continue;
        if (freeComp.variantId && line.merchandise.id !== freeComp.variantId) continue;

        const take = Math.min(needed, available);
        if (take > 0) {
          freeItemLines.push({
            lineId: line.lineId || line.id,
            variantId: line.merchandise.id,
            quantityUsed: take,
          });
          // Deduct from remaining so free items aren't double-counted
          remainingQuantity.set(line.id, available - take);
          needed -= take;
        }
      }

      // If free items not fully available, still match the bundle
      // (customer just doesn't get the full free items)
    }
  }

  // Match optional components (MIX_MATCH / BUILD_YOUR_OWN)
  if (definition.optionalComponents && definition.minRequiredOptional) {
    let optionalMatched = 0;
    for (const optComp of definition.optionalComponents) {
      for (const line of cartLines) {
        const available = remainingQuantity.get(line.id) || 0;
        if (available <= 0) continue;
        if (line.merchandise.product.id !== optComp.productId) continue;
        if (optComp.variantId && line.merchandise.id !== optComp.variantId) continue;

        const lineBundleAttr = line.attribute?.value;
        if (lineBundleAttr && lineBundleAttr !== bundleId) continue;

        if (available >= optComp.quantity) {
          optionalMatched++;
          const take = optComp.quantity;
          matchedLines.push({
            lineId: line.id,
            variantId: line.merchandise.id,
            quantityUsed: take,
          });
          remainingQuantity.set(line.id, available - take);
          break;
        }
      }
    }

    if (optionalMatched < definition.minRequiredOptional) {
      return noMatch;
    }
  }

  return {
    matched: true,
    bundleSets,
    matchedLines,
    freeItemLines,
    definition,
  };
```

---

## Task 6: Add test cases

**File:** `extensions/bundle-discount/src/index.test.ts`

**Add these test cases at the end of the test file (before the closing bracket):**

```typescript
describe("BOGO free items", () => {
  it("applies 100% discount to free items when buy items are present", () => {
    const input = buildTestInput({
      bundleId: "bogo-bundle",
      bundles: [{
        minBundleSets: 1,
        maxBundleSets: 1,
        components: [{ productId: "gid://shopify/Product/1", quantity: 1 }],
        discount: { type: "percentage", value: 0 },
        freeItems: [{ productId: "gid://shopify/Product/2", quantity: 1 }],
        freeItemDiscount: { type: "free_item", value: 100 },
      }],
    }, [
      { productId: "1", variantId: "v1", quantity: 1 },
      { productId: "2", variantId: "v2", quantity: 1 },
    ]);

    const result = run(input);
    expect(result.discounts.length).toBeGreaterThan(0);
    // The free item should get 100% discount
    const freeDiscount = result.discounts.find(d => d.message?.includes("Free item"));
    if (freeDiscount) {
      expect((freeDiscount.value as any).percentage.value).toBe("100");
    }
  });

  it("still matches bundle even if free item not in cart", () => {
    const input = buildTestInput({
      bundleId: "bogo-bundle",
      bundles: [{
        minBundleSets: 1,
        maxBundleSets: 1,
        components: [{ productId: "gid://shopify/Product/1", quantity: 1 }],
        discount: { type: "percentage", value: 10 },
        freeItems: [{ productId: "gid://shopify/Product/2", quantity: 1 }],
      }],
    }, [
      { productId: "1", variantId: "v1", quantity: 1 },
    ]);

    const result = run(input);
    expect(result.discounts.length).toBeGreaterThan(0);
  });
});

describe("MIX_MATCH optional components", () => {
  it("matches when enough optional components are present", () => {
    const input = buildTestInput({
      bundleId: "mix-match",
      bundles: [{
        minBundleSets: 1,
        maxBundleSets: 1,
        components: [],
        discount: { type: "percentage", value: 15 },
        optionalComponents: [
          { productId: "gid://shopify/Product/1", quantity: 1 },
          { productId: "gid://shopify/Product/2", quantity: 1 },
          { productId: "gid://shopify/Product/3", quantity: 1 },
        ],
        minRequiredOptional: 2,
      }],
    }, [
      { productId: "1", variantId: "v1", quantity: 1 },
      { productId: "3", variantId: "v3", quantity: 1 },
    ]);

    const result = run(input);
    expect(result.discounts.length).toBeGreaterThan(0);
  });

  it("does not match when too few optional components", () => {
    const input = buildTestInput({
      bundleId: "mix-match",
      bundles: [{
        minBundleSets: 1,
        maxBundleSets: 1,
        components: [],
        discount: { type: "percentage", value: 15 },
        optionalComponents: [
          { productId: "gid://shopify/Product/1", quantity: 1 },
          { productId: "gid://shopify/Product/2", quantity: 1 },
          { productId: "gid://shopify/Product/3", quantity: 1 },
        ],
        minRequiredOptional: 2,
      }],
    }, [
      { productId: "1", variantId: "v1", quantity: 1 },
    ]);

    const result = run(input);
    expect(result.discounts.length).toBe(0);
  });
});
```

Note: You'll need to check the existing test helper `buildTestInput` in the test file and adapt the test accordingly. The helper may need to accept `freeItems`, `freeItemDiscount`, `optionalComponents`, `minRequiredOptional` in the bundle definition.

---

## Verification
1. Run: `cd extensions/bundle-discount && npm test` — all tests should pass
2. `npx tsc --noEmit` from `extensions/bundle-discount/` — 0 errors

## Commit message
```
Extend Discount Function for BOGO free items and MIX_MATCH optional components

- Add free_item discount type (100% off) for BOGO get-items
- Add freeItems[] and freeItemDiscount to BundleDefinition
- Add optionalComponents[] and minRequiredOptional for MIX_MATCH validation
- buildDiscount() now returns Discount[] to support multiple discount targets
- matchBundle() handles free-item allocation and optional-component counting
- Add _bundle_tier attribute to run.graphql
- Add test cases for BOGO and MIX_MATCH scenarios
```

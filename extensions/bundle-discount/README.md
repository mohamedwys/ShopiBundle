# Bundle Discount Function

Shopify Function that enforces complete bundle presence in cart before applying any discount. Replaces the insecure `DiscountAutomaticBasic` approach.

## How It Works

### Data Flow: App -> Cart -> Function

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. PUBLISH BUNDLE (App Backend)                                 │
│                                                                 │
│    bundle.service.ts → publishBundle()                          │
│         │                                                       │
│         ▼                                                       │
│    shopify-integration.service.ts → createFunctionDiscount()    │
│         │                                                       │
│         ├─ GraphQL: discountAutomaticAppCreate                  │
│         │   └─ functionId: "bundle-discount"                    │
│         │   └─ metafields: [{                                   │
│         │       namespace: "shopibundle",                       │
│         │       key: "bundle_config",                           │
│         │       value: <BundleDiscountConfig JSON>              │
│         │     }]                                                │
│         │                                                       │
│         ▼                                                       │
│    Shopify creates DiscountAutomaticApp linked to this Function │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 2. ADD TO CART (Storefront Widget)                              │
│                                                                 │
│    BundleWidget.tsx → handleAddToCart()                          │
│         │                                                       │
│         ▼                                                       │
│    POST /cart/add.js with items:                                │
│    [                                                            │
│      {                                                          │
│        variantId: 12345,                                        │
│        quantity: 1,                                             │
│        properties: {                                            │
│          _bundle_id: "bundle-abc123",                           │
│          _bundle_tier: "tier_3pack"                             │
│        }                                                        │
│      },                                                         │
│      ...more items                                              │
│    ]                                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 3. CHECKOUT / CART EVALUATION (Shopify Function)                │
│                                                                 │
│    Shopify evaluates all active automatic discounts             │
│         │                                                       │
│         ▼                                                       │
│    run.graphql fetches:                                         │
│      - cart.lines[].merchandise (product + variant IDs)         │
│      - cart.lines[].quantity                                    │
│      - cart.lines[].attribute("_bundle_id")                     │
│      - discountNode.metafield("shopibundle", "bundle_config")   │
│         │                                                       │
│         ▼                                                       │
│    Function validates:                                          │
│      ✓ All required products present?                           │
│      ✓ Required quantities met?                                 │
│      ✓ Variant IDs match (if specified)?                        │
│      ✓ _bundle_id attribute matches?                            │
│         │                                                       │
│         ▼                                                       │
│    If ALL conditions pass → return discount targets             │
│    If ANY condition fails → return empty (no discount)          │
└─────────────────────────────────────────────────────────────────┘
```

## Bundle Config Structure (Metafield)

Stored in `shopibundle.bundle_config` on the discount node:

```json
{
  "bundleId": "clx1abc123def",
  "bundles": [
    {
      "tierId": "tier_3pack",
      "minBundleSets": 1,
      "maxBundleSets": 0,
      "components": [
        {
          "productId": "gid://shopify/Product/123",
          "variantId": "gid://shopify/ProductVariant/456",
          "quantity": 1
        },
        {
          "productId": "gid://shopify/Product/789",
          "quantity": 2
        }
      ],
      "discount": {
        "type": "percentage",
        "value": 20
      }
    }
  ]
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `bundleId` | string | App database bundle ID |
| `bundles` | array | One or more bundle definitions (multiple for tiered) |
| `bundles[].tierId` | string? | Tier identifier for tiered bundles |
| `bundles[].minBundleSets` | number | Minimum complete sets required (default 1) |
| `bundles[].maxBundleSets` | number | Maximum sets to discount (0 = unlimited) |
| `bundles[].components` | array | Products required in the bundle |
| `bundles[].components[].productId` | string | Shopify Product GID |
| `bundles[].components[].variantId` | string? | Optional specific variant required |
| `bundles[].components[].quantity` | number | Required quantity per bundle set |
| `bundles[].discount.type` | string | "percentage" or "fixed_amount" |
| `bundles[].discount.value` | number | Discount value (0-100 for %, amount for fixed) |

## Cart Input Structure (run.graphql)

```graphql
query RunInput {
  cart {
    lines {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          id            # gid://shopify/ProductVariant/...
          product {
            id          # gid://shopify/Product/...
          }
        }
      }
      attribute(key: "_bundle_id") {
        value           # "bundle-abc123" or null
      }
    }
  }
  discountNode {
    metafield(namespace: "shopibundle", key: "bundle_config") {
      value             # JSON string of BundleDiscountConfig
    }
  }
}
```

## Test Scenarios

### Scenario 1: Complete Bundle -> Discount Applies

**Setup:** Bundle requires Product A (qty 1) + Product B (qty 1), 15% off

**Cart:**
| Line | Product | Variant | Qty | _bundle_id |
|------|---------|---------|-----|------------|
| 1 | Product A | Variant A1 | 1 | bundle-123 |
| 2 | Product B | Variant B1 | 1 | bundle-123 |

**Expected:** 15% discount on both lines (qty 1 each)

---

### Scenario 2: Incomplete Bundle -> No Discount

**Setup:** Bundle requires Product A + Product B + Product C, 20% off

**Cart:**
| Line | Product | Variant | Qty | _bundle_id |
|------|---------|---------|-----|------------|
| 1 | Product A | Variant A1 | 1 | bundle-123 |
| 2 | Product B | Variant B1 | 1 | bundle-123 |

**Expected:** No discount (Product C missing)

---

### Scenario 3: Quantity Manipulation -> No Discount Abuse

**Setup:** Bundle requires Product A (qty 1) + Product B (qty 1), 15% off

**Cart:**
| Line | Product | Variant | Qty | _bundle_id |
|------|---------|---------|-----|------------|
| 1 | Product A | Variant A1 | 5 | bundle-123 |

**Expected:** No discount (Product B missing, regardless of quantity)

---

### Scenario 4: Multiple Complete Bundles

**Setup:** Bundle requires Product A (qty 1) + Product B (qty 1), 10% off, maxBundleSets=0

**Cart:**
| Line | Product | Variant | Qty |
|------|---------|---------|-----|
| 1 | Product A | Variant A1 | 3 |
| 2 | Product B | Variant B1 | 3 |

**Expected:** 10% discount on 3 units of each (3 complete bundle sets)

---

### Scenario 5: Tiered Bundle (Best Tier Wins)

**Setup:**
- Tier 1: 1 set, 10% off
- Tier 2: 2 sets, 15% off
- Tier 3: 3 sets, 25% off

Bundle components: Product A (qty 1) + Product B (qty 1)

**Cart:**
| Line | Product | Variant | Qty |
|------|---------|---------|-----|
| 1 | Product A | Variant A1 | 2 |
| 2 | Product B | Variant B1 | 2 |

**Expected:** Tier 2 applies (15% off on 2 units each). Tier 3 not possible (only 2 sets). Tier 2 beats Tier 1 because bundle definitions are sorted by discount value descending.

---

### Scenario 6: Variant Mismatch -> No Discount

**Setup:** Bundle requires Product A, Variant A1 specifically

**Cart:**
| Line | Product | Variant | Qty | _bundle_id |
|------|---------|---------|-----|------------|
| 1 | Product A | Variant A2 | 1 | bundle-123 |
| 2 | Product B | Variant B1 | 1 | bundle-123 |

**Expected:** No discount (wrong variant for Product A)

---

### Scenario 7: Mixed Bundle and Non-Bundle Items

**Cart:**
| Line | Product | Variant | Qty | _bundle_id |
|------|---------|---------|-----|------------|
| 1 | Product A | Variant A1 | 1 | bundle-123 |
| 2 | Product B | Variant B1 | 1 | bundle-123 |
| 3 | Product C | Variant C1 | 2 | (none) |

**Expected:** Discount on lines 1 & 2 only. Line 3 unaffected.

---

### Scenario 8: Two Different Bundles in Cart

**Setup:**
- Bundle 1: Product A + Product B, 10% off (discount node 1)
- Bundle 2: Product C + Product D, 20% off (discount node 2)

**Cart:**
| Line | Product | Variant | Qty | _bundle_id |
|------|---------|---------|-----|------------|
| 1 | Product A | Variant A1 | 1 | bundle-1 |
| 2 | Product B | Variant B1 | 1 | bundle-1 |
| 3 | Product C | Variant C1 | 1 | bundle-2 |
| 4 | Product D | Variant D1 | 1 | bundle-2 |

**Expected:** Each discount Function evaluates independently. Bundle 1 gets 10% on lines 1-2. Bundle 2 gets 20% on lines 3-4. No cross-contamination.

---

### Scenario 9: Invalid/Missing Config -> Silent Failure

**Setup:** Discount metafield is empty or malformed JSON

**Expected:** Function returns empty discounts array. No error. No discount.

---

### Scenario 10: Bundle with Zero Discount -> No-Op

**Setup:** Bundle config has discount.value = 0

**Expected:** Config validation rejects it (value must be > 0). Returns empty discounts.

## Deployment

1. Build the Function:
   ```bash
   cd extensions/bundle-discount
   npm install
   npm run build
   ```

2. Deploy with Shopify CLI:
   ```bash
   shopify app deploy
   ```

3. The Function will be registered as `bundle-discount` and available for
   `discountAutomaticAppCreate` calls.

## Key Differences from DiscountAutomaticBasic

| Aspect | Old (Basic) | New (Function) |
|--------|-------------|----------------|
| Enforcement | Minimum total quantity only | ALL products + quantities validated |
| Abuse prevention | None (any product combo works) | Exact product match required |
| Variant checking | None | Optional variant-level enforcement |
| Tiered support | One discount per tier | Single discount with multiple tier definitions |
| Stacking | Stacks with product discounts | Does NOT stack with product discounts |
| Configuration | Fixed at creation time | Dynamic via metafield updates |
| Bundle identity | Not tracked | `_bundle_id` attribute validated |

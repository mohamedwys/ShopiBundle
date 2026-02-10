# STEP 7: Proxy Route Optimization + Structured Metaobjects

## Context
The proxy routes at `pages/api/proxy_route/` serve bundle data to the storefront widget. Currently:
- `bundle-widget.ts` (480 lines) fetches all metaobjects (`first: 50`), loops to find a match, then fetches products separately — no pagination, no caching, unstructured flat key/value fields.
- `bundles-for-product.ts` (129 lines) does the same fetch-all-then-filter pattern.
- `shopify-integration.service.ts` (727 lines) creates metaobjects with 5 flat fields: `bundle_name`, `bundle_title`, `description`, `discount`, `products`.

This step optimizes the proxy routes, adds structured metaobject fields for new bundle types, and improves the integration service to persist type-specific config.

## DO NOT re-analyze the codebase. All info is below. Just make the edits.

---

## Task 1: Extend metaobject fields in ShopifyIntegrationService

**File:** `lib/services/shopify-integration.service.ts`

### 1a. Add new fields to BundleShopifyData interface (lines 17-39):

**Current:**
```typescript
export interface BundleShopifyData {
  id: string;
  shop: string;
  name: string;
  title: string;
  description: string | null;
  discountPercent: number;
  /** "percentage" or "fixed_amount" */
  discountType?: 'percentage' | 'fixed_amount';
  components: Array<{
    shopifyProductId: string;
    shopifyVariantId?: string;
    quantity: number;
  }>;
  /** Optional tiered bundle definitions for multi-tier discounts */
  tiers?: Array<{
    tierId: string;
    discountPercent: number;
    discountType?: 'percentage' | 'fixed_amount';
    /** Multiplier: how many sets of the base components this tier requires */
    bundleSets: number;
  }>;
}
```

**Replace with:**
```typescript
export interface BundleShopifyData {
  id: string;
  shop: string;
  name: string;
  title: string;
  description: string | null;
  bundleType: string;
  discountPercent: number;
  /** "percentage" or "fixed_amount" */
  discountType?: 'percentage' | 'fixed_amount';
  components: Array<{
    shopifyProductId: string;
    shopifyVariantId?: string;
    quantity: number;
    isRequired?: boolean;
  }>;
  /** Optional tiered bundle definitions for multi-tier discounts */
  tiers?: Array<{
    tierId: string;
    discountPercent: number;
    discountType?: 'percentage' | 'fixed_amount';
    /** Multiplier: how many sets of the base components this tier requires */
    bundleSets: number;
  }>;
  /** JSON-encoded selection rules for MIX_MATCH / BUILD_YOUR_OWN */
  selectionRules?: string;
  /** JSON-encoded gift settings for GIFT bundles */
  giftSettings?: string;
  /** JSON-encoded subscription settings for SUBSCRIPTION bundles */
  subscriptionSettings?: string;
}
```

### 1b. Update createMetaobject to include new fields.

The `createMetaobject` method constructs a metaobject with fields. Find it (search for `private async createMetaobject`) — it's around lines 440-480. The fields array currently looks like:

```typescript
fields: [
  { key: 'bundle_name', value: bundle.name },
  { key: 'bundle_title', value: bundle.title },
  { key: 'description', value: bundle.description || '' },
  { key: 'discount', value: String(Math.round(bundle.discountPercent)) },
  { key: 'products', value: JSON.stringify(productIds) },
],
```

**Replace with:**
```typescript
fields: [
  { key: 'bundle_name', value: bundle.name },
  { key: 'bundle_title', value: bundle.title },
  { key: 'bundle_type', value: bundle.bundleType || 'FIXED' },
  { key: 'description', value: bundle.description || '' },
  { key: 'discount', value: String(Math.round(bundle.discountPercent)) },
  { key: 'products', value: JSON.stringify(productIds) },
  ...(bundle.selectionRules ? [{ key: 'selection_rules', value: bundle.selectionRules }] : []),
  ...(bundle.giftSettings ? [{ key: 'gift_settings', value: bundle.giftSettings }] : []),
  ...(bundle.subscriptionSettings ? [{ key: 'subscription_settings', value: bundle.subscriptionSettings }] : []),
],
```

### 1c. Apply the same fields update to updateMetaobject.

The `updateMetaobject` method (around lines 490-515) has the same fields array. Apply the same replacement.

---

## Task 2: Optimize bundle-widget.ts proxy route

**File:** `pages/api/proxy_route/bundle-widget.ts`

### 2a. Add handle-based metaobject query for direct lookups.

Currently the route fetches ALL metaobjects and loops to find a match. When fetching by handle, we can use `metaobjectByHandle` for O(1) lookup.

After the existing `query` constant (ends at line 75), add a new query:

```typescript
    // Optimized query for handle-based lookups
    const queryByHandle = `
      query GetBundleByHandle($handle: String!, $type: String!) {
        metaobjectByHandle(handle: { handle: $handle, type: $type }) {
          id
          handle
          fields {
            key
            value
          }
        }
      }
    `;
```

### 2b. Use the optimized query when handle is provided.

Replace the current matching logic (lines 77-122). Currently:
```typescript
    const response: any = await client.request(query, { ... });
    ...
    for (const edge of response.data.metaobjects.edges) { ... }
```

**Replace the block from line 77 to line 122 with:**

```typescript
    let matchedBundle: any = null;

    if (normalizedHandle) {
      // Direct lookup by handle — O(1) instead of fetching all
      const handleResponse: any = await client.request(queryByHandle, {
        variables: {
          handle: normalizedHandle,
          type: "product-bundles",
        },
      });

      const bundle = handleResponse.data?.metaobjectByHandle;
      if (bundle) {
        const fields: Record<string, string> = {};
        for (const field of bundle.fields) {
          fields[field.key] = field.value;
        }
        matchedBundle = { ...fields, _handle: bundle.handle, _id: bundle.id };
      }
    } else if (normalizedProductId) {
      // Fallback: fetch all and filter by product_id
      const response: any = await client.request(query, {
        variables: {
          type: "product-bundles",
          first: 50,
        },
      });

      for (const edge of response.data.metaobjects.edges) {
        const bundle = edge.node;
        const fields: Record<string, string> = {};
        for (const field of bundle.fields) {
          fields[field.key] = field.value;
        }

        if (fields.products) {
          let products: string[] = [];
          try {
            products = JSON.parse(fields.products);
          } catch {
            products = [fields.products];
          }

          const hasProduct = products.some(
            (pid: string) =>
              pid.includes(normalizedProductId) ||
              normalizedProductId.includes(pid)
          );

          if (hasProduct) {
            matchedBundle = { ...fields, _handle: bundle.handle, _id: bundle.id };
            break;
          }
        }
      }
    }
```

### 2c. Update buildWidgetConfig to use bundle_type from metaobject.

In `buildWidgetConfig` (line 286), the current type resolution:
```typescript
const bundleType = matchedBundle.bundle_type || "fixed";
```

This line (141) already reads `bundle_type` — confirm it's correct. If the line reads `matchedBundle.bundle_type` it will now receive the value stored in Task 1c.

---

## Task 3: Optimize bundles-for-product.ts with edge caching

**File:** `pages/api/proxy_route/bundles-for-product.ts`

### 3a. Add response shaping with type info.

In the bundles result construction (lines 107-114):

**Current:**
```typescript
          bundles.push({
            id: bundle.handle,
            title: fields.bundle_title || fields.bundle_name,
            discount: fields.discount,
            description: fields.description,
            products: products,
          });
```

**Replace with:**
```typescript
          bundles.push({
            id: bundle.handle,
            type: fields.bundle_type || 'FIXED',
            title: fields.bundle_title || fields.bundle_name,
            discount: fields.discount,
            description: fields.description,
            products: products,
            hasSelectionRules: !!fields.selection_rules,
            hasGiftSettings: !!fields.gift_settings,
            hasSubscriptionSettings: !!fields.subscription_settings,
          });
```

### 3b. Add Vary header for proper CDN caching.

After the Cache-Control header (line 119), add:
```typescript
    res.setHeader("Vary", "Accept-Encoding");
```

---

## Task 4: Extend the metaobject type definition in Shopify

The metaobject type `product-bundles` needs new field definitions for the extended data. This is done via the `metaobjectDefinitionUpdate` mutation, typically run once during app setup.

**File (NEW):** `scripts/update-metaobject-definition.ts`

This is a one-time migration script. Create it as a reference for the developer:

```typescript
/**
 * One-time migration script to add new metaobject fields.
 *
 * Run this once per shop after deploying the new schema.
 * The metaobject definition update is idempotent — running it
 * multiple times is safe (existing fields won't be duplicated).
 *
 * Usage: npx ts-node scripts/update-metaobject-definition.ts <shop-domain>
 */

const MUTATION = `
  mutation UpdateBundleMetaobjectDefinition($id: ID!, $definition: MetaobjectDefinitionUpdateInput!) {
    metaobjectDefinitionUpdate(id: $id, definition: $definition) {
      metaobjectDefinition {
        id
        type
        fieldDefinitions {
          key
          name
          type {
            name
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

// New field definitions to add
const NEW_FIELDS = [
  {
    key: 'bundle_type',
    name: 'Bundle Type',
    type: 'single_line_text_field',
    description: 'Bundle type: FIXED, TIERED, BOGO, MIX_MATCH, BUILD_YOUR_OWN, SUBSCRIPTION, GIFT',
  },
  {
    key: 'selection_rules',
    name: 'Selection Rules',
    type: 'json',
    description: 'JSON config for MIX_MATCH/BUILD_YOUR_OWN product selection constraints',
  },
  {
    key: 'gift_settings',
    name: 'Gift Settings',
    type: 'json',
    description: 'JSON config for GIFT bundle message and wrapping options',
  },
  {
    key: 'subscription_settings',
    name: 'Subscription Settings',
    type: 'json',
    description: 'JSON config for SUBSCRIPTION bundle delivery frequencies',
  },
];

console.log('Metaobject definition update mutation:');
console.log(JSON.stringify({ mutation: MUTATION, newFields: NEW_FIELDS }, null, 2));
console.log('\nRun this mutation via the Shopify Admin GraphQL API.');
console.log('First, find the metaobject definition ID:');
console.log('  query { metaobjectDefinitions(first: 10) { edges { node { id type } } } }');
console.log('Then call metaobjectDefinitionUpdate with the ID and new fieldDefinitions.');
```

---

## Verification
1. Run: `npx tsc --noEmit` — 0 errors
2. Verify `metaobjectByHandle` query works (test with a known handle)
3. Verify new fields (`bundle_type`, `selection_rules`, etc.) are written to metaobjects
4. Check CDN caching headers are correct (`Cache-Control`, `Vary`)

## Commit message
```
Optimize proxy routes and extend metaobjects for new bundle types

- Use metaobjectByHandle for O(1) handle-based lookups (was O(n) scan)
- Add bundle_type, selection_rules, gift_settings, subscription_settings
  metaobject fields
- ShopifyIntegrationService writes type-specific JSON to metaobjects
- bundles-for-product returns type info and capability flags
- Add Vary header for proper CDN cache behavior
- Add metaobject definition update migration script
```

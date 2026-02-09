/**
 * Tests for the Bundle Discount Function
 *
 * Run with: npx tsx --test src/index.test.ts
 * (or integrate with your preferred test runner)
 */

import { run } from './index';
import type { RunInput, BundleDiscountConfig, FunctionRunResult } from './types';

// ============================================
// TEST HELPERS
// ============================================

function makeInput(overrides: {
  config?: BundleDiscountConfig | null;
  lines?: RunInput['cart']['lines'];
}): RunInput {
  const config = overrides.config;
  return {
    cart: {
      lines: overrides.lines || [],
    },
    discountNode: {
      metafield: config
        ? { value: JSON.stringify(config) }
        : null,
    },
  };
}

function makeLine(opts: {
  id?: string;
  quantity: number;
  productId: string;
  variantId: string;
  bundleId?: string;
}): RunInput['cart']['lines'][0] {
  return {
    id: opts.id || `line_${Math.random().toString(36).slice(2, 8)}`,
    quantity: opts.quantity,
    merchandise: {
      id: opts.variantId,
      product: { id: opts.productId },
    },
    attribute: opts.bundleId ? { value: opts.bundleId } : null,
  };
}

function simpleConfig(overrides?: Partial<BundleDiscountConfig>): BundleDiscountConfig {
  return {
    bundleId: 'test-bundle-1',
    bundles: [
      {
        minBundleSets: 1,
        maxBundleSets: 0,
        components: [
          { productId: 'gid://shopify/Product/111', quantity: 1 },
          { productId: 'gid://shopify/Product/222', quantity: 1 },
        ],
        discount: { type: 'percentage', value: 15 },
      },
    ],
    ...overrides,
  };
}

// ============================================
// TEST CASES
// ============================================

// --- Scenario 1: Complete Bundle -> Discount Applies ---
const test1 = (() => {
  const input = makeInput({
    config: simpleConfig(),
    lines: [
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1', bundleId: 'test-bundle-1' }),
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2', bundleId: 'test-bundle-1' }),
    ],
  });
  const result = run(input);
  console.assert(result.discounts.length === 1, 'Test 1 FAIL: Expected 1 discount');
  console.assert(result.discounts[0].targets.length === 2, 'Test 1 FAIL: Expected 2 targets');
  console.assert(
    (result.discounts[0].value as any).percentage?.value === '15',
    'Test 1 FAIL: Expected 15% discount'
  );
  console.log('Test 1 PASS: Complete bundle applies discount');
})();

// --- Scenario 2: Incomplete Bundle -> No Discount ---
const test2 = (() => {
  const config: BundleDiscountConfig = {
    bundleId: 'test-bundle-2',
    bundles: [{
      minBundleSets: 1,
      maxBundleSets: 0,
      components: [
        { productId: 'gid://shopify/Product/111', quantity: 1 },
        { productId: 'gid://shopify/Product/222', quantity: 1 },
        { productId: 'gid://shopify/Product/333', quantity: 1 },
      ],
      discount: { type: 'percentage', value: 20 },
    }],
  };
  const input = makeInput({
    config,
    lines: [
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2' }),
      // Product 333 is MISSING
    ],
  });
  const result = run(input);
  console.assert(result.discounts.length === 0, 'Test 2 FAIL: Expected no discount');
  console.log('Test 2 PASS: Incomplete bundle gets no discount');
})();

// --- Scenario 3: Quantity Manipulation -> No Abuse ---
const test3 = (() => {
  const input = makeInput({
    config: simpleConfig(),
    lines: [
      // 5 of Product A but no Product B
      makeLine({ quantity: 5, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
    ],
  });
  const result = run(input);
  console.assert(result.discounts.length === 0, 'Test 3 FAIL: Expected no discount');
  console.log('Test 3 PASS: Quantity manipulation does not trigger discount');
})();

// --- Scenario 4: Multiple Complete Bundle Sets ---
const test4 = (() => {
  const config: BundleDiscountConfig = {
    bundleId: 'test-bundle-4',
    bundles: [{
      minBundleSets: 1,
      maxBundleSets: 0, // unlimited
      components: [
        { productId: 'gid://shopify/Product/111', quantity: 1 },
        { productId: 'gid://shopify/Product/222', quantity: 1 },
      ],
      discount: { type: 'percentage', value: 10 },
    }],
  };
  const input = makeInput({
    config,
    lines: [
      makeLine({ id: 'line-a', quantity: 3, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
      makeLine({ id: 'line-b', quantity: 3, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2' }),
    ],
  });
  const result = run(input);
  console.assert(result.discounts.length === 1, 'Test 4 FAIL: Expected 1 discount');
  // Should discount 3 units of each
  const targets = result.discounts[0].targets;
  const totalQty = targets.reduce((sum, t) => sum + t.productVariant.quantity, 0);
  console.assert(totalQty === 6, 'Test 4 FAIL: Expected 6 total discounted units, got ' + totalQty);
  console.log('Test 4 PASS: Multiple bundle sets discounted correctly');
})();

// --- Scenario 5: Tiered Bundle (Best Tier Wins) ---
const test5 = (() => {
  const config: BundleDiscountConfig = {
    bundleId: 'test-bundle-5',
    bundles: [
      {
        tierId: 'tier_1',
        minBundleSets: 1,
        maxBundleSets: 1,
        components: [
          { productId: 'gid://shopify/Product/111', quantity: 1 },
          { productId: 'gid://shopify/Product/222', quantity: 1 },
        ],
        discount: { type: 'percentage', value: 10 },
      },
      {
        tierId: 'tier_2',
        minBundleSets: 2,
        maxBundleSets: 2,
        components: [
          { productId: 'gid://shopify/Product/111', quantity: 1 },
          { productId: 'gid://shopify/Product/222', quantity: 1 },
        ],
        discount: { type: 'percentage', value: 15 },
      },
      {
        tierId: 'tier_3',
        minBundleSets: 3,
        maxBundleSets: 3,
        components: [
          { productId: 'gid://shopify/Product/111', quantity: 1 },
          { productId: 'gid://shopify/Product/222', quantity: 1 },
        ],
        discount: { type: 'percentage', value: 25 },
      },
    ],
  };
  const input = makeInput({
    config,
    lines: [
      makeLine({ id: 'line-a', quantity: 2, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
      makeLine({ id: 'line-b', quantity: 2, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2' }),
    ],
  });
  const result = run(input);
  // Best matching tier should be tier_2 (25% tier needs 3 sets, only have 2)
  console.assert(result.discounts.length === 1, 'Test 5 FAIL: Expected 1 discount');
  const discountValue = (result.discounts[0].value as any).percentage?.value;
  console.assert(discountValue === '15', 'Test 5 FAIL: Expected 15% (tier 2), got ' + discountValue);
  console.log('Test 5 PASS: Tiered bundle applies correct tier');
})();

// --- Scenario 6: Variant Mismatch -> No Discount ---
const test6 = (() => {
  const config: BundleDiscountConfig = {
    bundleId: 'test-bundle-6',
    bundles: [{
      minBundleSets: 1,
      maxBundleSets: 0,
      components: [
        { productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1', quantity: 1 },
        { productId: 'gid://shopify/Product/222', quantity: 1 },
      ],
      discount: { type: 'percentage', value: 15 },
    }],
  };
  const input = makeInput({
    config,
    lines: [
      // Wrong variant for Product 111
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/99' }),
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2' }),
    ],
  });
  const result = run(input);
  console.assert(result.discounts.length === 0, 'Test 6 FAIL: Expected no discount (variant mismatch)');
  console.log('Test 6 PASS: Variant mismatch prevents discount');
})();

// --- Scenario 7: Wrong _bundle_id -> Item Ignored ---
const test7 = (() => {
  const input = makeInput({
    config: simpleConfig(),
    lines: [
      // This line has a different bundle ID
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1', bundleId: 'different-bundle' }),
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2', bundleId: 'test-bundle-1' }),
    ],
  });
  const result = run(input);
  console.assert(result.discounts.length === 0, 'Test 7 FAIL: Expected no discount (bundle ID mismatch)');
  console.log('Test 7 PASS: Wrong _bundle_id prevents match');
})();

// --- Scenario 8: No Config -> Silent Failure ---
const test8 = (() => {
  const input = makeInput({
    config: null,
    lines: [
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
    ],
  });
  const result = run(input);
  console.assert(result.discounts.length === 0, 'Test 8 FAIL: Expected no discount');
  console.log('Test 8 PASS: Missing config returns empty (silent failure)');
})();

// --- Scenario 9: Empty Cart -> No Discount ---
const test9 = (() => {
  const input = makeInput({
    config: simpleConfig(),
    lines: [],
  });
  const result = run(input);
  console.assert(result.discounts.length === 0, 'Test 9 FAIL: Expected no discount');
  console.log('Test 9 PASS: Empty cart returns no discount');
})();

// --- Scenario 10: Fixed Amount Discount ---
const test10 = (() => {
  const config: BundleDiscountConfig = {
    bundleId: 'test-bundle-10',
    bundles: [{
      minBundleSets: 1,
      maxBundleSets: 0,
      components: [
        { productId: 'gid://shopify/Product/111', quantity: 1 },
        { productId: 'gid://shopify/Product/222', quantity: 1 },
      ],
      discount: { type: 'fixed_amount', value: 5 },
    }],
  };
  const input = makeInput({
    config,
    lines: [
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2' }),
    ],
  });
  const result = run(input);
  console.assert(result.discounts.length === 1, 'Test 10 FAIL: Expected 1 discount');
  console.assert(
    (result.discounts[0].value as any).fixedAmount?.amount === '5',
    'Test 10 FAIL: Expected $5 fixed amount discount'
  );
  console.log('Test 10 PASS: Fixed amount discount works');
})();

// --- Scenario 11: Items without _bundle_id still match ---
const test11 = (() => {
  const input = makeInput({
    config: simpleConfig(),
    lines: [
      // No _bundle_id attribute
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2' }),
    ],
  });
  const result = run(input);
  console.assert(result.discounts.length === 1, 'Test 11 FAIL: Expected 1 discount (no bundle_id is OK)');
  console.log('Test 11 PASS: Items without _bundle_id still match (backwards compat)');
})();

// --- Scenario 12: Component requires quantity > 1 ---
const test12 = (() => {
  const config: BundleDiscountConfig = {
    bundleId: 'test-bundle-12',
    bundles: [{
      minBundleSets: 1,
      maxBundleSets: 0,
      components: [
        { productId: 'gid://shopify/Product/111', quantity: 2 }, // Need 2
        { productId: 'gid://shopify/Product/222', quantity: 1 },
      ],
      discount: { type: 'percentage', value: 10 },
    }],
  };

  // Only 1 of Product 111 -> should NOT match
  const input1 = makeInput({
    config,
    lines: [
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2' }),
    ],
  });
  const result1 = run(input1);
  console.assert(result1.discounts.length === 0, 'Test 12a FAIL: Expected no discount (insufficient qty)');

  // 2 of Product 111 -> should match
  const input2 = makeInput({
    config,
    lines: [
      makeLine({ quantity: 2, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
      makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2' }),
    ],
  });
  const result2 = run(input2);
  console.assert(result2.discounts.length === 1, 'Test 12b FAIL: Expected discount with qty=2');
  console.log('Test 12 PASS: Component quantity requirements enforced');
})();

// --- Scenario 13: maxBundleSets caps discount ---
const test13 = (() => {
  const config: BundleDiscountConfig = {
    bundleId: 'test-bundle-13',
    bundles: [{
      minBundleSets: 1,
      maxBundleSets: 2, // Cap at 2 sets
      components: [
        { productId: 'gid://shopify/Product/111', quantity: 1 },
        { productId: 'gid://shopify/Product/222', quantity: 1 },
      ],
      discount: { type: 'percentage', value: 10 },
    }],
  };
  const input = makeInput({
    config,
    lines: [
      makeLine({ id: 'line-a', quantity: 5, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
      makeLine({ id: 'line-b', quantity: 5, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2' }),
    ],
  });
  const result = run(input);
  console.assert(result.discounts.length === 1, 'Test 13 FAIL: Expected 1 discount');
  const totalQty = result.discounts[0].targets.reduce((sum, t) => sum + t.productVariant.quantity, 0);
  console.assert(totalQty === 4, 'Test 13 FAIL: Expected 4 discounted units (2 sets capped), got ' + totalQty);
  console.log('Test 13 PASS: maxBundleSets caps discount correctly');
})();

console.log('\n=== All tests completed ===');

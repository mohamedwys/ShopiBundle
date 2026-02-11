/**
 * Tests for the Bundle Discount Function
 *
 * Run with: npx tsx --test src/index.test.ts
 * Or: node --import tsx --test src/index.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { run } from './index';
import type { RunInput, BundleDiscountConfig } from './types';

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
  tierId?: string;
}): RunInput['cart']['lines'][0] {
  return {
    id: opts.id || `line_${Math.random().toString(36).slice(2, 8)}`,
    quantity: opts.quantity,
    merchandise: {
      id: opts.variantId,
      product: { id: opts.productId },
    },
    attribute: opts.bundleId ? { value: opts.bundleId } : null,
    tierAttribute: opts.tierId ? { value: opts.tierId } : null,
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

describe('Bundle Discount Function', () => {
  it('Scenario 1: Complete bundle applies discount', () => {
    const input = makeInput({
      config: simpleConfig(),
      lines: [
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1', bundleId: 'test-bundle-1' }),
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2', bundleId: 'test-bundle-1' }),
      ],
    });
    const result = run(input);
    assert.equal(result.discounts.length, 1, 'Expected 1 discount');
    assert.equal(result.discounts[0].targets.length, 2, 'Expected 2 targets');
    assert.equal(
      (result.discounts[0].value as any).percentage?.value,
      '15',
      'Expected 15% discount'
    );
  });

  it('Scenario 2: Incomplete bundle gets no discount', () => {
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
      ],
    });
    const result = run(input);
    assert.equal(result.discounts.length, 0, 'Expected no discount');
  });

  it('Scenario 3: Quantity manipulation does not trigger discount', () => {
    const input = makeInput({
      config: simpleConfig(),
      lines: [
        makeLine({ quantity: 5, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
      ],
    });
    const result = run(input);
    assert.equal(result.discounts.length, 0, 'Expected no discount');
  });

  it('Scenario 4: Multiple complete bundle sets discounted correctly', () => {
    const config: BundleDiscountConfig = {
      bundleId: 'test-bundle-4',
      bundles: [{
        minBundleSets: 1,
        maxBundleSets: 0,
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
    assert.equal(result.discounts.length, 1, 'Expected 1 discount');
    const totalQty = result.discounts[0].targets.reduce((sum, t) => sum + t.productVariant.quantity, 0);
    assert.equal(totalQty, 6, 'Expected 6 total discounted units');
  });

  it('Scenario 5: Tiered bundle applies correct tier', () => {
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
    assert.equal(result.discounts.length, 1, 'Expected 1 discount');
    const discountValue = (result.discounts[0].value as any).percentage?.value;
    assert.equal(discountValue, '15', 'Expected 15% (tier 2)');
  });

  it('Scenario 6: Variant mismatch prevents discount', () => {
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
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/99' }),
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2' }),
      ],
    });
    const result = run(input);
    assert.equal(result.discounts.length, 0, 'Expected no discount');
  });

  it('Scenario 7: Wrong _bundle_id prevents match', () => {
    const input = makeInput({
      config: simpleConfig(),
      lines: [
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1', bundleId: 'different-bundle' }),
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2', bundleId: 'test-bundle-1' }),
      ],
    });
    const result = run(input);
    assert.equal(result.discounts.length, 0, 'Expected no discount');
  });

  it('Scenario 8: Missing config returns empty (silent failure)', () => {
    const input = makeInput({
      config: null,
      lines: [
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
      ],
    });
    const result = run(input);
    assert.equal(result.discounts.length, 0, 'Expected no discount');
  });

  it('Scenario 9: Empty cart returns no discount', () => {
    const input = makeInput({
      config: simpleConfig(),
      lines: [],
    });
    const result = run(input);
    assert.equal(result.discounts.length, 0, 'Expected no discount');
  });

  it('Scenario 10: Fixed amount discount works', () => {
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
    assert.equal(result.discounts.length, 1, 'Expected 1 discount');
    assert.equal(
      (result.discounts[0].value as any).fixedAmount?.amount,
      '5',
      'Expected $5 fixed amount discount'
    );
  });

  it('Scenario 11: Items without _bundle_id still match (backwards compat)', () => {
    const input = makeInput({
      config: simpleConfig(),
      lines: [
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2' }),
      ],
    });
    const result = run(input);
    assert.equal(result.discounts.length, 1, 'Expected 1 discount');
  });

  it('Scenario 12: Component quantity requirements enforced', () => {
    const config: BundleDiscountConfig = {
      bundleId: 'test-bundle-12',
      bundles: [{
        minBundleSets: 1,
        maxBundleSets: 0,
        components: [
          { productId: 'gid://shopify/Product/111', quantity: 2 },
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
    assert.equal(run(input1).discounts.length, 0, 'Expected no discount (insufficient qty)');

    // 2 of Product 111 -> should match
    const input2 = makeInput({
      config,
      lines: [
        makeLine({ quantity: 2, productId: 'gid://shopify/Product/111', variantId: 'gid://shopify/ProductVariant/1' }),
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/222', variantId: 'gid://shopify/ProductVariant/2' }),
      ],
    });
    assert.equal(run(input2).discounts.length, 1, 'Expected discount with qty=2');
  });

  it('Scenario 13: maxBundleSets caps discount correctly', () => {
    const config: BundleDiscountConfig = {
      bundleId: 'test-bundle-13',
      bundles: [{
        minBundleSets: 1,
        maxBundleSets: 2,
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
    assert.equal(result.discounts.length, 1, 'Expected 1 discount');
    const totalQty = result.discounts[0].targets.reduce((sum, t) => sum + t.productVariant.quantity, 0);
    assert.equal(totalQty, 4, 'Expected 4 discounted units (2 sets capped)');
  });

  it('Scenario 14: BOGO free item gets 100% discount', () => {
    const config: BundleDiscountConfig = {
      bundleId: 'bogo-bundle',
      bundles: [{
        minBundleSets: 1,
        maxBundleSets: 1,
        components: [{ productId: 'gid://shopify/Product/1', quantity: 1 }],
        discount: { type: 'percentage', value: 0 },
        freeItems: [{ productId: 'gid://shopify/Product/2', quantity: 1 }],
        freeItemDiscount: { type: 'free_item', value: 100 },
      }],
    };
    const input = makeInput({
      config,
      lines: [
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/1', variantId: 'gid://shopify/ProductVariant/1' }),
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/2', variantId: 'gid://shopify/ProductVariant/2' }),
      ],
    });
    const result = run(input);
    assert.ok(result.discounts.length > 0, 'Expected at least one discount');
    // The free item should get 100% discount
    const freeDiscount = result.discounts.find(d => d.message?.includes('Free item'));
    assert.ok(freeDiscount, 'Expected a free item discount');
    assert.equal(
      (freeDiscount!.value as any).percentage.value,
      '100',
      'Expected 100% discount for free item'
    );
  });

  it('Scenario 15: BOGO bundle matches even without free item in cart', () => {
    const config: BundleDiscountConfig = {
      bundleId: 'bogo-bundle',
      bundles: [{
        minBundleSets: 1,
        maxBundleSets: 1,
        components: [{ productId: 'gid://shopify/Product/1', quantity: 1 }],
        discount: { type: 'percentage', value: 10 },
        freeItems: [{ productId: 'gid://shopify/Product/2', quantity: 1 }],
      }],
    };
    const input = makeInput({
      config,
      lines: [
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/1', variantId: 'gid://shopify/ProductVariant/1' }),
      ],
    });
    const result = run(input);
    assert.ok(result.discounts.length > 0, 'Expected bundle to match even without free item');
  });

  it('Scenario 16: MIX_MATCH matches with enough optional components', () => {
    const config: BundleDiscountConfig = {
      bundleId: 'mix-match',
      bundles: [{
        minBundleSets: 1,
        maxBundleSets: 1,
        components: [],
        discount: { type: 'percentage', value: 15 },
        optionalComponents: [
          { productId: 'gid://shopify/Product/1', quantity: 1 },
          { productId: 'gid://shopify/Product/2', quantity: 1 },
          { productId: 'gid://shopify/Product/3', quantity: 1 },
        ],
        minRequiredOptional: 2,
      }],
    };
    const input = makeInput({
      config,
      lines: [
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/1', variantId: 'gid://shopify/ProductVariant/1' }),
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/3', variantId: 'gid://shopify/ProductVariant/3' }),
      ],
    });
    const result = run(input);
    assert.ok(result.discounts.length > 0, 'Expected MIX_MATCH to match with 2 optional components');
  });

  it('Scenario 17: MIX_MATCH does not match with too few optional components', () => {
    const config: BundleDiscountConfig = {
      bundleId: 'mix-match',
      bundles: [{
        minBundleSets: 1,
        maxBundleSets: 1,
        components: [],
        discount: { type: 'percentage', value: 15 },
        optionalComponents: [
          { productId: 'gid://shopify/Product/1', quantity: 1 },
          { productId: 'gid://shopify/Product/2', quantity: 1 },
          { productId: 'gid://shopify/Product/3', quantity: 1 },
        ],
        minRequiredOptional: 2,
      }],
    };
    const input = makeInput({
      config,
      lines: [
        makeLine({ quantity: 1, productId: 'gid://shopify/Product/1', variantId: 'gid://shopify/ProductVariant/1' }),
      ],
    });
    const result = run(input);
    assert.equal(result.discounts.length, 0, 'Expected no discount with too few optional components');
  });
});

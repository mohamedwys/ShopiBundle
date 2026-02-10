/**
 * Pricing Utilities
 *
 * Client-side price calculation for all bundle types:
 * volume, BOGO, mix-match, FBT, fixed, free-gift.
 */

import type {
  BundleTier,
  ProductReference,
  PricingResult,
  CartLineItem,
  BundleType,
} from '../types';

/**
 * Calculate pricing for a given tier and product set
 */
export function calculateTierPricing(
  tier: BundleTier,
  products: ProductReference[],
  bundleType: BundleType
): PricingResult {
  switch (bundleType) {
    case 'volume':
      return calculateVolumePricing(tier, products);
    case 'bogo':
      return calculateBogoPricing(tier, products);
    case 'fbt':
    case 'mix-match':
    case 'build-your-own':
    case 'fixed':
    case 'subscription':
      return calculateFixedPricing(tier, products);
    case 'free-gift':
    case 'gift':
      return calculateFreeGiftPricing(tier, products);
    default:
      return calculateFixedPricing(tier, products);
  }
}

/**
 * Volume discount: same product x quantity with tiered discounts
 */
function calculateVolumePricing(
  tier: BundleTier,
  products: ProductReference[]
): PricingResult {
  const baseProduct = products[0];
  if (!baseProduct) return emptyPricing();

  const unitPrice = baseProduct.price;
  const quantity = tier.quantity;
  const originalPrice = unitPrice * quantity;

  let bundlePrice: number;
  let freeItemsCount = 0;

  switch (tier.discountType) {
    case 'percentage':
      bundlePrice = originalPrice * (1 - tier.discountValue / 100);
      break;
    case 'fixed':
      bundlePrice = Math.max(0, originalPrice - tier.discountValue);
      break;
    case 'fixed_price':
      bundlePrice = tier.discountValue;
      break;
    case 'free':
      freeItemsCount = 1;
      bundlePrice = unitPrice * (quantity - 1);
      break;
    default:
      bundlePrice = originalPrice;
  }

  bundlePrice = roundPrice(bundlePrice);
  const savingsAmount = roundPrice(originalPrice - bundlePrice);
  const savingsPercent =
    originalPrice > 0 ? Math.round((savingsAmount / originalPrice) * 100) : 0;
  const perUnitPrice = roundPrice(bundlePrice / quantity);

  const lineItems: CartLineItem[] = [];
  const variantId = baseProduct.variantId || '';
  for (let i = 0; i < quantity; i++) {
    lineItems.push({
      variantId,
      quantity: 1,
      price: i < quantity - freeItemsCount ? perUnitPrice : 0,
      properties: {
        _bundle_id: '',
        _bundle_tier: tier.id,
        _bundle_discount: `${savingsPercent}%`,
      },
    });
  }

  return {
    originalPrice,
    bundlePrice,
    savingsAmount,
    savingsPercent,
    perUnitPrice,
    freeItemsCount,
    lineItems,
  };
}

/**
 * BOGO: Buy X get Y free or discounted
 */
function calculateBogoPricing(
  tier: BundleTier,
  products: ProductReference[]
): PricingResult {
  const baseProduct = products[0];
  if (!baseProduct) return emptyPricing();

  const unitPrice = baseProduct.price;
  const buyQty = tier.quantity;
  // For BOGO, the tier's discountValue tells us how many free items
  const freeQty = tier.discountType === 'free' ? Math.floor(tier.discountValue) : 0;
  const totalQty = buyQty + freeQty;

  const originalPrice = roundPrice(unitPrice * totalQty);
  const bundlePrice = roundPrice(unitPrice * buyQty);
  const savingsAmount = roundPrice(originalPrice - bundlePrice);
  const savingsPercent =
    originalPrice > 0 ? Math.round((savingsAmount / originalPrice) * 100) : 0;
  const perUnitPrice = roundPrice(bundlePrice / totalQty);

  const lineItems: CartLineItem[] = [];
  const variantId = baseProduct.variantId || '';
  for (let i = 0; i < totalQty; i++) {
    lineItems.push({
      variantId,
      quantity: 1,
      price: i < buyQty ? unitPrice : 0,
      properties: {
        _bundle_id: '',
        _bundle_tier: tier.id,
        _bundle_discount: i >= buyQty ? 'FREE' : '',
      },
    });
  }

  return {
    originalPrice,
    bundlePrice,
    savingsAmount,
    savingsPercent,
    perUnitPrice,
    freeItemsCount: freeQty,
    lineItems,
  };
}

/**
 * Fixed/FBT/Mix-match: multiple products with a bundle discount
 */
function calculateFixedPricing(
  tier: BundleTier,
  products: ProductReference[]
): PricingResult {
  if (products.length === 0) return emptyPricing();

  const originalPrice = roundPrice(
    products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  );

  let bundlePrice: number;

  switch (tier.discountType) {
    case 'percentage':
      bundlePrice = originalPrice * (1 - tier.discountValue / 100);
      break;
    case 'fixed':
      bundlePrice = Math.max(0, originalPrice - tier.discountValue);
      break;
    case 'fixed_price':
      bundlePrice = tier.discountValue;
      break;
    default:
      bundlePrice = originalPrice;
  }

  bundlePrice = roundPrice(bundlePrice);
  const savingsAmount = roundPrice(originalPrice - bundlePrice);
  const savingsPercent =
    originalPrice > 0 ? Math.round((savingsAmount / originalPrice) * 100) : 0;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const perUnitPrice = totalQuantity > 0 ? roundPrice(bundlePrice / totalQuantity) : 0;

  // Distribute discount proportionally
  const lineItems: CartLineItem[] = products.map((product) => {
    const lineTotal = product.price * product.quantity;
    const proportion = originalPrice > 0 ? lineTotal / originalPrice : 0;
    const lineDiscount = savingsAmount * proportion;
    return {
      variantId: product.variantId || '',
      quantity: product.quantity,
      price: roundPrice(lineTotal - lineDiscount),
      properties: {
        _bundle_id: '',
        _bundle_tier: tier.id,
        _bundle_discount: `${savingsPercent}%`,
      },
    };
  });

  return {
    originalPrice,
    bundlePrice,
    savingsAmount,
    savingsPercent,
    perUnitPrice,
    freeItemsCount: 0,
    lineItems,
  };
}

/**
 * Free gift: spend X, get product Y free
 */
function calculateFreeGiftPricing(
  tier: BundleTier,
  products: ProductReference[]
): PricingResult {
  if (products.length === 0) return emptyPricing();

  // Last product is the free gift
  const mainProducts = products.slice(0, -1);
  const giftProduct = products[products.length - 1];

  const originalPrice = roundPrice(
    products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  );
  const bundlePrice = roundPrice(
    mainProducts.reduce((sum, p) => sum + p.price * p.quantity, 0)
  );
  const savingsAmount = roundPrice(giftProduct ? giftProduct.price * giftProduct.quantity : 0);
  const savingsPercent =
    originalPrice > 0 ? Math.round((savingsAmount / originalPrice) * 100) : 0;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const perUnitPrice = totalQuantity > 0 ? roundPrice(bundlePrice / totalQuantity) : 0;

  const lineItems: CartLineItem[] = products.map((product, i) => ({
    variantId: product.variantId || '',
    quantity: product.quantity,
    price: i < products.length - 1 ? product.price * product.quantity : 0,
    properties: {
      _bundle_id: '',
      _bundle_tier: tier.id,
      _bundle_discount: i === products.length - 1 ? 'FREE GIFT' : '',
    },
  }));

  return {
    originalPrice,
    bundlePrice,
    savingsAmount,
    savingsPercent,
    perUnitPrice,
    freeItemsCount: giftProduct ? giftProduct.quantity : 0,
    lineItems,
  };
}

function emptyPricing(): PricingResult {
  return {
    originalPrice: 0,
    bundlePrice: 0,
    savingsAmount: 0,
    savingsPercent: 0,
    perUnitPrice: 0,
    freeItemsCount: 0,
    lineItems: [],
  };
}

function roundPrice(amount: number): number {
  return Math.round(amount * 100) / 100;
}

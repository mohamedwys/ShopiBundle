/**
 * ShopiBundle Discount Function
 *
 * Shopify Function that enforces complete bundle presence in cart
 * before applying any discount. Replaces DiscountAutomaticBasic.
 *
 * Key behaviors:
 * - Validates ALL bundle products + quantities are in the cart
 * - Applies discount ONLY to matched bundle line items
 * - Supports multiple bundles in the same cart
 * - Supports tiered bundles (different discount levels)
 * - Prevents discount abuse via quantity manipulation
 * - Fails silently (returns empty discounts) on invalid config
 */

import type {
  RunInput,
  FunctionRunResult,
  BundleDiscountConfig,
  BundleDefinition,
  BundleComponent,
  CartLine,
  Discount,
  ProductVariantTarget,
  BundleMatchResult,
  MatchedLine,
} from "./types";

const EMPTY_RESULT: FunctionRunResult = {
  discountApplicationStrategy: "FIRST",
  discounts: [],
};

/**
 * Main entry point for the Shopify Function.
 * Called by Shopify at checkout time for every cart evaluation.
 */
export function run(input: RunInput): FunctionRunResult {
  const config = parseConfig(input);
  if (!config) {
    return EMPTY_RESULT;
  }

  const cartLines = input.cart.lines;
  if (cartLines.length === 0) {
    return EMPTY_RESULT;
  }

  const allDiscounts: Discount[] = [];

  // Sort bundle definitions by discount value descending (best deal first)
  // This ensures tiered bundles apply the best matching tier
  const sortedBundles = [...config.bundles].sort((a, b) => {
    return b.discount.value - a.discount.value;
  });

  // Track remaining quantity per cart line (to prevent double-dipping)
  const remainingQuantity = new Map<string, number>();
  for (const line of cartLines) {
    remainingQuantity.set(line.id, line.quantity);
  }

  for (const bundleDef of sortedBundles) {
    const result = matchBundle(bundleDef, cartLines, remainingQuantity, config.bundleId);
    if (!result.matched) {
      continue;
    }

    // Deduct matched quantities from remaining pool
    for (const match of result.matchedLines) {
      const current = remainingQuantity.get(match.lineId) || 0;
      remainingQuantity.set(match.lineId, current - match.quantityUsed);
    }

    // Build discount for this bundle match
    const discount = buildDiscount(bundleDef, result);
    if (discount) {
      allDiscounts.push(discount);
    }
  }

  if (allDiscounts.length === 0) {
    return EMPTY_RESULT;
  }

  return {
    discountApplicationStrategy: "FIRST",
    discounts: allDiscounts,
  };
}

// ============================================
// CONFIG PARSING
// ============================================

function parseConfig(input: RunInput): BundleDiscountConfig | null {
  const metafieldValue = input.discountNode?.metafield?.value;
  if (!metafieldValue) {
    return null;
  }

  try {
    const config: BundleDiscountConfig = JSON.parse(metafieldValue);

    // Validate required fields
    if (!config.bundleId || !Array.isArray(config.bundles) || config.bundles.length === 0) {
      return null;
    }

    // Validate each bundle definition
    for (const bundle of config.bundles) {
      if (!Array.isArray(bundle.components) || bundle.components.length === 0) {
        return null;
      }
      if (!bundle.discount || !bundle.discount.type || bundle.discount.value <= 0) {
        return null;
      }
      for (const comp of bundle.components) {
        if (!comp.productId || comp.quantity < 1) {
          return null;
        }
      }
    }

    return config;
  } catch {
    return null;
  }
}

// ============================================
// BUNDLE MATCHING
// ============================================

/**
 * Determines if a bundle definition is satisfied by the current cart.
 *
 * Algorithm:
 * 1. For each component in the bundle, find cart lines that match
 *    (by product ID, and optionally by variant ID).
 * 2. Check that enough quantity exists for each component.
 * 3. Calculate how many complete bundle sets are present.
 * 4. Respect minBundleSets and maxBundleSets limits.
 * 5. Optionally validate _bundle_id attribute on line items.
 */
function matchBundle(
  definition: BundleDefinition,
  cartLines: CartLine[],
  remainingQuantity: Map<string, number>,
  bundleId: string
): BundleMatchResult {
  const noMatch: BundleMatchResult = {
    matched: false,
    bundleSets: 0,
    matchedLines: [],
    definition,
  };

  // For each component, find matching cart lines and available quantity
  const componentMatches: Array<{
    component: BundleComponent;
    lines: Array<{ lineId: string; variantId: string; available: number }>;
  }> = [];

  for (const component of definition.components) {
    const matchingLines: Array<{ lineId: string; variantId: string; available: number }> = [];

    for (const line of cartLines) {
      const available = remainingQuantity.get(line.id) || 0;
      if (available <= 0) continue;

      // Match product ID
      if (line.merchandise.product.id !== component.productId) continue;

      // Match variant ID if specified
      if (component.variantId && line.merchandise.id !== component.variantId) continue;

      // Optionally validate bundle attribute
      // If the line has a _bundle_id, it must match this bundle
      // Lines without _bundle_id can still be matched (for backwards compatibility)
      const lineBundleAttr = line.attribute?.value;
      if (lineBundleAttr && lineBundleAttr !== bundleId) continue;

      matchingLines.push({
        lineId: line.id,
        variantId: line.merchandise.id,
        available,
      });
    }

    componentMatches.push({ component, lines: matchingLines });
  }

  // Calculate maximum complete bundle sets
  let maxSets = Infinity;
  for (const { component, lines } of componentMatches) {
    const totalAvailable = lines.reduce((sum, l) => sum + l.available, 0);
    const setsFromComponent = Math.floor(totalAvailable / component.quantity);
    maxSets = Math.min(maxSets, setsFromComponent);
  }

  if (maxSets === Infinity || maxSets === 0) {
    return noMatch;
  }

  // Apply limits
  const minSets = definition.minBundleSets || 1;
  const maxAllowed = definition.maxBundleSets > 0 ? definition.maxBundleSets : Infinity;

  if (maxSets < minSets) {
    return noMatch;
  }

  const bundleSets = Math.min(maxSets, maxAllowed);

  // Allocate quantities from cart lines to bundle
  const matchedLines: MatchedLine[] = [];

  for (const { component, lines } of componentMatches) {
    let needed = component.quantity * bundleSets;

    for (const line of lines) {
      if (needed <= 0) break;

      const take = Math.min(needed, line.available);
      if (take > 0) {
        matchedLines.push({
          lineId: line.lineId,
          variantId: line.variantId,
          quantityUsed: take,
        });
        needed -= take;
      }
    }

    // Safety check: if we couldn't allocate enough, the match is invalid
    if (needed > 0) {
      return noMatch;
    }
  }

  return {
    matched: true,
    bundleSets,
    matchedLines,
    definition,
  };
}

// ============================================
// DISCOUNT BUILDING
// ============================================

/**
 * Builds the discount output for a matched bundle.
 * Targets only the specific variant IDs and quantities that form the bundle.
 */
function buildDiscount(
  definition: BundleDefinition,
  matchResult: BundleMatchResult
): Discount | null {
  if (!matchResult.matched || matchResult.matchedLines.length === 0) {
    return null;
  }

  // Build targets: one entry per matched line
  const targets: ProductVariantTarget[] = matchResult.matchedLines.map((ml) => ({
    productVariant: {
      id: ml.variantId,
      quantity: ml.quantityUsed,
    },
  }));

  // Build discount value
  const value = buildDiscountValue(definition);
  if (!value) {
    return null;
  }

  // Build message
  const tierLabel = definition.tierId ? ` (${definition.tierId})` : "";
  const setsLabel = matchResult.bundleSets > 1 ? ` x${matchResult.bundleSets}` : "";
  const message = `Bundle discount${tierLabel}${setsLabel}`;

  return {
    message,
    targets,
    value,
  };
}

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

  return null;
}

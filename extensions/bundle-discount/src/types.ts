/**
 * Types for the Shopify Discount Function
 *
 * These types mirror the GraphQL input query schema (run.graphql)
 * and the expected output for purchase.product-discount.run.
 */

// ============================================
// GRAPHQL INPUT TYPES (from run.graphql)
// ============================================

export interface RunInput {
  cart: Cart;
  discountNode: DiscountNode;
}

export interface Cart {
  lines: CartLine[];
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: ProductVariant;
  attribute: CartAttribute | null;
  tierAttribute: CartAttribute | null;
}

export interface ProductVariant {
  id: string;
  product: {
    id: string;
  };
}

export interface CartAttribute {
  value: string;
}

export interface DiscountNode {
  metafield: {
    value: string;
  } | null;
}

// ============================================
// BUNDLE CONFIGURATION (stored in metafield)
// ============================================

/**
 * Bundle configuration stored in the discount's metafield.
 * Written by the app when publishing a bundle.
 * Read by the Function at checkout time.
 */
export interface BundleDiscountConfig {
  /** Unique bundle identifier from the app's database */
  bundleId: string;

  /** Bundle type */
  bundleType?: "FIXED" | "TIERED" | "BOGO" | "MIX_MATCH" | "BUILD_YOUR_OWN" | "SUBSCRIPTION" | "GIFT";

  /** Array of bundle definitions (supports multiple bundles per discount for tiered) */
  bundles: BundleDefinition[];
}

export interface BundleDefinition {
  /** Tier identifier for tiered bundles (e.g., "tier_1pack", "tier_3pack") */
  tierId?: string;

  /** Minimum times the full bundle set must be present (for quantity multiples) */
  minBundleSets: number;

  /** Maximum bundle sets to discount (0 = unlimited) */
  maxBundleSets: number;

  /** Products required in the bundle */
  components: BundleComponent[];

  /** Discount to apply when bundle is complete */
  discount: BundleDiscountValue;

  /** BOGO: items that become free/discounted when bundle is matched */
  freeItems?: BundleComponent[];
  freeItemDiscount?: BundleDiscountValue;

  /** MIX_MATCH / BUILD_YOUR_OWN: optional product pool */
  optionalComponents?: BundleComponent[];
  minRequiredOptional?: number;
}

export interface BundleComponent {
  /** Shopify Product GID (e.g., "gid://shopify/Product/123") */
  productId: string;

  /** Optional: specific variant required. If omitted, any variant of the product qualifies. */
  variantId?: string;

  /** Required quantity of this product per bundle set */
  quantity: number;
}

export interface BundleDiscountValue {
  /** "percentage", "fixed_amount", or "free_item" */
  type: "percentage" | "fixed_amount" | "free_item";

  /** For percentage: 0-100. For fixed_amount: amount in shop currency. For free_item: usually 100. */
  value: number;
}

// ============================================
// FUNCTION OUTPUT TYPES
// ============================================

export interface FunctionRunResult {
  discountApplicationStrategy: "FIRST" | "MAXIMUM";
  discounts: Discount[];
}

export interface Discount {
  message?: string;
  targets: Target[];
  value: DiscountValue;
}

export type Target = ProductVariantTarget;

export interface ProductVariantTarget {
  productVariant: {
    id: string;
    quantity: number;
  };
}

export type DiscountValue = PercentageValue | FixedAmountValue;

export interface PercentageValue {
  percentage: {
    value: string;
  };
}

export interface FixedAmountValue {
  fixedAmount: {
    amount: string;
  };
}

// ============================================
// INTERNAL TYPES (used during validation)
// ============================================

export interface CartLineMatch {
  lineId: string;
  variantId: string;
  productId: string;
  quantity: number;
  bundleId: string | null;
}

export interface BundleMatchResult {
  matched: boolean;
  bundleSets: number;
  matchedLines: MatchedLine[];
  freeItemLines?: MatchedLine[];
  definition: BundleDefinition;
}

export interface MatchedLine {
  lineId: string;
  variantId: string;
  quantityUsed: number;
}

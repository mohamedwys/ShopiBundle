/**
 * Pricing Service - V2 (Phase 2 Enhanced)
 *
 * Handles price calculations for bundles with multiple discount types:
 * - PERCENTAGE: X% off the total price
 * - FIXED_AMOUNT: $X off the total price
 * - FIXED_PRICE: Bundle sells at exactly $X
 *
 * Supports tiered pricing and volume discounts (future sprints).
 */

import { logger } from '@/lib/monitoring/logger';
import { PricingMetrics } from '@/lib/monitoring/metrics';

// Types
export interface PricingComponent {
  id: string;
  shopifyProductId: string;
  shopifyVariantId?: string | null;
  quantity: number;
  cachedPrice?: number | null;
  cachedCompareAtPrice?: number | null;
  cachedTitle?: string | null;
}

export interface PricingResult {
  originalPrice: number;
  compareAtPrice: number;
  discountedPrice: number;
  savings: number;
  savingsPercentage: number;
  lineItems: PricingLineItem[];
  appliedDiscount: AppliedDiscount | null;
  pricePerUnit?: number;
  isOnSale: boolean;
}

export interface PricingLineItem {
  componentId: string;
  productId: string;
  variantId?: string | null;
  title: string;
  quantity: number;
  unitPrice: number;
  linePrice: number;
  discountedLinePrice: number;
  lineDiscount: number;
  discountPercentage: number;
}

export interface AppliedDiscount {
  type: DiscountTypeEnum;
  value: number;
  amount: number;
  description: string;
  code?: string;
}

export type DiscountTypeEnum = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FIXED_PRICE' | 'FREE_ITEM';

export interface PricingRule {
  id: string;
  ruleType: string;
  discountType: DiscountTypeEnum;
  discountValue: number;
  isActive: boolean;
  priority?: number;
  conditions?: Record<string, unknown>;
  startsAt?: Date | null;
  endsAt?: Date | null;
  usageLimit?: number | null;
  usageCount?: number;
}

export interface TieredPricing {
  minQuantity: number;
  maxQuantity?: number;
  discountType: DiscountTypeEnum;
  discountValue: number;
}

export interface BundlePricingConfig {
  discountType: DiscountTypeEnum;
  discountValue: number;
  minimumPurchase?: number;
  maximumDiscount?: number;
  combinableWithOtherDiscounts?: boolean;
  tieredPricing?: TieredPricing[];
}

export class PricingService {
  /**
   * Calculate price for a fixed bundle with percentage discount
   * This is the Sprint 1 implementation - simple percentage off total
   */
  calculateFixedBundlePrice(
    components: PricingComponent[],
    discountPercent: number
  ): PricingResult {
    return this.calculateBundlePriceWithConfig(components, {
      discountType: 'PERCENTAGE',
      discountValue: discountPercent,
    });
  }

  /**
   * Calculate bundle price with flexible discount configuration
   * Supports: PERCENTAGE, FIXED_AMOUNT, FIXED_PRICE discount types
   */
  calculateBundlePriceWithConfig(
    components: PricingComponent[],
    config: BundlePricingConfig
  ): PricingResult {
    const startTime = performance.now();

    // Build line items with enhanced data
    const lineItems: PricingLineItem[] = components.map((comp) => {
      const unitPrice = comp.cachedPrice || 0;
      const linePrice = unitPrice * comp.quantity;

      return {
        componentId: comp.id,
        productId: comp.shopifyProductId,
        variantId: comp.shopifyVariantId,
        title: comp.cachedTitle || `Product ${comp.shopifyProductId}`,
        quantity: comp.quantity,
        unitPrice,
        linePrice,
        discountedLinePrice: linePrice,
        lineDiscount: 0,
        discountPercentage: 0,
      };
    });

    // Calculate totals
    const originalPrice = lineItems.reduce((sum, item) => sum + item.linePrice, 0);
    const compareAtPrice = components.reduce((sum, comp) => {
      const price = comp.cachedCompareAtPrice || comp.cachedPrice || 0;
      return sum + (price * comp.quantity);
    }, 0);

    // Apply discount based on type
    let discountAmount = 0;
    let discountedPrice = originalPrice;
    let savingsPercentage = 0;

    switch (config.discountType) {
      case 'PERCENTAGE':
        discountAmount = originalPrice * (config.discountValue / 100);
        // Apply maximum discount cap if specified
        if (config.maximumDiscount && discountAmount > config.maximumDiscount) {
          discountAmount = config.maximumDiscount;
        }
        discountedPrice = Math.max(0, originalPrice - discountAmount);
        savingsPercentage = config.discountValue;
        break;

      case 'FIXED_AMOUNT':
        discountAmount = Math.min(config.discountValue, originalPrice);
        discountedPrice = Math.max(0, originalPrice - discountAmount);
        savingsPercentage = originalPrice > 0
          ? Math.round((discountAmount / originalPrice) * 100)
          : 0;
        break;

      case 'FIXED_PRICE':
        // Bundle sells at exactly the specified price
        discountedPrice = config.discountValue;
        discountAmount = Math.max(0, originalPrice - discountedPrice);
        savingsPercentage = originalPrice > 0
          ? Math.round((discountAmount / originalPrice) * 100)
          : 0;
        break;

      case 'FREE_ITEM':
        // The discount is applied to the cheapest item(s)
        const sortedItems = [...lineItems].sort((a, b) => a.unitPrice - b.unitPrice);
        const freeItemCount = Math.min(config.discountValue, sortedItems.length);
        for (let i = 0; i < freeItemCount; i++) {
          discountAmount += sortedItems[i].linePrice;
        }
        discountedPrice = Math.max(0, originalPrice - discountAmount);
        savingsPercentage = originalPrice > 0
          ? Math.round((discountAmount / originalPrice) * 100)
          : 0;
        break;
    }

    // Distribute discount proportionally across line items
    if (originalPrice > 0 && discountAmount > 0) {
      lineItems.forEach((item) => {
        const proportion = item.linePrice / originalPrice;
        item.lineDiscount = this.roundPrice(discountAmount * proportion);
        item.discountedLinePrice = this.roundPrice(item.linePrice - item.lineDiscount);
        item.discountPercentage = item.linePrice > 0
          ? Math.round((item.lineDiscount / item.linePrice) * 100)
          : 0;
      });
    }

    // Calculate price per unit (total items in bundle)
    const totalUnits = components.reduce((sum, c) => sum + c.quantity, 0);
    const pricePerUnit = totalUnits > 0 ? this.roundPrice(discountedPrice / totalUnits) : 0;

    const result: PricingResult = {
      originalPrice: this.roundPrice(originalPrice),
      compareAtPrice: this.roundPrice(Math.max(compareAtPrice, originalPrice)),
      discountedPrice: this.roundPrice(discountedPrice),
      savings: this.roundPrice(discountAmount),
      savingsPercentage,
      lineItems,
      pricePerUnit,
      isOnSale: discountAmount > 0,
      appliedDiscount: discountAmount > 0
        ? {
            type: config.discountType,
            value: config.discountValue,
            amount: this.roundPrice(discountAmount),
            description: this.generateDiscountDescription(config),
          }
        : null,
    };

    // Track metrics
    const duration = performance.now() - startTime;
    PricingMetrics.calculated('FIXED', duration);

    if (discountAmount > 0) {
      PricingMetrics.discountApplied('BUNDLE_DISCOUNT', discountAmount);
    }

    return result;
  }

  /**
   * Generate human-readable discount description
   */
  private generateDiscountDescription(config: BundlePricingConfig): string {
    switch (config.discountType) {
      case 'PERCENTAGE':
        return `${config.discountValue}% bundle discount`;
      case 'FIXED_AMOUNT':
        return `$${config.discountValue.toFixed(2)} off bundle`;
      case 'FIXED_PRICE':
        return `Bundle price: $${config.discountValue.toFixed(2)}`;
      case 'FREE_ITEM':
        return `${config.discountValue} free item(s) in bundle`;
      default:
        return 'Bundle discount applied';
    }
  }

  /**
   * Calculate price with multiple rules - applies the best discount
   */
  calculateBundlePrice(
    components: PricingComponent[],
    rules: PricingRule[],
    context?: PricingContext
  ): PricingResult {
    // Filter active rules that haven't expired
    const now = new Date();
    const activeRules = rules.filter((r) => {
      if (!r.isActive) return false;
      if (r.startsAt && new Date(r.startsAt) > now) return false;
      if (r.endsAt && new Date(r.endsAt) < now) return false;
      if (r.usageLimit && r.usageCount && r.usageCount >= r.usageLimit) return false;
      return true;
    });

    if (activeRules.length === 0) {
      // No active discounts, return original price
      return this.calculateBundlePriceWithConfig(components, {
        discountType: 'PERCENTAGE',
        discountValue: 0,
      });
    }

    // Sort by priority (higher priority first)
    activeRules.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Use the highest priority rule
    const bestRule = activeRules[0];

    return this.calculateBundlePriceWithConfig(components, {
      discountType: bestRule.discountType,
      discountValue: Number(bestRule.discountValue),
    });
  }

  /**
   * Calculate tiered pricing based on quantity
   */
  calculateTieredPrice(
    components: PricingComponent[],
    tiers: TieredPricing[],
    bundleQuantity: number = 1
  ): PricingResult {
    // Sort tiers by minQuantity descending to find applicable tier
    const sortedTiers = [...tiers].sort((a, b) => b.minQuantity - a.minQuantity);

    // Find the applicable tier
    const applicableTier = sortedTiers.find(
      (tier) => bundleQuantity >= tier.minQuantity &&
                (!tier.maxQuantity || bundleQuantity <= tier.maxQuantity)
    );

    if (!applicableTier) {
      // No tier applies, use base price
      return this.calculateBundlePriceWithConfig(components, {
        discountType: 'PERCENTAGE',
        discountValue: 0,
      });
    }

    // Calculate with the tier's discount
    const baseResult = this.calculateBundlePriceWithConfig(components, {
      discountType: applicableTier.discountType,
      discountValue: applicableTier.discountValue,
    });

    // Multiply for bundle quantity
    return {
      ...baseResult,
      originalPrice: this.roundPrice(baseResult.originalPrice * bundleQuantity),
      compareAtPrice: this.roundPrice(baseResult.compareAtPrice * bundleQuantity),
      discountedPrice: this.roundPrice(baseResult.discountedPrice * bundleQuantity),
      savings: this.roundPrice(baseResult.savings * bundleQuantity),
      appliedDiscount: baseResult.appliedDiscount
        ? {
            ...baseResult.appliedDiscount,
            amount: this.roundPrice(baseResult.appliedDiscount.amount * bundleQuantity)
          }
        : null,
    };
  }

  /**
   * Validate that components have pricing data
   */
  validateComponentPricing(components: PricingComponent[]): ValidationResult {
    const missingPrices = components.filter((c) => c.cachedPrice === null || c.cachedPrice === undefined);

    if (missingPrices.length > 0) {
      return {
        valid: false,
        errors: missingPrices.map((c) => ({
          componentId: c.id,
          productId: c.shopifyProductId,
          message: 'Missing price data',
        })),
      };
    }

    return { valid: true, errors: [] };
  }

  /**
   * Calculate savings compared to buying items separately
   */
  calculateSavings(
    bundlePrice: number,
    componentPrices: number[]
  ): { amount: number; percentage: number } {
    const separateTotal = componentPrices.reduce((sum, p) => sum + p, 0);
    const amount = Math.max(0, separateTotal - bundlePrice);
    const percentage = separateTotal > 0 ? Math.round((amount / separateTotal) * 100) : 0;

    return { amount: this.roundPrice(amount), percentage };
  }

  /**
   * Format price for display
   */
  formatPrice(amount: number, currencyCode: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  }

  /**
   * Convert cents to dollars (Shopify stores prices in cents for some APIs)
   */
  centsToAmount(cents: number): number {
    return this.roundPrice(cents / 100);
  }

  /**
   * Convert dollars to cents
   */
  amountToCents(amount: number): number {
    return Math.round(amount * 100);
  }

  // Private helpers

  private roundPrice(amount: number): number {
    return Math.round(amount * 100) / 100;
  }
}

// Additional types
export interface PricingContext {
  customerId?: string;
  customerTags?: string[];
  quantity?: number;
  currencyCode?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    componentId: string;
    productId: string;
    message: string;
  }>;
}

// Singleton instance
let pricingServiceInstance: PricingService | null = null;

export function getPricingService(): PricingService {
  if (!pricingServiceInstance) {
    pricingServiceInstance = new PricingService();
  }
  return pricingServiceInstance;
}

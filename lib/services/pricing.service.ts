/**
 * Pricing Service - V2
 *
 * Handles price calculations for bundles.
 * Sprint 1: Percentage discounts only for FIXED bundles.
 * Future sprints will add tiered pricing, BOGO, etc.
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
  cachedTitle?: string | null;
}

export interface PricingResult {
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  savingsPercentage: number;
  lineItems: PricingLineItem[];
  appliedDiscount: AppliedDiscount | null;
}

export interface PricingLineItem {
  componentId: string;
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  linePrice: number;
  discountedLinePrice: number;
  lineDiscount: number;
}

export interface AppliedDiscount {
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FIXED_PRICE';
  value: number;
  amount: number;
  description: string;
}

export interface PricingRule {
  id: string;
  ruleType: string;
  discountType: string;
  discountValue: number;
  isActive: boolean;
  conditions?: Record<string, unknown>;
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
    const startTime = performance.now();

    // Build line items
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
        discountedLinePrice: linePrice, // Will be updated below
        lineDiscount: 0, // Will be updated below
      };
    });

    // Calculate totals
    const originalPrice = lineItems.reduce((sum, item) => sum + item.linePrice, 0);

    // Apply percentage discount
    const discountAmount = originalPrice * (discountPercent / 100);
    const discountedPrice = Math.max(0, originalPrice - discountAmount);

    // Distribute discount proportionally across line items
    if (originalPrice > 0) {
      lineItems.forEach((item) => {
        const proportion = item.linePrice / originalPrice;
        item.lineDiscount = discountAmount * proportion;
        item.discountedLinePrice = item.linePrice - item.lineDiscount;
      });
    }

    const result: PricingResult = {
      originalPrice: this.roundPrice(originalPrice),
      discountedPrice: this.roundPrice(discountedPrice),
      savings: this.roundPrice(discountAmount),
      savingsPercentage: discountPercent,
      lineItems,
      appliedDiscount:
        discountPercent > 0
          ? {
              type: 'PERCENTAGE',
              value: discountPercent,
              amount: this.roundPrice(discountAmount),
              description: `${discountPercent}% bundle discount`,
            }
          : null,
    };

    // Track metrics
    const duration = performance.now() - startTime;
    PricingMetrics.calculated('FIXED', duration);

    if (discountPercent > 0) {
      PricingMetrics.discountApplied('BUNDLE_DISCOUNT', discountAmount);
    }

    return result;
  }

  /**
   * Calculate price with multiple rules (for future sprints)
   * Currently just delegates to calculateFixedBundlePrice
   */
  calculateBundlePrice(
    components: PricingComponent[],
    rules: PricingRule[],
    context?: PricingContext
  ): PricingResult {
    // Find the active bundle discount rule
    const discountRule = rules.find(
      (r) => r.isActive && r.ruleType === 'BUNDLE_DISCOUNT' && r.discountType === 'PERCENTAGE'
    );

    const discountPercent = discountRule ? Number(discountRule.discountValue) : 0;

    return this.calculateFixedBundlePrice(components, discountPercent);
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

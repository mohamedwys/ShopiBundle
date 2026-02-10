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
   * Apply any discount type to a set of components.
   * Handles PERCENTAGE, FIXED_AMOUNT, FIXED_PRICE, FREE_ITEM.
   */
  private calculateWithDiscount(
    components: PricingComponent[],
    discountType: string,
    discountValue: number,
    freeComponentIds?: string[]
  ): PricingResult {
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
        discountedLinePrice: linePrice,
        lineDiscount: 0,
      };
    });

    const originalPrice = lineItems.reduce((sum, item) => sum + item.linePrice, 0);
    let discountAmount = 0;

    switch (discountType) {
      case 'PERCENTAGE': {
        const pct = Math.min(Math.max(discountValue, 0), 100);
        discountAmount = originalPrice * (pct / 100);
        // Distribute proportionally
        if (originalPrice > 0) {
          lineItems.forEach((item) => {
            const proportion = item.linePrice / originalPrice;
            item.lineDiscount = discountAmount * proportion;
            item.discountedLinePrice = item.linePrice - item.lineDiscount;
          });
        }
        break;
      }
      case 'FIXED_AMOUNT': {
        discountAmount = Math.min(discountValue, originalPrice);
        // Distribute proportionally
        if (originalPrice > 0) {
          lineItems.forEach((item) => {
            const proportion = item.linePrice / originalPrice;
            item.lineDiscount = discountAmount * proportion;
            item.discountedLinePrice = item.linePrice - item.lineDiscount;
          });
        }
        break;
      }
      case 'FIXED_PRICE': {
        // Total bundle costs exactly discountValue
        const targetPrice = Math.max(discountValue, 0);
        discountAmount = Math.max(0, originalPrice - targetPrice);
        if (originalPrice > 0) {
          lineItems.forEach((item) => {
            const proportion = item.linePrice / originalPrice;
            item.lineDiscount = discountAmount * proportion;
            item.discountedLinePrice = item.linePrice - item.lineDiscount;
          });
        }
        break;
      }
      case 'FREE_ITEM': {
        // Make specific components free
        lineItems.forEach((item) => {
          if (freeComponentIds && freeComponentIds.includes(item.componentId)) {
            item.lineDiscount = item.linePrice;
            item.discountedLinePrice = 0;
            discountAmount += item.linePrice;
          }
        });
        break;
      }
    }

    const discountedPrice = Math.max(0, originalPrice - discountAmount);

    return {
      originalPrice: this.roundPrice(originalPrice),
      discountedPrice: this.roundPrice(discountedPrice),
      savings: this.roundPrice(discountAmount),
      savingsPercentage: originalPrice > 0 ? this.roundPrice((discountAmount / originalPrice) * 100) : 0,
      lineItems,
      appliedDiscount: discountAmount > 0 ? {
        type: discountType as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FIXED_PRICE',
        value: discountValue,
        amount: this.roundPrice(discountAmount),
        description: this.buildDiscountDescription(discountType, discountValue),
      } : null,
    };
  }

  private buildDiscountDescription(discountType: string, value: number): string {
    switch (discountType) {
      case 'PERCENTAGE': return `${value}% bundle discount`;
      case 'FIXED_AMOUNT': return `$${value} off bundle`;
      case 'FIXED_PRICE': return `Bundle for $${value}`;
      case 'FREE_ITEM': return `Free item included`;
      default: return `Bundle discount`;
    }
  }

  /**
   * Calculate price for a tiered/volume bundle.
   * Finds the best matching tier based on quantity, applies that tier's discount.
   */
  calculateTieredBundlePrice(
    components: PricingComponent[],
    tiers: PricingRule[],
    quantity: number
  ): PricingResult {
    // Sort tiers by minQuantity descending to find best match
    const sortedTiers = [...tiers]
      .filter(t => t.isActive && t.ruleType === 'VOLUME_TIER')
      .sort((a, b) => {
        const aMin = (a.conditions as any)?.minQuantity ?? 0;
        const bMin = (b.conditions as any)?.minQuantity ?? 0;
        return bMin - aMin;
      });

    // Find the best matching tier (highest minQuantity that quantity satisfies)
    const matchedTier = sortedTiers.find(t => {
      const minQty = (t.conditions as any)?.minQuantity ?? 1;
      return quantity >= minQty;
    });

    if (!matchedTier) {
      // No tier matches — return full price
      return this.calculateWithDiscount(components, 'PERCENTAGE', 0);
    }

    // Scale components by quantity
    const scaledComponents = components.map(c => ({
      ...c,
      quantity: c.quantity * quantity,
    }));

    const result = this.calculateWithDiscount(
      scaledComponents,
      matchedTier.discountType,
      Number(matchedTier.discountValue)
    );

    PricingMetrics.calculated('TIERED', 0);
    if (result.savings > 0) PricingMetrics.discountApplied('VOLUME_TIER', result.savings);
    return result;
  }

  /**
   * Calculate BOGO pricing.
   * buyComponents are at full price, freeComponents are discounted per the rule.
   */
  calculateBogoBundlePrice(
    buyComponents: PricingComponent[],
    freeComponents: PricingComponent[],
    bogoRule: PricingRule
  ): PricingResult {
    const allComponents = [...buyComponents, ...freeComponents];
    const freeIds = freeComponents.map(c => c.id);

    if (bogoRule.discountType === 'FREE_ITEM') {
      // "Get" items are completely free
      const result = this.calculateWithDiscount(allComponents, 'FREE_ITEM', 0, freeIds);
      PricingMetrics.calculated('BOGO', 0);
      return result;
    }

    // "Get" items at a discount (e.g. 50% off the free items)
    // Calculate full price of all items, then discount only the free items
    const lineItems: PricingLineItem[] = allComponents.map((comp) => {
      const unitPrice = comp.cachedPrice || 0;
      const linePrice = unitPrice * comp.quantity;
      const isFree = freeIds.includes(comp.id);
      let lineDiscount = 0;

      if (isFree) {
        if (bogoRule.discountType === 'PERCENTAGE') {
          lineDiscount = linePrice * (Number(bogoRule.discountValue) / 100);
        } else if (bogoRule.discountType === 'FIXED_AMOUNT') {
          lineDiscount = Math.min(Number(bogoRule.discountValue), linePrice);
        }
      }

      return {
        componentId: comp.id,
        productId: comp.shopifyProductId,
        title: comp.cachedTitle || `Product ${comp.shopifyProductId}`,
        quantity: comp.quantity,
        unitPrice,
        linePrice,
        discountedLinePrice: linePrice - lineDiscount,
        lineDiscount,
      };
    });

    const originalPrice = lineItems.reduce((sum, i) => sum + i.linePrice, 0);
    const discountAmount = lineItems.reduce((sum, i) => sum + i.lineDiscount, 0);

    PricingMetrics.calculated('BOGO', 0);
    return {
      originalPrice: this.roundPrice(originalPrice),
      discountedPrice: this.roundPrice(originalPrice - discountAmount),
      savings: this.roundPrice(discountAmount),
      savingsPercentage: originalPrice > 0 ? this.roundPrice((discountAmount / originalPrice) * 100) : 0,
      lineItems,
      appliedDiscount: discountAmount > 0 ? {
        type: bogoRule.discountType as any,
        value: Number(bogoRule.discountValue),
        amount: this.roundPrice(discountAmount),
        description: 'Buy one get one deal',
      } : null,
    };
  }

  /**
   * Calculate price for mix-and-match bundles.
   * Only selected components are priced; discount applies to the selection total.
   */
  calculateMixMatchBundlePrice(
    selectedComponents: PricingComponent[],
    rule: PricingRule
  ): PricingResult {
    const result = this.calculateWithDiscount(
      selectedComponents,
      rule.discountType,
      Number(rule.discountValue)
    );
    PricingMetrics.calculated('MIX_MATCH', 0);
    return result;
  }

  /**
   * Calculate price with multiple rules.
   * Dispatches to type-specific calculators, then applies stacked secondary rules.
   */
  calculateBundlePrice(
    components: PricingComponent[],
    rules: PricingRule[],
    context?: PricingContext
  ): PricingResult {
    const activeRules = rules.filter(r => r.isActive);

    // Check time-limited rules: filter out expired/not-started rules
    const now = context?.now || new Date();
    const validRules = activeRules.filter(r => {
      if (r.ruleType === 'TIME_LIMITED') {
        const conditions = r.conditions as any;
        if (conditions?.startsAt && new Date(conditions.startsAt) > now) return false;
        if (conditions?.endsAt && new Date(conditions.endsAt) < now) return false;
      }
      return true;
    });

    // Find the primary discount rule (highest priority)
    const primaryRule = validRules
      .filter(r => ['BUNDLE_DISCOUNT', 'VOLUME_TIER', 'BOGO', 'TIME_LIMITED'].includes(r.ruleType))
      .sort((a, b) => (a as any).priority - (b as any).priority)[0];

    if (!primaryRule) {
      // No active discount — return full price
      return this.calculateWithDiscount(components, 'PERCENTAGE', 0);
    }

    // Calculate base result from primary rule
    let result: PricingResult;

    if (primaryRule.ruleType === 'VOLUME_TIER') {
      const tierRules = validRules.filter(r => r.ruleType === 'VOLUME_TIER');
      result = this.calculateTieredBundlePrice(components, tierRules, context?.quantity || 1);
    } else {
      result = this.calculateWithDiscount(
        components,
        primaryRule.discountType,
        Number(primaryRule.discountValue)
      );
    }

    // Apply secondary stacked discounts (MEMBER_PRICE, FIRST_PURCHASE)
    const secondaryRules = validRules.filter(r =>
      ['MEMBER_PRICE', 'FIRST_PURCHASE'].includes(r.ruleType)
    );

    for (const rule of secondaryRules) {
      if (rule.ruleType === 'MEMBER_PRICE' && context?.customerTags) {
        const requiredTags = (rule.conditions as any)?.requiredTags || [];
        const hasTag = requiredTags.some((tag: string) => context.customerTags!.includes(tag));
        if (!hasTag) continue;
      }
      if (rule.ruleType === 'FIRST_PURCHASE' && !context?.isFirstPurchase) {
        continue;
      }

      // Apply additional discount on already-discounted price
      const additionalDiscount = rule.discountType === 'PERCENTAGE'
        ? result.discountedPrice * (Number(rule.discountValue) / 100)
        : Math.min(Number(rule.discountValue), result.discountedPrice);

      result = {
        ...result,
        discountedPrice: this.roundPrice(result.discountedPrice - additionalDiscount),
        savings: this.roundPrice(result.savings + additionalDiscount),
        savingsPercentage: result.originalPrice > 0
          ? this.roundPrice(((result.savings + additionalDiscount) / result.originalPrice) * 100)
          : 0,
      };
    }

    const bundleType = primaryRule.ruleType === 'VOLUME_TIER' ? 'TIERED' : 'FIXED';
    PricingMetrics.calculated(bundleType, 0);

    return result;
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
  now?: Date;
  isFirstPurchase?: boolean;
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

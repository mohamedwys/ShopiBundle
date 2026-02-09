/**
 * Billing Service
 *
 * Handles plan management, revenue tracking, and Shopify billing integration.
 * Implements the "Forever Free" model with revenue-based upgrade limits.
 */

import prisma from '@/utils/prisma';

export type PlanType = 'FREE' | 'STARTER';

interface PlanConfig {
  name: string;
  price: number;
  revenueLimit: number;
  trialDays: number;
}

export const PLANS: Record<PlanType, PlanConfig> = {
  FREE: {
    name: 'Forever Free',
    price: 0,
    revenueLimit: 100, // $100/month
    trialDays: 0,
  },
  STARTER: {
    name: 'Starter',
    price: 10,
    revenueLimit: 1000, // $1,000/month
    trialDays: 14,
  },
};

export interface BillingUsage {
  plan: PlanType;
  monthlyRevenue: number;
  revenueLimit: number;
  usagePercent: number;
  daysUntilReset: number;
  isOverLimit: boolean;
  isNearLimit: boolean;
  upgradeMessage: string | null;
}

export class BillingService {
  /**
   * Get or create shop settings with billing defaults
   */
  async getOrCreateSettings(shop: string) {
    let settings = await prisma.shopSettings.findUnique({ where: { shop } });

    if (!settings) {
      settings = await prisma.shopSettings.create({
        data: {
          shop,
          plan: 'FREE',
          revenueLimit: PLANS.FREE.revenueLimit,
        },
      });
    }

    return settings;
  }

  /**
   * Get current billing usage (for dashboard banner)
   */
  async getUsage(shop: string): Promise<BillingUsage> {
    const settings = await this.getOrCreateSettings(shop);
    const plan = settings.plan as PlanType;
    const monthlyRevenue = Number(settings.monthlyBundleRevenue);
    const revenueLimit = Number(settings.revenueLimit);
    const usagePercent = revenueLimit > 0 ? Math.round((monthlyRevenue / revenueLimit) * 100) : 0;

    // Calculate days until revenue reset
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const daysUntilReset = Math.ceil(
      (nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isOverLimit = monthlyRevenue >= revenueLimit;
    const isNearLimit = usagePercent >= 80 && !isOverLimit;

    let upgradeMessage: string | null = null;
    if (plan === 'FREE') {
      if (monthlyRevenue >= revenueLimit * 1.5) {
        upgradeMessage = `You've generated $${monthlyRevenue.toFixed(0)} in bundle revenue! Upgrade to unlock up to $1,000/month.`;
      } else if (isOverLimit) {
        upgradeMessage = `You've exceeded the Free plan limit! Your bundles are working great. Upgrade to Starter for $10/mo.`;
      } else if (isNearLimit) {
        upgradeMessage = `You've generated $${monthlyRevenue.toFixed(0)} in bundle revenue! You're ${usagePercent}% to your Free plan limit.`;
      }
    }

    return {
      plan,
      monthlyRevenue,
      revenueLimit,
      usagePercent,
      daysUntilReset,
      isOverLimit,
      isNearLimit,
      upgradeMessage,
    };
  }

  /**
   * Track bundle revenue from an order
   */
  async trackRevenue(
    shop: string,
    orderId: string,
    orderNumber: string,
    bundleRevenue: number,
    bundleId?: string,
    bundleName?: string,
    tierId?: string,
    customerId?: string,
    customerEmail?: string,
    totalOrderValue?: number
  ) {
    // Create order record
    await prisma.bundleOrder.upsert({
      where: { shop_shopifyOrderId: { shop, shopifyOrderId: orderId } },
      create: {
        shop,
        shopifyOrderId: orderId,
        shopifyOrderNumber: orderNumber,
        totalOrderValue: totalOrderValue || bundleRevenue,
        bundleRevenue,
        bundleId,
        bundleName,
        tierId,
        customerId,
        customerEmail,
        itemCount: 1,
      },
      update: {
        bundleRevenue: { increment: bundleRevenue },
        itemCount: { increment: 1 },
      },
    });

    // Increment monthly revenue
    await prisma.shopSettings.upsert({
      where: { shop },
      create: {
        shop,
        monthlyBundleRevenue: bundleRevenue,
      },
      update: {
        monthlyBundleRevenue: { increment: bundleRevenue },
      },
    });

    // Update monthly snapshot
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    await prisma.monthlyRevenue.upsert({
      where: { shop_month: { shop, month: monthStart } },
      create: {
        shop,
        month: monthStart,
        year: now.getFullYear(),
        monthNum: now.getMonth() + 1,
        bundleRevenue,
        orderCount: 1,
        bundleOrderCount: 1,
      },
      update: {
        bundleRevenue: { increment: bundleRevenue },
        bundleOrderCount: { increment: 1 },
      },
    });
  }

  /**
   * Reset monthly revenue (called on 1st of each month)
   */
  async resetMonthlyRevenue(shop: string) {
    await prisma.shopSettings.update({
      where: { shop },
      data: {
        monthlyBundleRevenue: 0,
        revenueLimitWarned: false,
        lastRevenueResetAt: new Date(),
      },
    });
  }

  /**
   * Upgrade shop to Starter plan
   */
  async upgradePlan(shop: string, shopifyChargeId: string) {
    await prisma.shopSettings.upsert({
      where: { shop },
      create: {
        shop,
        plan: 'STARTER',
        revenueLimit: PLANS.STARTER.revenueLimit,
        shopifyChargeId,
        planActivatedAt: new Date(),
      },
      update: {
        plan: 'STARTER',
        revenueLimit: PLANS.STARTER.revenueLimit,
        shopifyChargeId,
        planActivatedAt: new Date(),
      },
    });
  }

  /**
   * Downgrade shop to Free plan
   */
  async downgradePlan(shop: string) {
    await prisma.shopSettings.update({
      where: { shop },
      data: {
        plan: 'FREE',
        revenueLimit: PLANS.FREE.revenueLimit,
        shopifyChargeId: null,
        shopifySubscriptionId: null,
      },
    });
  }

  /**
   * Get analytics overview for dashboard
   */
  async getAnalyticsOverview(shop: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const previousStartDate = new Date();
    previousStartDate.setDate(previousStartDate.getDate() - days * 2);

    // Get bundles for this shop
    const bundles = await prisma.bundle.findMany({
      where: { shop },
      select: { id: true },
    });
    const bundleIds = bundles.map((b) => b.id);

    if (bundleIds.length === 0) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalImpressions: 0,
        totalAddToCarts: 0,
        conversionRate: 0,
        aovLift: 0,
        previousPeriod: null,
      };
    }

    // Current period
    const currentAnalytics = await prisma.bundleAnalytics.aggregate({
      where: {
        bundleId: { in: bundleIds },
        date: { gte: startDate },
      },
      _sum: {
        revenue: true,
        orders: true,
        impressions: true,
        addToCarts: true,
        clicks: true,
      },
    });

    // Previous period for comparison
    const previousAnalytics = await prisma.bundleAnalytics.aggregate({
      where: {
        bundleId: { in: bundleIds },
        date: { gte: previousStartDate, lt: startDate },
      },
      _sum: {
        revenue: true,
        orders: true,
        impressions: true,
      },
    });

    const totalRevenue = Number(currentAnalytics._sum.revenue || 0);
    const totalOrders = currentAnalytics._sum.orders || 0;
    const totalImpressions = currentAnalytics._sum.impressions || 0;
    const totalAddToCarts = currentAnalytics._sum.addToCarts || 0;
    const conversionRate =
      totalImpressions > 0
        ? Math.round((totalOrders / totalImpressions) * 10000) / 100
        : 0;

    const prevRevenue = Number(previousAnalytics._sum.revenue || 0);
    const revenueGrowth =
      prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : 0;

    return {
      totalRevenue,
      totalOrders,
      totalImpressions,
      totalAddToCarts,
      conversionRate,
      aovLift: 0, // Would need baseline AOV to calculate
      previousPeriod: {
        revenue: prevRevenue,
        orders: previousAnalytics._sum.orders || 0,
        revenueGrowth,
      },
    };
  }

  /**
   * Get per-bundle performance data
   */
  async getBundlePerformance(shop: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const bundles = await prisma.bundle.findMany({
      where: { shop, status: { in: ['ACTIVE', 'PAUSED'] } },
      select: {
        id: true,
        name: true,
        title: true,
        type: true,
        status: true,
        analytics: {
          where: { date: { gte: startDate } },
        },
      },
    });

    return bundles.map((bundle) => {
      const totals = bundle.analytics.reduce(
        (acc, a) => ({
          impressions: acc.impressions + a.impressions,
          clicks: acc.clicks + a.clicks,
          addToCarts: acc.addToCarts + a.addToCarts,
          orders: acc.orders + a.orders,
          revenue: acc.revenue + Number(a.revenue),
        }),
        { impressions: 0, clicks: 0, addToCarts: 0, orders: 0, revenue: 0 }
      );

      const conversionRate =
        totals.impressions > 0
          ? Math.round((totals.orders / totals.impressions) * 10000) / 100
          : 0;

      return {
        id: bundle.id,
        name: bundle.name,
        title: bundle.title,
        type: bundle.type,
        status: bundle.status,
        ...totals,
        conversionRate,
      };
    });
  }
}

let billingServiceInstance: BillingService | null = null;

export function getBillingService(): BillingService {
  if (!billingServiceInstance) {
    billingServiceInstance = new BillingService();
  }
  return billingServiceInstance;
}

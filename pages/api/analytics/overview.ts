/**
 * Analytics Overview API
 *
 * GET /api/analytics/overview - Dashboard overview metrics
 * Query params:
 *   - days: number of days to look back (default: 30)
 */

import { withShopAuth, sendSuccess, sendError } from '@/lib/middleware/with-shop-auth';
import { getBillingService } from '@/lib/services/billing.service';

export default withShopAuth(
  async (ctx) => {
    if (ctx.req.method !== 'GET') {
      return sendError(ctx.res, 'Method not allowed', 405);
    }

    const days = parseInt(ctx.req.query.days as string) || 30;
    const billing = getBillingService();

    const [overview, usage, bundlePerformance] = await Promise.all([
      billing.getAnalyticsOverview(ctx.shop, days),
      billing.getUsage(ctx.shop),
      billing.getBundlePerformance(ctx.shop, days),
    ]);

    return sendSuccess(ctx.res, {
      overview,
      usage,
      bundles: bundlePerformance,
      period: { days, startDate: new Date(Date.now() - days * 86400000) },
    });
  },
  { methods: ['GET'] }
);

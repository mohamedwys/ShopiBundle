/**
 * Billing Usage API
 *
 * GET /api/billing/usage - Get current month's revenue usage and plan limits
 */

import { withShopAuth, sendSuccess, sendError } from '@/lib/middleware/with-shop-auth';
import { getBillingService } from '@/lib/services/billing.service';

export default withShopAuth(
  async (ctx) => {
    if (ctx.req.method !== 'GET') {
      return sendError(ctx.res, 'Method not allowed', 405);
    }

    const billing = getBillingService();
    const usage = await billing.getUsage(ctx.shop);

    return sendSuccess(ctx.res, usage);
  },
  { methods: ['GET'] }
);

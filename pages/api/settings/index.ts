/**
 * Shop Settings API
 *
 * GET  /api/settings - Get shop settings
 * PATCH /api/settings - Update shop settings
 */

import { withShopAuth, sendSuccess, sendError } from '@/lib/middleware/with-shop-auth';
import { getBillingService } from '@/lib/services/billing.service';
import prisma from '@/utils/prisma';

export default withShopAuth(async (ctx) => {
  const billing = getBillingService();

  if (ctx.req.method === 'GET') {
    const settings = await billing.getOrCreateSettings(ctx.shop);
    return sendSuccess(ctx.res, settings);
  }

  if (ctx.req.method === 'PATCH') {
    const body = ctx.req.body;

    // Only allow updating specific fields
    const allowedFields = [
      'widgetEnabled',
      'defaultPrimaryColor',
      'defaultAccentColor',
      'emailAlerts',
      'weeklyDigest',
      'lowStockAlerts',
      'alertEmail',
    ];

    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return sendError(ctx.res, 'No valid fields to update', 400);
    }

    const settings = await prisma.shopSettings.upsert({
      where: { shop: ctx.shop },
      create: { shop: ctx.shop, ...updateData },
      update: updateData,
    });

    return sendSuccess(ctx.res, settings);
  }

  return sendError(ctx.res, 'Method not allowed', 405);
});

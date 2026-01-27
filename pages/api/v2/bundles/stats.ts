/**
 * V2 Bundle Stats API
 *
 * GET /api/v2/bundles/stats - Get bundle counts by status
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  withShopAuth,
  ApiContext,
  sendSuccess,
  sendError,
} from '@/lib/middleware/with-shop-auth';
import { getBundleService } from '@/lib/services/bundle.service';
import { isFeatureEnabled } from '@/config/feature-flags';

async function handler(ctx: ApiContext): Promise<void> {
  const { shop, req, res } = ctx;
  const bundleService = getBundleService();

  if (!isFeatureEnabled('V2_API_ROUTES')) {
    return sendError(res, 'V2 API is not yet enabled', 503);
  }

  if (req.method === 'GET') {
    const counts = await bundleService.getBundleCounts(shop);
    return sendSuccess(res, { counts });
  }

  return sendError(res, 'Method not allowed', 405);
}

export default withShopAuth(handler, {
  methods: ['GET'],
});

export const config = {
  api: {
    externalResolver: true,
  },
};

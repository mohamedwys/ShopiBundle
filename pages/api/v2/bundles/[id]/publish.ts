/**
 * V2 Bundle Publish/Unpublish API
 *
 * POST /api/v2/bundles/[id]/publish - Publish bundle (set to ACTIVE)
 * DELETE /api/v2/bundles/[id]/publish - Unpublish bundle (set to PAUSED)
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
  const bundleId = req.query.id as string;
  const bundleService = getBundleService();

  if (!bundleId) {
    return sendError(res, 'Bundle ID is required', 400);
  }

  if (!isFeatureEnabled('V2_API_ROUTES')) {
    return sendError(res, 'V2 API is not yet enabled', 503);
  }

  if (req.method === 'POST') {
    // Publish bundle
    try {
      const bundle = await bundleService.publishBundle(bundleId, shop);
      return sendSuccess(res, { bundle });
    } catch (err: any) {
      const message = err?.message || 'Failed to publish bundle';
      console.error(`Publish failed for bundle ${bundleId}:`, message);
      return sendError(res, message, 422);
    }
  }

  if (req.method === 'DELETE') {
    // Unpublish bundle
    const bundle = await bundleService.unpublishBundle(bundleId, shop);
    return sendSuccess(res, { bundle });
  }

  return sendError(res, 'Method not allowed', 405);
}

export default withShopAuth(handler, {
  methods: ['POST', 'DELETE'],
});

export const config = {
  api: {
    externalResolver: true,
  },
};

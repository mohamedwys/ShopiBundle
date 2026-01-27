/**
 * V2 Bundle API - Single Bundle Operations
 *
 * GET    /api/v2/bundles/[id] - Get bundle by ID
 * PUT    /api/v2/bundles/[id] - Update bundle
 * DELETE /api/v2/bundles/[id] - Delete bundle
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  withShopAuth,
  ApiContext,
  parseBody,
  sendSuccess,
  sendError,
} from '@/lib/middleware/with-shop-auth';
import { getBundleService, UpdateBundleInput } from '@/lib/services/bundle.service';
import { isFeatureEnabled } from '@/config/feature-flags';

interface UpdateBundleRequestBody {
  name?: string;
  title?: string;
  description?: string;
  discountPercent?: number;
  tags?: string[];
  featuredImage?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
}

async function handler(ctx: ApiContext): Promise<void> {
  const { shop, req, res } = ctx;
  const bundleId = req.query.id as string;
  const bundleService = getBundleService();

  if (!bundleId) {
    return sendError(res, 'Bundle ID is required', 400);
  }

  // Check if V2 API is enabled
  if (!isFeatureEnabled('V2_API_ROUTES')) {
    return sendError(res, 'V2 API is not yet enabled', 503);
  }

  if (req.method === 'GET') {
    // Get single bundle
    const bundle = await bundleService.getBundle(bundleId, shop);

    if (!bundle) {
      return sendError(res, 'Bundle not found', 404);
    }

    return sendSuccess(res, { bundle });
  }

  if (req.method === 'PUT') {
    // Update bundle
    const body = parseBody<UpdateBundleRequestBody>(req);

    const input: UpdateBundleInput = {};

    if (body.name !== undefined) input.name = body.name.trim();
    if (body.title !== undefined) input.title = body.title.trim();
    if (body.description !== undefined) input.description = body.description?.trim();
    if (body.discountPercent !== undefined) {
      if (body.discountPercent < 0 || body.discountPercent > 100) {
        return sendError(res, 'Discount percent must be between 0 and 100');
      }
      input.discountPercent = body.discountPercent;
    }
    if (body.tags !== undefined) input.tags = body.tags;
    if (body.featuredImage !== undefined) input.featuredImage = body.featuredImage;
    if (body.status !== undefined) {
      if (!['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED'].includes(body.status)) {
        return sendError(res, 'Invalid status value');
      }
      input.status = body.status;
    }

    const bundle = await bundleService.updateBundle(bundleId, shop, input);

    return sendSuccess(res, { bundle });
  }

  if (req.method === 'DELETE') {
    // Delete bundle
    await bundleService.deleteBundle(bundleId, shop);

    return sendSuccess(res, { deleted: true });
  }

  return sendError(res, 'Method not allowed', 405);
}

export default withShopAuth(handler, {
  methods: ['GET', 'PUT', 'DELETE'],
});

export const config = {
  api: {
    externalResolver: true,
  },
};

/**
 * V2 Bundles API - List and Create
 *
 * GET  /api/v2/bundles - List bundles with pagination
 * POST /api/v2/bundles - Create a new bundle
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  withShopAuth,
  ApiContext,
  parseBody,
  sendSuccess,
  sendError,
} from '@/lib/middleware/with-shop-auth';
import { getBundleService, CreateBundleInput, ListBundlesParams } from '@/lib/services/bundle.service';
import { isFeatureEnabled } from '@/config/feature-flags';

interface CreateBundleRequestBody {
  name: string;
  title: string;
  description?: string;
  components: Array<{
    shopifyProductId: string;
    shopifyVariantId?: string;
    quantity?: number;
  }>;
  discountPercent: number;
  tags?: string[];
  featuredImage?: string;
}

interface ListBundlesQuery {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

async function handler(ctx: ApiContext): Promise<void> {
  const { shop, req, res } = ctx;
  const bundleService = getBundleService();

  // Check if V2 API is enabled
  if (!isFeatureEnabled('V2_API_ROUTES')) {
    // Fall back gracefully - V2 API not yet enabled
    return sendError(res, 'V2 API is not yet enabled', 503);
  }

  if (req.method === 'GET') {
    // List bundles
    const query = req.query as ListBundlesQuery;

    const params: ListBundlesParams = {
      shop,
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? Math.min(parseInt(query.limit, 10), 100) : 20,
      status: query.status,
      search: query.search,
      sortBy: (query.sortBy as 'createdAt' | 'updatedAt' | 'name') || 'createdAt',
      sortOrder: (query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await bundleService.listBundles(params);

    return sendSuccess(res, result);
  }

  if (req.method === 'POST') {
    // Create bundle
    const body = parseBody<CreateBundleRequestBody>(req);

    // Validate required fields
    if (!body.name?.trim()) {
      return sendError(res, 'Bundle name is required');
    }
    if (!body.title?.trim()) {
      return sendError(res, 'Bundle title is required');
    }
    if (!body.components || body.components.length < 2) {
      return sendError(res, 'At least 2 components are required');
    }
    if (body.discountPercent === undefined || body.discountPercent < 0 || body.discountPercent > 100) {
      return sendError(res, 'Discount percent must be between 0 and 100');
    }

    const input: CreateBundleInput = {
      shop,
      name: body.name.trim(),
      title: body.title.trim(),
      description: body.description?.trim(),
      components: body.components.map((c) => ({
        shopifyProductId: c.shopifyProductId,
        shopifyVariantId: c.shopifyVariantId,
        quantity: c.quantity || 1,
      })),
      discountPercent: body.discountPercent,
      tags: body.tags,
      featuredImage: body.featuredImage,
    };

    const bundle = await bundleService.createBundle(input);

    return sendSuccess(res, { bundle }, 201);
  }

  return sendError(res, 'Method not allowed', 405);
}

export default withShopAuth(handler, {
  methods: ['GET', 'POST'],
});

export const config = {
  api: {
    externalResolver: true,
  },
};

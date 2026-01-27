/**
 * V2 Bundle Components API
 *
 * POST   /api/v2/bundles/[id]/components - Add components
 * PUT    /api/v2/bundles/[id]/components - Update component quantities
 * DELETE /api/v2/bundles/[id]/components - Remove a component
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  withShopAuth,
  ApiContext,
  parseBody,
  sendSuccess,
  sendError,
} from '@/lib/middleware/with-shop-auth';
import { getBundleService, CreateComponentInput } from '@/lib/services/bundle.service';
import { isFeatureEnabled } from '@/config/feature-flags';

interface AddComponentsBody {
  components: Array<{
    shopifyProductId: string;
    shopifyVariantId?: string;
    quantity?: number;
  }>;
}

interface UpdateQuantitiesBody {
  updates: Array<{
    componentId: string;
    quantity: number;
  }>;
}

interface RemoveComponentBody {
  componentId: string;
}

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
    // Add components
    const body = parseBody<AddComponentsBody>(req);

    if (!body.components || body.components.length === 0) {
      return sendError(res, 'At least one component is required');
    }

    const components: CreateComponentInput[] = body.components.map((c) => ({
      shopifyProductId: c.shopifyProductId,
      shopifyVariantId: c.shopifyVariantId,
      quantity: c.quantity || 1,
    }));

    const bundle = await bundleService.addComponents(bundleId, shop, components);
    return sendSuccess(res, { bundle });
  }

  if (req.method === 'PUT') {
    // Update quantities
    const body = parseBody<UpdateQuantitiesBody>(req);

    if (!body.updates || body.updates.length === 0) {
      return sendError(res, 'At least one update is required');
    }

    // Validate quantities
    for (const update of body.updates) {
      if (!update.componentId) {
        return sendError(res, 'Component ID is required for each update');
      }
      if (typeof update.quantity !== 'number' || update.quantity < 1) {
        return sendError(res, 'Quantity must be a positive number');
      }
    }

    const bundle = await bundleService.updateComponentQuantities(bundleId, shop, body.updates);
    return sendSuccess(res, { bundle });
  }

  if (req.method === 'DELETE') {
    // Remove component
    const body = parseBody<RemoveComponentBody>(req);

    if (!body.componentId) {
      return sendError(res, 'Component ID is required');
    }

    const bundle = await bundleService.removeComponent(bundleId, body.componentId, shop);
    return sendSuccess(res, { bundle });
  }

  return sendError(res, 'Method not allowed', 405);
}

export default withShopAuth(handler, {
  methods: ['POST', 'PUT', 'DELETE'],
});

export const config = {
  api: {
    externalResolver: true,
  },
};

/**
 * Storefront Bundle API
 *
 * Public API endpoint for retrieving bundle data on the storefront.
 * This endpoint is meant to be accessed via Shopify App Proxy.
 *
 * Routes:
 * - GET /api/storefront/bundles - List active bundles
 * - GET /api/storefront/bundles?id={id} - Get single bundle
 * - GET /api/storefront/bundles?product_id={id} - Get bundles containing a product
 */

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { PricingService } from '@/lib/services/pricing.service';
import { getInventoryService } from '@/lib/services/inventory.service';
import { isFeatureEnabled } from '@/config/feature-flags';
import { logger } from '@/lib/monitoring/logger';

// Types for storefront response
interface StorefrontBundle {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  discount: number;
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  savingsPercentage: number;
  products: StorefrontProduct[];
  inventory: {
    available: number;
    isLowStock: boolean;
    isOutOfStock: boolean;
  };
  metadata: {
    featuredImage: string | null;
    tags: string[];
  };
}

interface StorefrontProduct {
  productId: string;
  variantId: string | null;
  title: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  quantity: number;
  available: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers for app proxy
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get shop from query or header (app proxy passes shop)
    const shop = (req.query.shop as string) || (req.headers['x-shopify-shop-domain'] as string);

    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter required' });
    }

    const { id, product_id, slug, limit, page } = req.query;

    // Get single bundle by ID or slug
    if (id || slug) {
      const bundle = await getSingleBundle(shop, (id || slug) as string);
      if (!bundle) {
        return res.status(404).json({ error: 'Bundle not found' });
      }
      return res.status(200).json({ success: true, data: bundle });
    }

    // Get bundles containing a specific product
    if (product_id) {
      const bundles = await getBundlesForProduct(shop, product_id as string);
      return res.status(200).json({ success: true, data: bundles });
    }

    // List all active bundles
    const bundles = await listActiveBundles(
      shop,
      parseInt(limit as string) || 20,
      parseInt(page as string) || 1
    );

    return res.status(200).json({
      success: true,
      data: bundles.data,
      pagination: bundles.pagination,
    });

  } catch (error) {
    logger.error('Storefront bundles API error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch bundles',
    });
  }
}

/**
 * Get a single bundle by ID or slug
 */
async function getSingleBundle(shop: string, identifier: string): Promise<StorefrontBundle | null> {
  const bundle = await prisma.bundle.findFirst({
    where: {
      shop,
      status: 'ACTIVE',
      OR: [
        { id: identifier },
        { slug: identifier },
      ],
    },
    include: {
      components: {
        orderBy: { displayOrder: 'asc' },
      },
      pricingRules: {
        where: { isActive: true },
      },
      inventoryRecord: true,
    },
  });

  if (!bundle) {
    return null;
  }

  return transformBundleForStorefront(bundle);
}

/**
 * Get bundles containing a specific product
 */
async function getBundlesForProduct(shop: string, productId: string): Promise<StorefrontBundle[]> {
  // Normalize product ID (handle gid:// format)
  const normalizedId = productId.includes('gid://')
    ? productId
    : `gid://shopify/Product/${productId}`;

  const bundles = await prisma.bundle.findMany({
    where: {
      shop,
      status: 'ACTIVE',
      components: {
        some: {
          shopifyProductId: normalizedId,
        },
      },
    },
    include: {
      components: {
        orderBy: { displayOrder: 'asc' },
      },
      pricingRules: {
        where: { isActive: true },
      },
      inventoryRecord: true,
    },
    take: 5, // Limit to 5 bundles per product
  });

  return Promise.all(bundles.map(b => transformBundleForStorefront(b)));
}

/**
 * List all active bundles for a shop
 */
async function listActiveBundles(
  shop: string,
  limit: number,
  page: number
): Promise<{ data: StorefrontBundle[]; pagination: any }> {
  const skip = (page - 1) * limit;

  const [bundles, total] = await Promise.all([
    prisma.bundle.findMany({
      where: {
        shop,
        status: 'ACTIVE',
      },
      include: {
        components: {
          orderBy: { displayOrder: 'asc' },
        },
        pricingRules: {
          where: { isActive: true },
        },
        inventoryRecord: true,
      },
      orderBy: { displayOrder: 'asc' },
      skip,
      take: limit,
    }),
    prisma.bundle.count({
      where: {
        shop,
        status: 'ACTIVE',
      },
    }),
  ]);

  const transformedBundles = await Promise.all(
    bundles.map(b => transformBundleForStorefront(b))
  );

  return {
    data: transformedBundles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}

/**
 * Transform database bundle to storefront format
 */
async function transformBundleForStorefront(bundle: any): Promise<StorefrontBundle> {
  const pricingService = new PricingService();
  const inventoryService = getInventoryService();

  // Calculate pricing
  const discountPercent = bundle.pricingRules[0]?.discountValue
    ? Number(bundle.pricingRules[0].discountValue)
    : 0;

  const pricing = pricingService.calculateFixedBundlePrice(
    bundle.components,
    discountPercent
  );

  // Get inventory status
  let inventory = {
    available: 999999,
    isLowStock: false,
    isOutOfStock: false,
  };

  if (isFeatureEnabled('INVENTORY_SYNC')) {
    try {
      const invResult = await inventoryService.calculateBundleInventory(bundle.id);
      inventory = {
        available: invResult.availableQuantity,
        isLowStock: invResult.isLowStock,
        isOutOfStock: invResult.isOutOfStock,
      };
    } catch (e) {
      // Use default inventory if calculation fails
    }
  }

  // Transform products
  const products: StorefrontProduct[] = bundle.components.map((comp: any) => ({
    productId: comp.shopifyProductId,
    variantId: comp.shopifyVariantId,
    title: comp.cachedTitle || 'Product',
    price: comp.cachedPrice ? Number(comp.cachedPrice) : 0,
    compareAtPrice: comp.cachedCompareAtPrice ? Number(comp.cachedCompareAtPrice) : null,
    imageUrl: comp.cachedImageUrl,
    quantity: comp.quantity,
    available: (comp.cachedInventory || 0) > 0,
  }));

  return {
    id: bundle.id,
    slug: bundle.slug,
    title: bundle.title,
    description: bundle.description,
    discount: discountPercent,
    originalPrice: pricing.originalPrice,
    bundlePrice: pricing.discountedPrice,
    savings: pricing.savings,
    savingsPercentage: pricing.savingsPercentage,
    products,
    inventory,
    metadata: {
      featuredImage: bundle.featuredImage,
      tags: bundle.tags,
    },
  };
}

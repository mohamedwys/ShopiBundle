/**
 * Storefront Cart Integration API
 *
 * Handles bundle validation and cart operations:
 * - Validate bundle availability before checkout
 * - Reserve inventory for bundle items
 * - Get bundle information from cart items
 * - Apply bundle discounts at checkout
 */

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { getInventoryService } from '@/lib/services/inventory.service';
import { PricingService } from '@/lib/services/pricing.service';
import { isFeatureEnabled } from '@/config/feature-flags';
import { logger } from '@/lib/monitoring/logger';

// Types
interface CartItem {
  variantId: string | number;
  quantity: number;
  properties?: Record<string, string>;
}

interface BundleValidationResult {
  bundleId: string;
  bundleName: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  availability: number;
}

interface CartValidationResponse {
  valid: boolean;
  bundles: BundleValidationResult[];
  errors: string[];
  warnings: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers for app proxy
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const shop = (req.query.shop as string) || (req.headers['x-shopify-shop-domain'] as string);

  if (!shop) {
    return res.status(400).json({ error: 'Shop parameter required' });
  }

  try {
    switch (req.method) {
      case 'POST':
        // Validate cart items for bundle availability
        if (req.query.action === 'validate') {
          return await validateCart(req, res, shop);
        }
        // Reserve inventory for checkout
        if (req.query.action === 'reserve') {
          return await reserveInventory(req, res, shop);
        }
        // Release reserved inventory
        if (req.query.action === 'release') {
          return await releaseInventory(req, res, shop);
        }
        break;

      case 'GET':
        // Get bundle info for cart items
        return await getBundleInfo(req, res, shop);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    logger.error('Storefront cart API error', {
      shop,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return res.status(500).json({
      success: false,
      error: 'Cart operation failed',
    });
  }
}

/**
 * Validate cart items for bundle availability
 */
async function validateCart(
  req: NextApiRequest,
  res: NextApiResponse,
  shop: string
): Promise<void> {
  const { items } = req.body as { items: CartItem[] };

  if (!items || !Array.isArray(items)) {
    res.status(400).json({ error: 'Items array required' });
    return;
  }

  // Group items by bundle
  const bundleGroups = groupItemsByBundle(items);

  if (bundleGroups.size === 0) {
    res.status(200).json({
      success: true,
      data: {
        valid: true,
        bundles: [],
        errors: [],
        warnings: [],
      } as CartValidationResponse,
    });
    return;
  }

  const inventoryService = getInventoryService();
  const results: BundleValidationResult[] = [];
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Validate each bundle
  for (const [bundleId, bundleItems] of bundleGroups) {
    const result = await validateBundleInCart(
      shop,
      bundleId,
      bundleItems,
      inventoryService
    );

    results.push(result);

    if (!result.isValid) {
      allErrors.push(...result.errors);
    }
    allWarnings.push(...result.warnings);
  }

  res.status(200).json({
    success: true,
    data: {
      valid: allErrors.length === 0,
      bundles: results,
      errors: allErrors,
      warnings: allWarnings,
    } as CartValidationResponse,
  });
}

/**
 * Group cart items by their bundle ID property
 */
function groupItemsByBundle(items: CartItem[]): Map<string, CartItem[]> {
  const groups = new Map<string, CartItem[]>();

  for (const item of items) {
    const bundleId = item.properties?._bundle_id;
    if (bundleId) {
      if (!groups.has(bundleId)) {
        groups.set(bundleId, []);
      }
      groups.get(bundleId)!.push(item);
    }
  }

  return groups;
}

/**
 * Validate a specific bundle in the cart
 */
async function validateBundleInCart(
  shop: string,
  bundleIdentifier: string,
  cartItems: CartItem[],
  inventoryService: any
): Promise<BundleValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Find the bundle
  const bundle = await prisma.bundle.findFirst({
    where: {
      shop,
      OR: [
        { id: bundleIdentifier },
        { slug: bundleIdentifier },
        { name: bundleIdentifier },
      ],
    },
    include: {
      components: true,
      inventoryRecord: true,
    },
  });

  if (!bundle) {
    return {
      bundleId: bundleIdentifier,
      bundleName: bundleIdentifier,
      isValid: false,
      errors: ['Bundle not found or no longer available'],
      warnings: [],
      availability: 0,
    };
  }

  if (bundle.status !== 'ACTIVE') {
    return {
      bundleId: bundle.id,
      bundleName: bundle.name,
      isValid: false,
      errors: ['This bundle is no longer available'],
      warnings: [],
      availability: 0,
    };
  }

  // Calculate bundle quantity from cart items
  // All items in a bundle should have the same quantity
  const bundleQuantity = cartItems[0]?.quantity || 1;

  // Check inventory if enabled
  let availability = 999999;

  if (isFeatureEnabled('INVENTORY_SYNC')) {
    try {
      const invResult = await inventoryService.calculateBundleInventory(bundle.id);
      availability = invResult.availableQuantity;

      if (invResult.isOutOfStock) {
        errors.push(`${bundle.title} is out of stock`);
      } else if (bundleQuantity > availability) {
        errors.push(`Only ${availability} bundles of ${bundle.title} available`);
      } else if (invResult.isLowStock) {
        warnings.push(`${bundle.title} has limited stock (${availability} remaining)`);
      }
    } catch (e) {
      // Continue without inventory check if it fails
      logger.warn('Inventory check failed during cart validation', { bundleId: bundle.id });
    }
  }

  // Verify all bundle components are present in cart
  const cartVariantIds = new Set(cartItems.map(i => String(i.variantId)));
  const missingComponents: string[] = [];

  for (const component of bundle.components) {
    if (!component.isRequired) continue;

    const componentVariantId = component.shopifyVariantId;
    if (componentVariantId && !cartVariantIds.has(componentVariantId)) {
      missingComponents.push(component.cachedTitle || component.shopifyProductId);
    }
  }

  if (missingComponents.length > 0) {
    warnings.push(`Bundle may be incomplete. Missing: ${missingComponents.join(', ')}`);
  }

  return {
    bundleId: bundle.id,
    bundleName: bundle.name,
    isValid: errors.length === 0,
    errors,
    warnings,
    availability,
  };
}

/**
 * Reserve inventory for checkout
 */
async function reserveInventory(
  req: NextApiRequest,
  res: NextApiResponse,
  shop: string
): Promise<void> {
  const { bundleId, quantity, reservationId } = req.body;

  if (!bundleId || !quantity || !reservationId) {
    res.status(400).json({ error: 'bundleId, quantity, and reservationId required' });
    return;
  }

  const inventoryService = getInventoryService();

  const result = await inventoryService.reserveInventory(
    bundleId,
    quantity,
    reservationId
  );

  res.status(result.success ? 200 : 400).json({
    success: result.success,
    error: result.error,
  });
}

/**
 * Release reserved inventory
 */
async function releaseInventory(
  req: NextApiRequest,
  res: NextApiResponse,
  shop: string
): Promise<void> {
  const { bundleId, quantity, reservationId } = req.body;

  if (!bundleId || !quantity || !reservationId) {
    res.status(400).json({ error: 'bundleId, quantity, and reservationId required' });
    return;
  }

  const inventoryService = getInventoryService();

  await inventoryService.releaseReservation(bundleId, quantity, reservationId);

  res.status(200).json({ success: true });
}

/**
 * Get bundle information for cart items
 */
async function getBundleInfo(
  req: NextApiRequest,
  res: NextApiResponse,
  shop: string
): Promise<void> {
  const bundleIds = (req.query.bundle_ids as string)?.split(',') || [];

  if (bundleIds.length === 0) {
    res.status(200).json({ success: true, data: [] });
    return;
  }

  const pricingService = new PricingService();

  const bundles = await prisma.bundle.findMany({
    where: {
      shop,
      status: 'ACTIVE',
      OR: bundleIds.flatMap(id => [
        { id },
        { slug: id },
        { name: id },
      ]),
    },
    include: {
      components: {
        orderBy: { displayOrder: 'asc' },
      },
      pricingRules: {
        where: { isActive: true },
      },
    },
  });

  const bundleInfo = bundles.map(bundle => {
    const discountPercent = bundle.pricingRules[0]?.discountValue
      ? Number(bundle.pricingRules[0].discountValue)
      : 0;

    const pricing = pricingService.calculateFixedBundlePrice(
      bundle.components,
      discountPercent
    );

    return {
      id: bundle.id,
      slug: bundle.slug,
      name: bundle.name,
      title: bundle.title,
      discount: discountPercent,
      originalPrice: pricing.originalPrice,
      bundlePrice: pricing.discountedPrice,
      savings: pricing.savings,
      productCount: bundle.components.length,
    };
  });

  res.status(200).json({
    success: true,
    data: bundleInfo,
  });
}

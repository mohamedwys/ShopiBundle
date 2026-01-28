/**
 * Orders Create Webhook Handler
 *
 * Triggered when a new order is created in Shopify.
 * Detects bundle purchases and handles:
 * - Inventory deduction for bundle components
 * - Analytics tracking for bundle sales
 * - Order event logging
 */

import { getInventoryService } from '@/lib/services/inventory.service';
import { isFeatureEnabled } from '@/config/feature-flags';
import prisma from '@/utils/prisma';
import { logger } from '@/lib/monitoring/logger';

// Shopify Order Webhook Payload Types
interface OrderLineItem {
  id: number;
  variant_id: number | null;
  product_id: number | null;
  quantity: number;
  price: string;
  properties: Array<{ name: string; value: string }>;
  sku: string | null;
  title: string;
  total_discount: string;
}

interface OrderPayload {
  id: number;
  order_number: number;
  name: string;
  email: string;
  customer: {
    id: number;
    email: string;
  } | null;
  line_items: OrderLineItem[];
  total_price: string;
  subtotal_price: string;
  total_discounts: string;
  currency: string;
  financial_status: string;
  fulfillment_status: string | null;
  created_at: string;
  processed_at: string;
}

interface BundleLineItemGroup {
  bundleId: string;
  bundleName: string;
  lineItems: OrderLineItem[];
  quantity: number;
  discount: string;
}

export default async function ordersCreateHandler(
  topic: string,
  shop: string,
  body: string,
  webhookId: string
): Promise<void> {
  try {
    const payload: OrderPayload = JSON.parse(body);

    logger.info('Processing order create webhook', {
      shop,
      orderId: payload.id,
      orderNumber: payload.order_number,
      lineItemCount: payload.line_items.length,
    });

    // Identify bundle items from line item properties
    const bundleGroups = identifyBundleItems(payload.line_items);

    if (bundleGroups.length === 0) {
      logger.debug('No bundle items found in order', {
        shop,
        orderId: payload.id
      });
      return;
    }

    logger.info('Bundle items detected in order', {
      shop,
      orderId: payload.id,
      bundleCount: bundleGroups.length,
      bundles: bundleGroups.map(b => ({ id: b.bundleId, name: b.bundleName })),
    });

    // Process each bundle group
    for (const bundleGroup of bundleGroups) {
      await processBundleSale(shop, payload, bundleGroup);
    }

    // Update inventory if feature is enabled
    if (isFeatureEnabled('INVENTORY_SYNC')) {
      await updateBundleInventory(shop, bundleGroups);
    }

    logger.info('Order webhook processing completed', {
      shop,
      orderId: payload.id,
      processedBundles: bundleGroups.length,
    });

  } catch (error) {
    logger.error('Error processing orders create webhook', {
      shop,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Don't throw - webhook handlers should not fail the response
  }
}

/**
 * Identify bundle items from order line items
 * Bundles are identified by the _bundle_id property
 */
function identifyBundleItems(lineItems: OrderLineItem[]): BundleLineItemGroup[] {
  const bundleMap = new Map<string, BundleLineItemGroup>();

  for (const item of lineItems) {
    // Check for bundle properties
    const bundleIdProp = item.properties?.find(p => p.name === '_bundle_id');
    const bundleDiscountProp = item.properties?.find(p => p.name === '_bundle_discount');

    if (bundleIdProp?.value) {
      const bundleId = bundleIdProp.value;

      if (!bundleMap.has(bundleId)) {
        bundleMap.set(bundleId, {
          bundleId,
          bundleName: bundleId, // Will be replaced with actual name if found
          lineItems: [],
          quantity: item.quantity, // All items in a bundle should have same quantity
          discount: bundleDiscountProp?.value || '0%',
        });
      }

      bundleMap.get(bundleId)!.lineItems.push(item);
    }
  }

  return Array.from(bundleMap.values());
}

/**
 * Process a bundle sale - record analytics and events
 */
async function processBundleSale(
  shop: string,
  order: OrderPayload,
  bundleGroup: BundleLineItemGroup
): Promise<void> {
  try {
    // Find the bundle in our database by slug or ID
    const bundle = await prisma.bundle.findFirst({
      where: {
        shop,
        OR: [
          { slug: bundleGroup.bundleId },
          { name: bundleGroup.bundleId },
          { id: bundleGroup.bundleId },
        ],
      },
    });

    if (!bundle) {
      logger.warn('Bundle not found for order item', {
        shop,
        bundleId: bundleGroup.bundleId,
        orderId: order.id,
      });
      return;
    }

    // Calculate bundle revenue from line items
    const bundleRevenue = bundleGroup.lineItems.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);

    const bundleDiscount = bundleGroup.lineItems.reduce((total, item) => {
      return total + parseFloat(item.total_discount || '0');
    }, 0);

    // Record bundle event
    await prisma.bundleEvent.create({
      data: {
        shop,
        bundleId: bundle.id,
        eventType: 'PURCHASE',
        orderId: String(order.id),
        customerId: order.customer ? String(order.customer.id) : null,
        quantity: bundleGroup.quantity,
        revenue: bundleRevenue,
        metadata: {
          orderNumber: order.order_number,
          orderName: order.name,
          lineItemCount: bundleGroup.lineItems.length,
          discount: bundleGroup.discount,
          currency: order.currency,
        },
        source: 'webhook',
      },
    });

    // Update daily analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.bundleAnalytics.upsert({
      where: {
        bundleId_date: {
          bundleId: bundle.id,
          date: today,
        },
      },
      create: {
        bundleId: bundle.id,
        date: today,
        orders: 1,
        unitsSold: bundleGroup.quantity,
        revenue: bundleRevenue,
        discountAmount: bundleDiscount,
        averageOrderValue: bundleRevenue,
      },
      update: {
        orders: { increment: 1 },
        unitsSold: { increment: bundleGroup.quantity },
        revenue: { increment: bundleRevenue },
        discountAmount: { increment: bundleDiscount },
        // Recalculate AOV in a separate query if needed
      },
    });

    logger.info('Bundle sale recorded', {
      shop,
      bundleId: bundle.id,
      orderId: order.id,
      quantity: bundleGroup.quantity,
      revenue: bundleRevenue,
    });

  } catch (error) {
    logger.error('Error recording bundle sale', {
      shop,
      bundleId: bundleGroup.bundleId,
      orderId: order.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Update inventory for bundles after sale
 * Marks bundle inventory as stale to trigger recalculation
 */
async function updateBundleInventory(
  shop: string,
  bundleGroups: BundleLineItemGroup[]
): Promise<void> {
  try {
    // Get all unique bundle IDs
    const bundleIds = bundleGroups.map(g => g.bundleId);

    // Find bundles in database
    const bundles = await prisma.bundle.findMany({
      where: {
        shop,
        OR: bundleIds.flatMap(id => [
          { slug: id },
          { name: id },
          { id: id },
        ]),
      },
      select: { id: true },
    });

    if (bundles.length === 0) {
      return;
    }

    const dbBundleIds = bundles.map(b => b.id);

    // Mark inventory records as stale (need recalculation)
    // The actual inventory was already updated by Shopify's native inventory system
    // We just need to recalculate our cached bundle availability
    await prisma.bundleInventory.updateMany({
      where: {
        bundleId: { in: dbBundleIds },
      },
      data: {
        lastCalculatedAt: new Date(0), // Mark as stale
      },
    });

    // Log the sync
    for (const bundleId of dbBundleIds) {
      await prisma.inventorySyncLog.create({
        data: {
          shop,
          bundleId,
          syncType: 'ORDER_TRIGGERED',
          previousQuantity: 0, // Unknown without full recalc
          newQuantity: 0, // Will be recalculated on next access
          success: true,
        },
      });
    }

    logger.info('Bundle inventory marked for recalculation', {
      shop,
      bundleCount: dbBundleIds.length,
    });

  } catch (error) {
    logger.error('Error updating bundle inventory after order', {
      shop,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

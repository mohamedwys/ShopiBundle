/**
 * Inventory Levels Update Webhook Handler
 *
 * Triggered when inventory levels change in Shopify.
 * Updates cached inventory for affected bundle components.
 */

import { getInventoryService } from '@/lib/services/inventory.service';
import { isFeatureEnabled } from '@/config/feature-flags';
import prisma from '@/utils/prisma';
import { logger } from '@/lib/monitoring/logger';

interface InventoryLevelPayload {
  inventory_item_id: number;
  location_id: number;
  available: number;
  updated_at: string;
}

export default async function inventoryLevelsUpdateHandler(
  topic: string,
  shop: string,
  body: string,
  webhookId: string
): Promise<void> {
  // Check feature flag
  if (!isFeatureEnabled('INVENTORY_SYNC')) {
    logger.debug('Inventory sync feature disabled, skipping webhook', { shop });
    return;
  }

  try {
    const payload: InventoryLevelPayload = JSON.parse(body);

    logger.info('Processing inventory level update webhook', {
      shop,
      inventoryItemId: payload.inventory_item_id,
      available: payload.available,
    });

    // Get the session for API calls
    const sessions = await prisma.session.findMany({
      where: { shop },
    });

    if (sessions.length === 0) {
      logger.warn('No session found for shop', { shop });
      return;
    }

    // Parse session content to find one with access token
    let sessionWithToken = null;
    for (const s of sessions) {
      try {
        if (s.content) {
          const parsed = JSON.parse(s.content);
          if (parsed.accessToken) {
            sessionWithToken = parsed;
            break;
          }
        }
      } catch {
        continue;
      }
    }

    if (!sessionWithToken) {
      logger.warn('No valid session with access token found', { shop });
      return;
    }

    // Note: inventory_item_id is not the same as product/variant ID
    // We need to find which products use this inventory item
    // For now, we'll update any components that were synced with matching inventory

    // Find bundle components that might be affected
    // This is a simplified approach - in production you might want to track
    // inventory_item_id -> variant_id mapping
    const recentComponents = await prisma.bundleComponent.findMany({
      where: {
        bundle: {
          shop,
          status: 'ACTIVE',
        },
      },
      include: {
        bundle: true,
      },
    });

    if (recentComponents.length === 0) {
      logger.debug('No active bundle components found for shop', { shop });
      return;
    }

    // Get unique bundle IDs
    const bundleIds: string[] = Array.from(new Set(recentComponents.map(c => c.bundle.id)));

    logger.info('Inventory change may affect bundles', {
      shop,
      bundleCount: bundleIds.length,
    });

    // Trigger a full inventory sync for affected bundles
    // This ensures we get the correct inventory from Shopify
    const inventoryService = getInventoryService();

    // We can't do a full sync without a proper Session object
    // So we'll just mark the bundles as needing sync
    await prisma.bundleInventory.updateMany({
      where: {
        bundleId: { in: bundleIds },
      },
      data: {
        lastCalculatedAt: new Date(0), // Mark as stale
      },
    });

    logger.info('Marked bundles for inventory resync', {
      shop,
      bundleCount: bundleIds.length,
    });

  } catch (error) {
    logger.error('Error processing inventory levels update webhook', {
      shop,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Don't throw - webhook handlers should not fail the response
  }
}

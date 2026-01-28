/**
 * Inventory Service - Sprint 3
 *
 * Manages bundle inventory by tracking component stock levels
 * and calculating available bundle quantities.
 */

import prisma from '@/utils/prisma';
import shopify from '@/utils/shopify';
import { Session } from '@shopify/shopify-api';
import { logger } from '@/lib/monitoring/logger';
import { isFeatureEnabled } from '@/config/feature-flags';

// Types
export interface ComponentInventory {
  componentId: string;
  shopifyProductId: string;
  shopifyVariantId?: string;
  quantity: number;
  inventoryLevel: number;
  availableForBundle: number;
}

export interface BundleInventoryResult {
  bundleId: string;
  availableQuantity: number;
  componentInventories: ComponentInventory[];
  lastCalculatedAt: Date;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

export interface InventorySyncResult {
  success: boolean;
  bundleId: string;
  previousQuantity: number;
  newQuantity: number;
  error?: string;
}

// GraphQL query for inventory levels
const INVENTORY_QUERY = `
  query getInventoryLevels($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        inventoryQuantity
        inventoryItem {
          id
        }
      }
      ... on Product {
        id
        totalInventory
        variants(first: 1) {
          edges {
            node {
              id
              inventoryQuantity
            }
          }
        }
      }
    }
  }
`;

class InventoryService {
  private shopifySession: Session | null = null;

  /**
   * Set the Shopify session for API calls
   */
  setSession(session: Session): void {
    this.shopifySession = session;
  }

  /**
   * Calculate available bundle quantity based on component inventory
   */
  async calculateBundleInventory(bundleId: string): Promise<BundleInventoryResult> {
    const bundle = await prisma.bundle.findUnique({
      where: { id: bundleId },
      include: {
        components: true,
        inventoryRecord: true,
      },
    });

    if (!bundle) {
      throw new Error('Bundle not found');
    }

    // Check if tracking is enabled
    const trackingMethod = bundle.inventoryRecord?.trackingMethod || 'COMPONENT_BASED';

    if (trackingMethod === 'UNLIMITED') {
      return {
        bundleId,
        availableQuantity: 999999,
        componentInventories: [],
        lastCalculatedAt: new Date(),
        isLowStock: false,
        isOutOfStock: false,
      };
    }

    if (trackingMethod === 'BUNDLE_SPECIFIC') {
      const qty = bundle.inventoryRecord?.bundleQuantity || 0;
      const threshold = bundle.inventoryRecord?.lowStockThreshold || 10;
      return {
        bundleId,
        availableQuantity: qty,
        componentInventories: [],
        lastCalculatedAt: new Date(),
        isLowStock: qty <= threshold,
        isOutOfStock: qty <= 0,
      };
    }

    // COMPONENT_BASED: Calculate based on component inventory
    const componentInventories: ComponentInventory[] = [];
    let minAvailable = Infinity;

    for (const component of bundle.components) {
      const inventoryLevel = component.cachedInventory || 0;
      const requiredQty = component.quantity || 1;
      const availableForBundle = Math.floor(inventoryLevel / requiredQty);

      componentInventories.push({
        componentId: component.id,
        shopifyProductId: component.shopifyProductId,
        shopifyVariantId: component.shopifyVariantId || undefined,
        quantity: requiredQty,
        inventoryLevel,
        availableForBundle,
      });

      if (component.isRequired && availableForBundle < minAvailable) {
        minAvailable = availableForBundle;
      }
    }

    const availableQuantity = minAvailable === Infinity ? 0 : minAvailable;
    const threshold = bundle.inventoryRecord?.lowStockThreshold || 10;

    return {
      bundleId,
      availableQuantity,
      componentInventories,
      lastCalculatedAt: new Date(),
      isLowStock: availableQuantity <= threshold,
      isOutOfStock: availableQuantity <= 0,
    };
  }

  /**
   * Sync inventory from Shopify for a bundle's components
   */
  async syncBundleInventory(bundleId: string, session: Session): Promise<InventorySyncResult> {
    const startTime = Date.now();

    try {
      const bundle = await prisma.bundle.findUnique({
        where: { id: bundleId },
        include: {
          components: true,
          inventoryRecord: true,
        },
      });

      if (!bundle) {
        throw new Error('Bundle not found');
      }

      const previousQuantity = bundle.inventoryRecord?.availableQuantity || 0;

      // Get unique product/variant IDs
      const shopifyIds = bundle.components.map(c =>
        c.shopifyVariantId || c.shopifyProductId
      );

      if (shopifyIds.length === 0) {
        return {
          success: true,
          bundleId,
          previousQuantity,
          newQuantity: 0,
        };
      }

      // Fetch inventory from Shopify
      const client = new shopify.clients.Graphql({ session });
      const response = await client.query({
        data: {
          query: INVENTORY_QUERY,
          variables: { ids: shopifyIds },
        },
      });

      const nodes = (response.body as any)?.data?.nodes || [];
      const inventoryMap = new Map<string, number>();

      for (const node of nodes) {
        if (!node) continue;

        if (node.inventoryQuantity !== undefined) {
          // It's a variant
          inventoryMap.set(node.id, node.inventoryQuantity);
        } else if (node.totalInventory !== undefined) {
          // It's a product - use total or first variant
          inventoryMap.set(node.id, node.totalInventory);
          if (node.variants?.edges?.[0]?.node) {
            const variant = node.variants.edges[0].node;
            inventoryMap.set(variant.id, variant.inventoryQuantity);
          }
        }
      }

      // Update component cached inventory
      for (const component of bundle.components) {
        const lookupId = component.shopifyVariantId || component.shopifyProductId;
        const inventory = inventoryMap.get(lookupId) ?? 0;

        await prisma.bundleComponent.update({
          where: { id: component.id },
          data: {
            cachedInventory: inventory,
            lastSyncedAt: new Date(),
          },
        });
      }

      // Recalculate bundle availability
      const result = await this.calculateBundleInventory(bundleId);

      // Update or create inventory record
      await prisma.bundleInventory.upsert({
        where: { bundleId },
        create: {
          bundleId,
          trackingMethod: 'COMPONENT_BASED',
          availableQuantity: result.availableQuantity,
          lastCalculatedAt: new Date(),
        },
        update: {
          availableQuantity: result.availableQuantity,
          lastCalculatedAt: new Date(),
        },
      });

      // Log the sync
      await prisma.inventorySyncLog.create({
        data: {
          shop: bundle.shop,
          bundleId,
          syncType: 'FULL_SYNC',
          previousQuantity,
          newQuantity: result.availableQuantity,
          success: true,
        },
      });

      logger.info('Bundle inventory synced', {
        bundleId,
        previousQuantity,
        newQuantity: result.availableQuantity,
        duration: Date.now() - startTime,
      });

      return {
        success: true,
        bundleId,
        previousQuantity,
        newQuantity: result.availableQuantity,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      logger.error('Failed to sync bundle inventory', {
        bundleId,
        error: errorMessage,
      });

      // Log the failed sync
      await prisma.inventorySyncLog.create({
        data: {
          shop: 'unknown',
          bundleId,
          syncType: 'FULL_SYNC',
          previousQuantity: 0,
          newQuantity: 0,
          success: false,
          errorMessage,
        },
      }).catch(() => {}); // Ignore logging errors

      return {
        success: false,
        bundleId,
        previousQuantity: 0,
        newQuantity: 0,
        error: errorMessage,
      };
    }
  }

  /**
   * Handle inventory update for a specific product/variant
   * Called by webhooks when inventory changes
   */
  async handleInventoryUpdate(
    shop: string,
    productId: string,
    variantId: string | null,
    newInventory: number,
    session: Session
  ): Promise<void> {
    if (!isFeatureEnabled('INVENTORY_SYNC')) {
      return;
    }

    try {
      // Find all bundle components that use this product/variant
      const components = await prisma.bundleComponent.findMany({
        where: {
          OR: [
            { shopifyProductId: productId },
            { shopifyVariantId: variantId || undefined },
          ],
        },
        include: {
          bundle: {
            select: {
              id: true,
              shop: true,
              status: true,
            },
          },
        },
      });

      // Filter to shop's active bundles
      const affectedBundles = components
        .filter(c => c.bundle.shop === shop && c.bundle.status === 'ACTIVE')
        .map(c => c.bundle.id);

      // Deduplicate
      const uniqueBundleIds: string[] = Array.from(new Set(affectedBundles));

      logger.info('Inventory update affecting bundles', {
        shop,
        productId,
        variantId,
        newInventory,
        affectedBundles: uniqueBundleIds.length,
      });

      // Update cached inventory for affected components
      await prisma.bundleComponent.updateMany({
        where: {
          OR: [
            { shopifyProductId: productId },
            { shopifyVariantId: variantId || undefined },
          ],
        },
        data: {
          cachedInventory: newInventory,
          lastSyncedAt: new Date(),
        },
      });

      // Recalculate each affected bundle
      for (const bundleId of uniqueBundleIds) {
        await this.syncBundleInventory(bundleId, session);
      }
    } catch (error) {
      logger.error('Failed to handle inventory update', {
        shop,
        productId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Sync all bundles for a shop
   */
  async syncShopInventory(shop: string, session: Session): Promise<{
    total: number;
    synced: number;
    failed: number;
  }> {
    const bundles = await prisma.bundle.findMany({
      where: {
        shop,
        status: 'ACTIVE',
      },
      select: { id: true },
    });

    let synced = 0;
    let failed = 0;

    for (const bundle of bundles) {
      const result = await this.syncBundleInventory(bundle.id, session);
      if (result.success) {
        synced++;
      } else {
        failed++;
      }
    }

    logger.info('Shop inventory sync completed', {
      shop,
      total: bundles.length,
      synced,
      failed,
    });

    return {
      total: bundles.length,
      synced,
      failed,
    };
  }

  /**
   * Get inventory status for a bundle
   */
  async getInventoryStatus(bundleId: string): Promise<{
    available: number;
    isLowStock: boolean;
    isOutOfStock: boolean;
    lastSynced: Date | null;
    components: Array<{
      productId: string;
      inventory: number;
      required: number;
    }>;
  }> {
    const bundle = await prisma.bundle.findUnique({
      where: { id: bundleId },
      include: {
        components: true,
        inventoryRecord: true,
      },
    });

    if (!bundle) {
      throw new Error('Bundle not found');
    }

    const threshold = bundle.inventoryRecord?.lowStockThreshold || 10;
    const available = bundle.inventoryRecord?.availableQuantity || 0;

    return {
      available,
      isLowStock: available <= threshold && available > 0,
      isOutOfStock: available <= 0,
      lastSynced: bundle.inventoryRecord?.lastCalculatedAt || null,
      components: bundle.components.map(c => ({
        productId: c.shopifyProductId,
        inventory: c.cachedInventory || 0,
        required: c.quantity,
      })),
    };
  }

  /**
   * Set inventory tracking method for a bundle
   */
  async setTrackingMethod(
    bundleId: string,
    method: 'COMPONENT_BASED' | 'BUNDLE_SPECIFIC' | 'UNLIMITED',
    bundleQuantity?: number
  ): Promise<void> {
    await prisma.bundleInventory.upsert({
      where: { bundleId },
      create: {
        bundleId,
        trackingMethod: method,
        bundleQuantity: method === 'BUNDLE_SPECIFIC' ? bundleQuantity : null,
        availableQuantity: method === 'UNLIMITED' ? 999999 : 0,
      },
      update: {
        trackingMethod: method,
        bundleQuantity: method === 'BUNDLE_SPECIFIC' ? bundleQuantity : null,
        availableQuantity: method === 'UNLIMITED' ? 999999 : undefined,
      },
    });

    logger.info('Bundle tracking method updated', {
      bundleId,
      method,
      bundleQuantity,
    });
  }
}

// Singleton instance
let inventoryServiceInstance: InventoryService | null = null;

export function getInventoryService(): InventoryService {
  if (!inventoryServiceInstance) {
    inventoryServiceInstance = new InventoryService();
  }
  return inventoryServiceInstance;
}

export { InventoryService };

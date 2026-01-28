/**
 * Inventory Service - Sprint 3 (Phase 2 Enhanced)
 *
 * Manages bundle inventory by tracking component stock levels
 * and calculating available bundle quantities.
 *
 * Features:
 * - Component-based inventory tracking
 * - Multi-location inventory support
 * - Out-of-stock handling
 * - Real-time sync with Shopify
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
  locationInventory?: LocationInventory[];
}

export interface LocationInventory {
  locationId: string;
  locationName: string;
  available: number;
  incoming?: number;
  committed?: number;
}

export interface BundleInventoryResult {
  bundleId: string;
  availableQuantity: number;
  componentInventories: ComponentInventory[];
  lastCalculatedAt: Date;
  isLowStock: boolean;
  isOutOfStock: boolean;
  totalLocations?: number;
  locationBreakdown?: BundleLocationAvailability[];
}

export interface BundleLocationAvailability {
  locationId: string;
  locationName: string;
  availableQuantity: number;
  isAvailable: boolean;
}

export interface InventorySyncResult {
  success: boolean;
  bundleId: string;
  previousQuantity: number;
  newQuantity: number;
  error?: string;
  syncedLocations?: number;
}

export interface OutOfStockConfig {
  hideBundle: boolean;
  showWaitlist: boolean;
  allowBackorder: boolean;
  notifyOnRestock: boolean;
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

// GraphQL query for multi-location inventory levels
const MULTI_LOCATION_INVENTORY_QUERY = `
  query getMultiLocationInventory($variantIds: [ID!]!) {
    nodes(ids: $variantIds) {
      ... on ProductVariant {
        id
        sku
        inventoryQuantity
        inventoryItem {
          id
          tracked
          inventoryLevels(first: 50) {
            edges {
              node {
                id
                available
                incoming
                location {
                  id
                  name
                  isActive
                  fulfillsOnlineOrders
                }
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query to get all active locations
const LOCATIONS_QUERY = `
  query getLocations {
    locations(first: 50) {
      edges {
        node {
          id
          name
          isActive
          fulfillsOnlineOrders
          address {
            city
            country
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

  /**
   * Get multi-location inventory for a bundle
   * Returns availability broken down by location
   */
  async getMultiLocationInventory(
    bundleId: string,
    session: Session
  ): Promise<BundleInventoryResult> {
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

    // Get variant IDs for all components
    const variantIds = bundle.components
      .filter(c => c.shopifyVariantId)
      .map(c => c.shopifyVariantId as string);

    // If no specific variants, use product IDs
    const queryIds = variantIds.length > 0
      ? variantIds
      : bundle.components.map(c => c.shopifyProductId);

    if (queryIds.length === 0) {
      return {
        bundleId,
        availableQuantity: 0,
        componentInventories: [],
        lastCalculatedAt: new Date(),
        isLowStock: false,
        isOutOfStock: true,
        totalLocations: 0,
        locationBreakdown: [],
      };
    }

    try {
      const client = new shopify.clients.Graphql({ session });
      const response = await client.query({
        data: {
          query: MULTI_LOCATION_INVENTORY_QUERY,
          variables: { variantIds: queryIds },
        },
      });

      const nodes = (response.body as any)?.data?.nodes || [];

      // Build location-to-inventory map for each component
      const componentLocationInventory = new Map<string, Map<string, number>>();
      const locationNames = new Map<string, string>();
      const allLocationIds = new Set<string>();

      for (const node of nodes) {
        if (!node?.inventoryItem?.inventoryLevels?.edges) continue;

        const variantId = node.id;
        const locationMap = new Map<string, number>();

        for (const edge of node.inventoryItem.inventoryLevels.edges) {
          const level = edge.node;
          if (!level.location.isActive) continue;

          const locationId = level.location.id;
          locationMap.set(locationId, level.available);
          locationNames.set(locationId, level.location.name);
          allLocationIds.add(locationId);
        }

        componentLocationInventory.set(variantId, locationMap);
      }

      // Calculate bundle availability per location
      const locationBreakdown: BundleLocationAvailability[] = [];

      for (const locationId of allLocationIds) {
        let minAvailable = Infinity;

        for (const component of bundle.components) {
          if (!component.isRequired) continue;

          const variantId = component.shopifyVariantId || component.shopifyProductId;
          const locationMap = componentLocationInventory.get(variantId);
          const locationQty = locationMap?.get(locationId) || 0;
          const requiredQty = component.quantity || 1;
          const availableForBundle = Math.floor(locationQty / requiredQty);

          if (availableForBundle < minAvailable) {
            minAvailable = availableForBundle;
          }
        }

        const available = minAvailable === Infinity ? 0 : minAvailable;
        locationBreakdown.push({
          locationId,
          locationName: locationNames.get(locationId) || 'Unknown Location',
          availableQuantity: available,
          isAvailable: available > 0,
        });
      }

      // Sort by availability (highest first)
      locationBreakdown.sort((a, b) => b.availableQuantity - a.availableQuantity);

      // Total availability is sum across all locations (or max if not splitting)
      // For simplicity, use the maximum available at any single location
      const totalAvailable = locationBreakdown.reduce(
        (max, loc) => Math.max(max, loc.availableQuantity),
        0
      );

      const threshold = bundle.inventoryRecord?.lowStockThreshold || 10;

      // Build component inventories
      const componentInventories: ComponentInventory[] = bundle.components.map(comp => {
        const variantId = comp.shopifyVariantId || comp.shopifyProductId;
        const locationMap = componentLocationInventory.get(variantId);
        const totalInventory = locationMap
          ? Array.from(locationMap.values()).reduce((sum, qty) => sum + qty, 0)
          : 0;

        return {
          componentId: comp.id,
          shopifyProductId: comp.shopifyProductId,
          shopifyVariantId: comp.shopifyVariantId || undefined,
          quantity: comp.quantity,
          inventoryLevel: totalInventory,
          availableForBundle: Math.floor(totalInventory / (comp.quantity || 1)),
          locationInventory: locationMap
            ? Array.from(locationMap.entries()).map(([locId, qty]) => ({
                locationId: locId,
                locationName: locationNames.get(locId) || 'Unknown',
                available: qty,
              }))
            : [],
        };
      });

      return {
        bundleId,
        availableQuantity: totalAvailable,
        componentInventories,
        lastCalculatedAt: new Date(),
        isLowStock: totalAvailable <= threshold && totalAvailable > 0,
        isOutOfStock: totalAvailable <= 0,
        totalLocations: allLocationIds.size,
        locationBreakdown,
      };

    } catch (error) {
      logger.error('Error fetching multi-location inventory', {
        bundleId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Fall back to basic calculation
      return this.calculateBundleInventory(bundleId);
    }
  }

  /**
   * Check if bundle can be fulfilled from a specific location
   */
  async canFulfillFromLocation(
    bundleId: string,
    locationId: string,
    quantity: number,
    session: Session
  ): Promise<{ canFulfill: boolean; availableQuantity: number; missingComponents: string[] }> {
    const result = await this.getMultiLocationInventory(bundleId, session);

    const locationData = result.locationBreakdown?.find(l => l.locationId === locationId);

    if (!locationData) {
      return {
        canFulfill: false,
        availableQuantity: 0,
        missingComponents: ['Location not found'],
      };
    }

    const missingComponents: string[] = [];
    for (const comp of result.componentInventories) {
      const locInv = comp.locationInventory?.find(l => l.locationId === locationId);
      const available = locInv?.available || 0;
      const required = comp.quantity * quantity;

      if (available < required) {
        missingComponents.push(comp.shopifyProductId);
      }
    }

    return {
      canFulfill: locationData.availableQuantity >= quantity,
      availableQuantity: locationData.availableQuantity,
      missingComponents,
    };
  }

  /**
   * Get all locations for a shop
   */
  async getShopLocations(session: Session): Promise<Array<{
    id: string;
    name: string;
    isActive: boolean;
    fulfillsOnlineOrders: boolean;
    city?: string;
    country?: string;
  }>> {
    try {
      const client = new shopify.clients.Graphql({ session });
      const response = await client.query({
        data: { query: LOCATIONS_QUERY },
      });

      const edges = (response.body as any)?.data?.locations?.edges || [];

      return edges.map((edge: any) => ({
        id: edge.node.id,
        name: edge.node.name,
        isActive: edge.node.isActive,
        fulfillsOnlineOrders: edge.node.fulfillsOnlineOrders,
        city: edge.node.address?.city,
        country: edge.node.address?.country,
      }));
    } catch (error) {
      logger.error('Error fetching shop locations', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return [];
    }
  }

  /**
   * Handle out-of-stock scenario for a bundle
   */
  async handleOutOfStock(
    bundleId: string,
    shop: string,
    config: OutOfStockConfig
  ): Promise<void> {
    const bundle = await prisma.bundle.findUnique({
      where: { id: bundleId },
    });

    if (!bundle) return;

    // Log out-of-stock event
    await prisma.bundleEvent.create({
      data: {
        shop,
        bundleId,
        eventType: 'OUT_OF_STOCK',
        metadata: {
          hideBundle: config.hideBundle,
          showWaitlist: config.showWaitlist,
          allowBackorder: config.allowBackorder,
        },
      },
    });

    // If configured to hide bundle, update status
    if (config.hideBundle && bundle.status === 'ACTIVE') {
      await prisma.bundle.update({
        where: { id: bundleId },
        data: { status: 'PAUSED' },
      });

      logger.info('Bundle paused due to out-of-stock', { bundleId, shop });
    }
  }

  /**
   * Reserve inventory for a bundle (for checkout holds)
   */
  async reserveInventory(
    bundleId: string,
    quantity: number,
    reservationId: string
  ): Promise<{ success: boolean; error?: string }> {
    const bundle = await prisma.bundle.findUnique({
      where: { id: bundleId },
      include: { inventoryRecord: true },
    });

    if (!bundle) {
      return { success: false, error: 'Bundle not found' };
    }

    const available = bundle.inventoryRecord?.availableQuantity || 0;
    const reserved = bundle.inventoryRecord?.reservedQuantity || 0;
    const actualAvailable = available - reserved;

    if (actualAvailable < quantity) {
      return { success: false, error: 'Insufficient inventory' };
    }

    // Update reserved quantity
    await prisma.bundleInventory.update({
      where: { bundleId },
      data: {
        reservedQuantity: { increment: quantity },
      },
    });

    logger.info('Inventory reserved for bundle', {
      bundleId,
      quantity,
      reservationId,
    });

    return { success: true };
  }

  /**
   * Release reserved inventory (if checkout abandoned)
   */
  async releaseReservation(
    bundleId: string,
    quantity: number,
    reservationId: string
  ): Promise<void> {
    await prisma.bundleInventory.update({
      where: { bundleId },
      data: {
        reservedQuantity: { decrement: quantity },
      },
    });

    logger.info('Inventory reservation released', {
      bundleId,
      quantity,
      reservationId,
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

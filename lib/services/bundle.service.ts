/**
 * Bundle Service - V2
 *
 * Core service for managing bundles. Sprint 1 focuses on FIXED bundles only.
 * Other bundle types will be added in subsequent sprints.
 */

import prisma from '@/utils/prisma';
import { logger, createBundleLogger } from '@/lib/monitoring/logger';
import { BundleMetrics } from '@/lib/monitoring/metrics';
import { isFeatureEnabled } from '@/config/feature-flags';
import { PricingService } from './pricing.service';
import { getInventoryService, InventoryService } from './inventory.service';
import {
  getShopifyIntegrationService,
  ShopifyIntegrationService,
  BundleShopifyData,
} from './shopify-integration.service';

// Types
export interface CreateBundleInput {
  shop: string;
  name: string;
  title: string;
  description?: string;
  components: CreateComponentInput[];
  discountPercent: number;
  tags?: string[];
  featuredImage?: string;
}

export interface CreateComponentInput {
  shopifyProductId: string;
  shopifyVariantId?: string;
  quantity?: number;
}

export interface UpdateBundleInput {
  name?: string;
  title?: string;
  description?: string;
  discountPercent?: number;
  tags?: string[];
  featuredImage?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
}

export interface BundleWithPricing {
  id: string;
  shop: string;
  name: string;
  title: string;
  description: string | null;
  slug: string;
  type: string;
  status: string;
  shopifyProductId: string | null;
  shopifyMetaobjectId: string | null;
  featuredImage: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  components: ComponentWithProduct[];
  // Computed pricing
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  savingsPercentage: number;
  // Inventory (Sprint 3)
  inventory?: {
    available: number;
    isLowStock: boolean;
    isOutOfStock: boolean;
    lastSynced: Date | null;
  };
}

export interface ComponentWithProduct {
  id: string;
  shopifyProductId: string;
  shopifyVariantId: string | null;
  quantity: number;
  displayOrder: number;
  cachedTitle: string | null;
  cachedPrice: number | null;
  cachedImageUrl: string | null;
}

export interface ListBundlesParams {
  shop: string;
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedBundles {
  bundles: BundleWithPricing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class BundleService {
  private pricingService: PricingService;
  private shopifyIntegration: ShopifyIntegrationService;
  private inventoryService: InventoryService;

  constructor() {
    this.pricingService = new PricingService();
    this.shopifyIntegration = getShopifyIntegrationService();
    this.inventoryService = getInventoryService();
  }

  /**
   * Create a new fixed bundle
   */
  async createBundle(input: CreateBundleInput): Promise<BundleWithPricing> {
    const log = createBundleLogger('new', input.shop);
    log.info('Creating bundle', { name: input.name });

    // Validate input
    this.validateCreateInput(input);

    // Generate slug
    const slug = this.generateSlug(input.name);

    // Check for duplicate slug
    const existing = await prisma.bundle.findUnique({
      where: { shop_slug: { shop: input.shop, slug } },
    });

    if (existing) {
      throw new Error(`Bundle with slug "${slug}" already exists`);
    }

    // Create bundle with components and pricing rule
    const bundle = await prisma.bundle.create({
      data: {
        shop: input.shop,
        name: input.name,
        title: input.title,
        description: input.description,
        slug,
        type: 'FIXED',
        status: 'DRAFT',
        featuredImage: input.featuredImage,
        tags: input.tags || [],
        components: {
          create: input.components.map((comp, index) => ({
            shopifyProductId: comp.shopifyProductId,
            shopifyVariantId: comp.shopifyVariantId,
            quantity: comp.quantity || 1,
            isRequired: true,
            displayOrder: index,
            minQuantity: 0,
            maxQuantity: 1,
            priceAdjustmentType: 'NONE',
          })),
        },
        pricingRules: {
          create: {
            name: 'Bundle Discount',
            priority: 0,
            isActive: true,
            ruleType: 'BUNDLE_DISCOUNT',
            conditions: {},
            discountType: 'PERCENTAGE',
            discountValue: input.discountPercent,
          },
        },
        inventoryRecord: {
          create: {
            trackingMethod: 'COMPONENT_BASED',
            lowStockThreshold: 10,
            availableQuantity: 0,
            reservedQuantity: 0,
            allowOversell: false,
            autoSyncEnabled: true,
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
      },
    });

    // Track metric
    BundleMetrics.created({ shop: input.shop, bundleType: 'FIXED' });

    log.info('Bundle created', { bundleId: bundle.id });

    return this.enrichBundleWithPricing(bundle);
  }

  /**
   * Get a bundle by ID with pricing calculations
   */
  async getBundle(bundleId: string, shop: string): Promise<BundleWithPricing | null> {
    const bundle = await prisma.bundle.findFirst({
      where: { id: bundleId, shop },
      include: {
        components: {
          orderBy: { displayOrder: 'asc' },
        },
        pricingRules: {
          where: { isActive: true },
          orderBy: { priority: 'desc' },
        },
        discounts: true,
        inventoryRecord: true,
      },
    });

    if (!bundle) return null;

    return this.enrichBundleWithPricing(bundle);
  }

  /**
   * List bundles with pagination
   */
  async listBundles(params: ListBundlesParams): Promise<PaginatedBundles> {
    const {
      shop,
      page = 1,
      limit = 20,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, any> = { shop };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute queries in parallel
    const [bundles, total] = await Promise.all([
      prisma.bundle.findMany({
        where,
        include: {
          components: {
            orderBy: { displayOrder: 'asc' },
          },
          pricingRules: {
            where: { isActive: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.bundle.count({ where }),
    ]);

    // Enrich with pricing
    const bundlesWithPricing = await Promise.all(
      bundles.map((b) => this.enrichBundleWithPricing(b))
    );

    return {
      bundles: bundlesWithPricing,
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
   * Update a bundle
   * Syncs changes with Shopify if bundle is already published (ACTIVE)
   */
  async updateBundle(
    bundleId: string,
    shop: string,
    input: UpdateBundleInput
  ): Promise<BundleWithPricing> {
    const log = createBundleLogger(bundleId, shop);

    // Check bundle exists with current data
    const existing = await prisma.bundle.findFirst({
      where: { id: bundleId, shop },
      include: {
        components: { orderBy: { displayOrder: 'asc' } },
        pricingRules: { where: { isActive: true } },
        discounts: true,
      },
    });

    if (!existing) {
      throw new Error('Bundle not found');
    }

    // Build update data
    const updateData: Record<string, any> = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.tags !== undefined) updateData.tags = input.tags;
    if (input.featuredImage !== undefined) updateData.featuredImage = input.featuredImage;
    if (input.status !== undefined) updateData.status = input.status;

    // Update bundle
    const bundle = await prisma.bundle.update({
      where: { id: bundleId },
      data: updateData,
      include: {
        components: {
          orderBy: { displayOrder: 'asc' },
        },
        pricingRules: {
          where: { isActive: true },
        },
      },
    });

    // Update pricing rule if discount changed
    if (input.discountPercent !== undefined) {
      await prisma.bundlePricingRule.updateMany({
        where: {
          bundleId,
          ruleType: 'BUNDLE_DISCOUNT',
        },
        data: {
          discountValue: input.discountPercent,
        },
      });
    }

    // Sync with Shopify if bundle is active and has Shopify resources
    const isActive = bundle.status === 'ACTIVE';
    const hasShopifyResources = existing.shopifyMetaobjectId || existing.discounts.length > 0;

    if (isActive && hasShopifyResources) {
      log.info('Syncing updates with Shopify');

      // Get the updated discount percentage
      const discountPercent = input.discountPercent !== undefined
        ? input.discountPercent
        : (existing.pricingRules[0]?.discountValue
          ? Number(existing.pricingRules[0].discountValue)
          : 0);

      const bundleShopifyData: BundleShopifyData = {
        id: bundle.id,
        shop: bundle.shop,
        name: bundle.name,
        title: bundle.title,
        description: bundle.description,
        discountPercent,
        components: bundle.components.map((c) => ({
          shopifyProductId: c.shopifyProductId,
          quantity: c.quantity,
        })),
      };

      const result = await this.shopifyIntegration.onBundleUpdate(
        bundleShopifyData,
        existing.shopifyMetaobjectId,
        existing.discounts[0]?.shopifyDiscountId || null
      );

      if (result.errors.length > 0) {
        log.warn('Shopify sync completed with errors', { errors: result.errors });
      }
    }

    log.info('Bundle updated');

    return this.enrichBundleWithPricing(bundle);
  }

  /**
   * Delete a bundle
   * Cleans up associated Shopify resources (metaobject and discount)
   */
  async deleteBundle(bundleId: string, shop: string): Promise<void> {
    const log = createBundleLogger(bundleId, shop);

    const bundle = await prisma.bundle.findFirst({
      where: { id: bundleId, shop },
      include: { discounts: true },
    });

    if (!bundle) {
      throw new Error('Bundle not found');
    }

    // Delete Shopify resources first
    const shopifyDiscountId = bundle.discounts[0]?.shopifyDiscountId || null;
    const shopifyMetaobjectId = bundle.shopifyMetaobjectId;

    if (shopifyMetaobjectId || shopifyDiscountId) {
      log.info('Deleting Shopify resources', { shopifyMetaobjectId, shopifyDiscountId });
      const result = await this.shopifyIntegration.onBundleDelete(
        bundleId,
        shop,
        shopifyMetaobjectId,
        shopifyDiscountId
      );

      if (result.errors.length > 0) {
        log.warn('Shopify resource deletion completed with errors', { errors: result.errors });
        // Continue with local deletion even if Shopify cleanup fails
      }
    }

    // Delete bundle (cascades to components, rules, etc.)
    await prisma.bundle.delete({
      where: { id: bundleId },
    });

    BundleMetrics.deleted({ shop, bundleId, bundleType: bundle.type });
    log.info('Bundle deleted');
  }

  /**
   * Add components to a bundle
   */
  async addComponents(
    bundleId: string,
    shop: string,
    components: CreateComponentInput[]
  ): Promise<BundleWithPricing> {
    const bundle = await prisma.bundle.findFirst({
      where: { id: bundleId, shop },
      include: { components: true },
    });

    if (!bundle) {
      throw new Error('Bundle not found');
    }

    // Get max display order
    const maxOrder = bundle.components.reduce(
      (max, c) => Math.max(max, c.displayOrder),
      -1
    );

    // Add new components
    await prisma.bundleComponent.createMany({
      data: components.map((comp, index) => ({
        bundleId,
        shopifyProductId: comp.shopifyProductId,
        shopifyVariantId: comp.shopifyVariantId,
        quantity: comp.quantity || 1,
        isRequired: true,
        displayOrder: maxOrder + index + 1,
        minQuantity: 0,
        maxQuantity: 1,
        priceAdjustmentType: 'NONE',
      })),
    });

    return this.getBundle(bundleId, shop) as Promise<BundleWithPricing>;
  }

  /**
   * Remove a component from a bundle
   */
  async removeComponent(
    bundleId: string,
    componentId: string,
    shop: string
  ): Promise<BundleWithPricing> {
    const bundle = await prisma.bundle.findFirst({
      where: { id: bundleId, shop },
      include: { components: true },
    });

    if (!bundle) {
      throw new Error('Bundle not found');
    }

    if (bundle.components.length <= 2) {
      throw new Error('Bundle must have at least 2 components');
    }

    await prisma.bundleComponent.delete({
      where: { id: componentId },
    });

    return this.getBundle(bundleId, shop) as Promise<BundleWithPricing>;
  }

  /**
   * Update component quantities
   */
  async updateComponentQuantities(
    bundleId: string,
    shop: string,
    updates: Array<{ componentId: string; quantity: number }>
  ): Promise<BundleWithPricing> {
    const bundle = await prisma.bundle.findFirst({
      where: { id: bundleId, shop },
    });

    if (!bundle) {
      throw new Error('Bundle not found');
    }

    // Update each component
    await Promise.all(
      updates.map(({ componentId, quantity }) =>
        prisma.bundleComponent.update({
          where: { id: componentId },
          data: { quantity: Math.max(1, quantity) },
        })
      )
    );

    return this.getBundle(bundleId, shop) as Promise<BundleWithPricing>;
  }

  /**
   * Sync component product data from Shopify
   */
  async syncComponentData(
    bundleId: string,
    shop: string,
    productData: Map<string, { title: string; price: number; imageUrl?: string; sku?: string }>
  ): Promise<void> {
    const components = await prisma.bundleComponent.findMany({
      where: { bundleId },
    });

    await Promise.all(
      components.map(async (comp) => {
        const data = productData.get(comp.shopifyProductId);
        if (data) {
          await prisma.bundleComponent.update({
            where: { id: comp.id },
            data: {
              cachedTitle: data.title,
              cachedPrice: data.price,
              cachedImageUrl: data.imageUrl,
              cachedSku: data.sku,
              lastSyncedAt: new Date(),
            },
          });
        }
      })
    );
  }

  /**
   * Publish a bundle (set to ACTIVE)
   * Creates Shopify metaobject and discount on first publish
   * Reactivates existing discount on republish
   */
  async publishBundle(bundleId: string, shop: string): Promise<BundleWithPricing> {
    const log = createBundleLogger(bundleId, shop);

    const bundle = await prisma.bundle.findFirst({
      where: { id: bundleId, shop },
      include: {
        components: { orderBy: { displayOrder: 'asc' } },
        pricingRules: { where: { isActive: true } },
        discounts: { where: { isActive: true } },
      },
    });

    if (!bundle) {
      throw new Error('Bundle not found');
    }

    if (bundle.components.length < 2) {
      throw new Error('Bundle must have at least 2 components to publish');
    }

    // Get the discount percentage from pricing rules
    const discountPercent = bundle.pricingRules[0]?.discountValue
      ? Number(bundle.pricingRules[0].discountValue)
      : 0;

    // Prepare bundle data for Shopify integration
    const bundleShopifyData: BundleShopifyData = {
      id: bundle.id,
      shop: bundle.shop,
      name: bundle.name,
      title: bundle.title,
      description: bundle.description,
      discountPercent,
      components: bundle.components.map((c) => ({
        shopifyProductId: c.shopifyProductId,
        quantity: c.quantity,
      })),
    };

    let shopifyMetaobjectId = bundle.shopifyMetaobjectId;
    let shopifyDiscountId = bundle.discounts[0]?.shopifyDiscountId || null;

    // Check if this is a first publish or republish
    const isFirstPublish = !bundle.shopifyMetaobjectId && !shopifyDiscountId;

    if (isFirstPublish) {
      // First publish: Create Shopify resources
      log.info('First publish - creating Shopify resources');
      const result = await this.shopifyIntegration.onBundlePublish(bundleShopifyData);

      shopifyMetaobjectId = result.metaobjectId;
      shopifyDiscountId = result.discountId;

      if (result.errors.length > 0) {
        log.warn('Shopify integration completed with errors', { errors: result.errors });
      }

      // Store the discount ID in BundleDiscount table
      if (shopifyDiscountId) {
        await prisma.bundleDiscount.create({
          data: {
            bundleId,
            shopifyDiscountId,
            discountType: 'automatic',
            isActive: true,
          },
        });
      }
    } else if (shopifyDiscountId) {
      // Republish: Reactivate existing discount
      log.info('Republish - reactivating discount');
      const result = await this.shopifyIntegration.onBundleRepublish(
        bundleId,
        shop,
        shopifyDiscountId
      );

      if (result.errors.length > 0) {
        log.warn('Failed to reactivate discount', { errors: result.errors });
      }

      // Update discount record to active
      await prisma.bundleDiscount.updateMany({
        where: { bundleId, shopifyDiscountId },
        data: { isActive: true },
      });
    }

    // Update bundle status and Shopify references
    const updated = await prisma.bundle.update({
      where: { id: bundleId },
      data: {
        status: 'ACTIVE',
        publishedAt: new Date(),
        shopifyMetaobjectId: shopifyMetaobjectId || bundle.shopifyMetaobjectId,
      },
      include: {
        components: { orderBy: { displayOrder: 'asc' } },
        pricingRules: { where: { isActive: true } },
      },
    });

    BundleMetrics.published({ shop, bundleId, bundleType: bundle.type });
    log.info('Bundle published', { shopifyMetaobjectId, shopifyDiscountId });

    return this.enrichBundleWithPricing(updated);
  }

  /**
   * Unpublish a bundle (set to PAUSED)
   * Deactivates the Shopify discount but keeps the metaobject for reference
   */
  async unpublishBundle(bundleId: string, shop: string): Promise<BundleWithPricing> {
    const log = createBundleLogger(bundleId, shop);

    // Get the bundle with its discount
    const bundle = await prisma.bundle.findFirst({
      where: { id: bundleId, shop },
      include: {
        discounts: { where: { isActive: true } },
      },
    });

    if (!bundle) {
      throw new Error('Bundle not found');
    }

    // Deactivate Shopify discount
    const shopifyDiscountId = bundle.discounts[0]?.shopifyDiscountId || null;
    if (shopifyDiscountId) {
      log.info('Deactivating Shopify discount');
      const result = await this.shopifyIntegration.onBundleUnpublish(
        bundleId,
        shop,
        shopifyDiscountId
      );

      if (result.errors.length > 0) {
        log.warn('Failed to deactivate discount', { errors: result.errors });
      }

      // Mark discount as inactive in database
      await prisma.bundleDiscount.updateMany({
        where: { bundleId, shopifyDiscountId },
        data: { isActive: false },
      });
    }

    const updated = await prisma.bundle.update({
      where: { id: bundleId },
      data: { status: 'PAUSED' },
      include: {
        components: { orderBy: { displayOrder: 'asc' } },
        pricingRules: { where: { isActive: true } },
      },
    });

    log.info('Bundle unpublished');

    return this.enrichBundleWithPricing(updated);
  }

  /**
   * Get bundle count by status for a shop
   */
  async getBundleCounts(shop: string): Promise<Record<string, number>> {
    const counts = await prisma.bundle.groupBy({
      by: ['status'],
      where: { shop },
      _count: { id: true },
    });

    const result: Record<string, number> = {
      DRAFT: 0,
      ACTIVE: 0,
      SCHEDULED: 0,
      PAUSED: 0,
      ARCHIVED: 0,
    };

    for (const count of counts) {
      result[count.status] = count._count.id;
    }

    result.total = Object.values(result).reduce((a, b) => a + b, 0);

    return result;
  }

  // Private helpers

  private validateCreateInput(input: CreateBundleInput): void {
    if (!input.name?.trim()) {
      throw new Error('Bundle name is required');
    }
    if (!input.title?.trim()) {
      throw new Error('Bundle title is required');
    }
    if (!input.components || input.components.length < 2) {
      throw new Error('Bundle must have at least 2 components');
    }
    if (input.discountPercent < 0 || input.discountPercent > 100) {
      throw new Error('Discount must be between 0 and 100');
    }
  }

  private generateSlug(name: string): string {
    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${base}-${Date.now().toString(36)}`;
  }

  private async enrichBundleWithPricing(bundle: any): Promise<BundleWithPricing> {
    // Calculate pricing
    const pricing = this.pricingService.calculateFixedBundlePrice(
      bundle.components,
      bundle.pricingRules?.[0]?.discountValue || 0
    );

    // Get inventory data if feature is enabled
    let inventory: BundleWithPricing['inventory'] = undefined;
    if (isFeatureEnabled('INVENTORY_SYNC')) {
      try {
        const inventoryResult = await this.inventoryService.calculateBundleInventory(bundle.id);
        inventory = {
          available: inventoryResult.availableQuantity,
          isLowStock: inventoryResult.isLowStock,
          isOutOfStock: inventoryResult.isOutOfStock,
          lastSynced: inventoryResult.lastCalculatedAt,
        };
      } catch (error) {
        // If inventory calculation fails, continue without it
        logger.warn('Failed to calculate bundle inventory', {
          bundleId: bundle.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      id: bundle.id,
      shop: bundle.shop,
      name: bundle.name,
      title: bundle.title,
      description: bundle.description,
      slug: bundle.slug,
      type: bundle.type,
      status: bundle.status,
      shopifyProductId: bundle.shopifyProductId,
      shopifyMetaobjectId: bundle.shopifyMetaobjectId,
      featuredImage: bundle.featuredImage,
      tags: bundle.tags,
      createdAt: bundle.createdAt,
      updatedAt: bundle.updatedAt,
      publishedAt: bundle.publishedAt,
      components: bundle.components.map((c: any) => ({
        id: c.id,
        shopifyProductId: c.shopifyProductId,
        shopifyVariantId: c.shopifyVariantId,
        quantity: c.quantity,
        displayOrder: c.displayOrder,
        cachedTitle: c.cachedTitle,
        cachedPrice: c.cachedPrice ? Number(c.cachedPrice) : null,
        cachedImageUrl: c.cachedImageUrl,
      })),
      originalPrice: pricing.originalPrice,
      discountedPrice: pricing.discountedPrice,
      savings: pricing.savings,
      savingsPercentage: pricing.savingsPercentage,
      inventory,
    };
  }
}

// Singleton instance
let bundleServiceInstance: BundleService | null = null;

export function getBundleService(): BundleService {
  if (!bundleServiceInstance) {
    bundleServiceInstance = new BundleService();
  }
  return bundleServiceInstance;
}

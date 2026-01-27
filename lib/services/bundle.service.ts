/**
 * Bundle Service - V2
 *
 * Core service for managing bundles. Sprint 1 focuses on FIXED bundles only.
 * Other bundle types will be added in subsequent sprints.
 */

import { Prisma } from '@prisma/client';
import prisma from '@/utils/prisma';
import { logger, createBundleLogger } from '@/lib/monitoring/logger';
import { BundleMetrics } from '@/lib/monitoring/metrics';
import { isFeatureEnabled } from '@/config/feature-flags';
import { PricingService } from './pricing.service';

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

  constructor() {
    this.pricingService = new PricingService();
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
    const where: Prisma.BundleWhereInput = { shop };

    if (status) {
      where.status = status as any;
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
   */
  async updateBundle(
    bundleId: string,
    shop: string,
    input: UpdateBundleInput
  ): Promise<BundleWithPricing> {
    const log = createBundleLogger(bundleId, shop);

    // Check bundle exists
    const existing = await prisma.bundle.findFirst({
      where: { id: bundleId, shop },
    });

    if (!existing) {
      throw new Error('Bundle not found');
    }

    // Build update data
    const updateData: Prisma.BundleUpdateInput = {};

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

    log.info('Bundle updated');

    return this.enrichBundleWithPricing(bundle);
  }

  /**
   * Delete a bundle
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
   */
  async publishBundle(bundleId: string, shop: string): Promise<BundleWithPricing> {
    const bundle = await prisma.bundle.findFirst({
      where: { id: bundleId, shop },
      include: { components: true },
    });

    if (!bundle) {
      throw new Error('Bundle not found');
    }

    if (bundle.components.length < 2) {
      throw new Error('Bundle must have at least 2 components to publish');
    }

    const updated = await prisma.bundle.update({
      where: { id: bundleId },
      data: {
        status: 'ACTIVE',
        publishedAt: new Date(),
      },
      include: {
        components: { orderBy: { displayOrder: 'asc' } },
        pricingRules: { where: { isActive: true } },
      },
    });

    BundleMetrics.published({ shop, bundleId, bundleType: bundle.type });

    return this.enrichBundleWithPricing(updated);
  }

  /**
   * Unpublish a bundle (set to PAUSED)
   */
  async unpublishBundle(bundleId: string, shop: string): Promise<BundleWithPricing> {
    const updated = await prisma.bundle.update({
      where: { id: bundleId },
      data: { status: 'PAUSED' },
      include: {
        components: { orderBy: { displayOrder: 'asc' } },
        pricingRules: { where: { isActive: true } },
      },
    });

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

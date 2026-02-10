/**
 * Selling Plans Service
 *
 * Manages Shopify Selling Plan Groups for subscription bundles.
 * Each subscription bundle gets one Selling Plan Group with
 * configurable delivery frequencies (plans).
 *
 * Shopify GraphQL mutations used:
 *   - sellingPlanGroupCreate: Create a new group with plans + product associations
 *   - sellingPlanGroupUpdate: Update plans or add/remove products
 *   - sellingPlanGroupDelete: Remove the group when bundle is unpublished
 */

import { RateLimitedShopifyClient } from '@/lib/shopify/client';
import { logger } from '@/lib/monitoring/logger';

// ============================================
// Types
// ============================================

export interface SubscriptionConfig {
  bundleId: string;
  bundleName: string;
  frequencies: Array<{
    value: string;
    label: string;
    intervalCount: number;
    interval: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  }>;
  discountPercent: number;
  productIds: string[];
}

export interface SellingPlanGroupResult {
  sellingPlanGroupId: string | null;
  errors: string[];
}

// ============================================
// GraphQL Mutations
// ============================================

const SELLING_PLAN_GROUP_CREATE = `
  mutation CreateSellingPlanGroup($input: SellingPlanGroupInput!, $resources: SellingPlanGroupResourceInput) {
    sellingPlanGroupCreate(input: $input, resources: $resources) {
      sellingPlanGroup {
        id
        name
        sellingPlans(first: 10) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const SELLING_PLAN_GROUP_UPDATE = `
  mutation UpdateSellingPlanGroup($id: ID!, $input: SellingPlanGroupInput!) {
    sellingPlanGroupUpdate(id: $id, input: $input) {
      sellingPlanGroup {
        id
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const SELLING_PLAN_GROUP_DELETE = `
  mutation DeleteSellingPlanGroup($id: ID!) {
    sellingPlanGroupDelete(id: $id) {
      deletedSellingPlanGroupId
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const SELLING_PLAN_GROUP_ADD_PRODUCTS = `
  mutation AddProductsToSellingPlanGroup($id: ID!, $productIds: [ID!]!) {
    sellingPlanGroupAddProducts(id: $id, productIds: $productIds) {
      sellingPlanGroup {
        id
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const SELLING_PLAN_GROUP_REMOVE_PRODUCTS = `
  mutation RemoveProductsFromSellingPlanGroup($id: ID!, $productIds: [ID!]!) {
    sellingPlanGroupRemoveProducts(id: $id, productIds: $productIds) {
      removedProductIds
      userErrors {
        field
        message
        code
      }
    }
  }
`;

// ============================================
// Service
// ============================================

export class SellingPlansService {
  /**
   * Create a Selling Plan Group for a subscription bundle.
   *
   * Creates one group with N plans (one per delivery frequency).
   * Each plan has a recurring delivery policy and optionally a
   * percentage discount (subscribe & save).
   */
  async createSellingPlanGroup(
    client: RateLimitedShopifyClient,
    config: SubscriptionConfig
  ): Promise<SellingPlanGroupResult> {
    const errors: string[] = [];

    try {
      const sellingPlans = config.frequencies.map((freq) => ({
        name: freq.label,
        options: freq.label,
        position: 1,
        billingPolicy: {
          recurring: {
            interval: freq.interval,
            intervalCount: freq.intervalCount,
          },
        },
        deliveryPolicy: {
          recurring: {
            interval: freq.interval,
            intervalCount: freq.intervalCount,
          },
        },
        pricingPolicies: config.discountPercent > 0
          ? [
              {
                fixed: {
                  adjustmentType: 'PERCENTAGE',
                  adjustmentValue: {
                    percentage: config.discountPercent,
                  },
                },
              },
            ]
          : [],
      }));

      // Build product GIDs
      const productGids = config.productIds.map((id) =>
        id.startsWith('gid://') ? id : `gid://shopify/Product/${id}`
      );

      const response = await client.mutate<{
        sellingPlanGroupCreate: {
          sellingPlanGroup: { id: string } | null;
          userErrors: Array<{ field: string[]; message: string; code: string }>;
        };
      }>(SELLING_PLAN_GROUP_CREATE, {
        input: {
          name: `Subscribe & Save: ${config.bundleName}`,
          merchantCode: `bundle-${config.bundleId}`,
          options: ['Delivery frequency'],
          sellingPlansToCreate: sellingPlans,
        },
        resources: {
          productIds: productGids,
        },
      });

      const result = response.data?.sellingPlanGroupCreate;
      if (!result) {
        errors.push('No response from selling plan group creation');
        return { sellingPlanGroupId: null, errors };
      }

      if (result.userErrors.length > 0) {
        const errorMessages = result.userErrors.map((e) => e.message).join(', ');
        errors.push(`Selling plan group errors: ${errorMessages}`);
        return { sellingPlanGroupId: null, errors };
      }

      if (!result.sellingPlanGroup) {
        errors.push('Selling plan group creation returned no group');
        return { sellingPlanGroupId: null, errors };
      }

      logger.info('Created selling plan group', {
        bundleId: config.bundleId,
        sellingPlanGroupId: result.sellingPlanGroup.id,
        planCount: config.frequencies.length,
      });

      return { sellingPlanGroupId: result.sellingPlanGroup.id, errors: [] };
    } catch (error: any) {
      errors.push(`Failed to create selling plan group: ${error.message}`);
      logger.error('Selling plan group creation failed', {
        bundleId: config.bundleId,
        error: error.message,
      });
      return { sellingPlanGroupId: null, errors };
    }
  }

  /**
   * Delete a Selling Plan Group.
   * Called when a subscription bundle is unpublished or deleted.
   */
  async deleteSellingPlanGroup(
    client: RateLimitedShopifyClient,
    sellingPlanGroupId: string
  ): Promise<void> {
    try {
      const response = await client.mutate<{
        sellingPlanGroupDelete: {
          deletedSellingPlanGroupId: string | null;
          userErrors: Array<{ field: string[]; message: string; code: string }>;
        };
      }>(SELLING_PLAN_GROUP_DELETE, {
        id: sellingPlanGroupId,
      });

      const result = response.data?.sellingPlanGroupDelete;
      if (result?.userErrors && result.userErrors.length > 0) {
        logger.warn('Selling plan group delete had errors', {
          sellingPlanGroupId,
          errors: result.userErrors.map((e) => e.message),
        });
      }
    } catch (error: any) {
      // Best-effort deletion — log but don't throw
      logger.error('Failed to delete selling plan group', {
        sellingPlanGroupId,
        error: error.message,
      });
    }
  }

  /**
   * Update product associations for a selling plan group.
   * Adds new products and removes old ones.
   */
  async updateProductAssociations(
    client: RateLimitedShopifyClient,
    sellingPlanGroupId: string,
    newProductIds: string[],
    oldProductIds: string[]
  ): Promise<void> {
    const toGid = (id: string) =>
      id.startsWith('gid://') ? id : `gid://shopify/Product/${id}`;

    const newGids = newProductIds.map(toGid);
    const oldGids = oldProductIds.map(toGid);

    const toAdd = newGids.filter((gid) => !oldGids.includes(gid));
    const toRemove = oldGids.filter((gid) => !newGids.includes(gid));

    if (toAdd.length > 0) {
      try {
        await client.mutate(SELLING_PLAN_GROUP_ADD_PRODUCTS, {
          id: sellingPlanGroupId,
          productIds: toAdd,
        });
      } catch (error: any) {
        logger.error('Failed to add products to selling plan group', {
          sellingPlanGroupId,
          error: error.message,
        });
      }
    }

    if (toRemove.length > 0) {
      try {
        await client.mutate(SELLING_PLAN_GROUP_REMOVE_PRODUCTS, {
          id: sellingPlanGroupId,
          productIds: toRemove,
        });
      } catch (error: any) {
        logger.error('Failed to remove products from selling plan group', {
          sellingPlanGroupId,
          error: error.message,
        });
      }
    }
  }
}

// Singleton
let sellingPlansServiceInstance: SellingPlansService | null = null;

export function getSellingPlansService(): SellingPlansService {
  if (!sellingPlansServiceInstance) {
    sellingPlansServiceInstance = new SellingPlansService();
  }
  return sellingPlansServiceInstance;
}

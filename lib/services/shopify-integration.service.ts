/**
 * Shopify Integration Service
 *
 * Handles creating, updating, and deleting Shopify resources (metaobjects and discounts)
 * when bundles are published, unpublished, or deleted.
 */

import { createShopifyClient, RateLimitedShopifyClient } from '@/lib/shopify/client';
import { logger, createBundleLogger } from '@/lib/monitoring/logger';

// Types for bundle data needed for Shopify integration
export interface BundleShopifyData {
  id: string;
  shop: string;
  name: string;
  title: string;
  description: string | null;
  discountPercent: number;
  components: Array<{
    shopifyProductId: string;
    quantity: number;
  }>;
}

export interface ShopifyIntegrationResult {
  metaobjectId: string | null;
  discountId: string | null;
  errors: string[];
}

// GraphQL Response Types
interface MetaobjectCreateResponse {
  metaobjectCreate: {
    metaobject: {
      id: string;
      handle: string;
    } | null;
    userErrors: Array<{
      field: string[];
      message: string;
      code: string;
    }>;
  };
}

interface MetaobjectUpdateResponse {
  metaobjectUpdate: {
    metaobject: {
      id: string;
      handle: string;
    } | null;
    userErrors: Array<{
      field: string[];
      message: string;
      code: string;
    }>;
  };
}

interface MetaobjectDeleteResponse {
  metaobjectDelete: {
    deletedId: string | null;
    userErrors: Array<{
      field: string[];
      message: string;
      code: string;
    }>;
  };
}

interface DiscountCreateResponse {
  discountAutomaticBasicCreate: {
    automaticDiscountNode: {
      id: string;
      automaticDiscount: {
        title: string;
        status: string;
      };
    } | null;
    userErrors: Array<{
      field: string[];
      message: string;
      code: string;
    }>;
  };
}

interface DiscountUpdateResponse {
  discountAutomaticBasicUpdate: {
    automaticDiscountNode: {
      id: string;
    } | null;
    userErrors: Array<{
      field: string[];
      message: string;
      code: string;
    }>;
  };
}

interface DiscountDeleteResponse {
  discountAutomaticDelete: {
    deletedAutomaticDiscountId: string | null;
    userErrors: Array<{
      field: string[];
      message: string;
      code: string;
    }>;
  };
}

// GraphQL Mutations
const METAOBJECT_CREATE_MUTATION = `
  mutation CreateBundleMetaobject($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) {
      metaobject {
        id
        handle
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const METAOBJECT_UPDATE_MUTATION = `
  mutation UpdateBundleMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
    metaobjectUpdate(id: $id, metaobject: $metaobject) {
      metaobject {
        id
        handle
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const METAOBJECT_DELETE_MUTATION = `
  mutation DeleteBundleMetaobject($id: ID!) {
    metaobjectDelete(id: $id) {
      deletedId
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const DISCOUNT_CREATE_MUTATION = `
  mutation CreateBundleDiscount($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
    discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
      automaticDiscountNode {
        id
        automaticDiscount {
          ... on DiscountAutomaticBasic {
            title
            status
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

const DISCOUNT_UPDATE_MUTATION = `
  mutation UpdateBundleDiscount($id: ID!, $automaticBasicDiscount: DiscountAutomaticBasicInput!) {
    discountAutomaticBasicUpdate(id: $id, automaticBasicDiscount: $automaticBasicDiscount) {
      automaticDiscountNode {
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

const DISCOUNT_DELETE_MUTATION = `
  mutation DeleteBundleDiscount($id: ID!) {
    discountAutomaticDelete(id: $id) {
      deletedAutomaticDiscountId
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export class ShopifyIntegrationService {
  private clientCache: Map<string, RateLimitedShopifyClient> = new Map();

  /**
   * Get or create a Shopify client for a shop
   */
  private getClient(shop: string): RateLimitedShopifyClient {
    let client = this.clientCache.get(shop);
    if (!client) {
      client = createShopifyClient(shop);
      this.clientCache.set(shop, client);
    }
    return client;
  }

  /**
   * Create Shopify resources when a bundle is published
   * Creates both a metaobject and an automatic discount
   */
  async onBundlePublish(bundle: BundleShopifyData): Promise<ShopifyIntegrationResult> {
    const log = createBundleLogger(bundle.id, bundle.shop);
    const client = this.getClient(bundle.shop);
    const errors: string[] = [];

    let metaobjectId: string | null = null;
    let discountId: string | null = null;

    // Create metaobject
    try {
      log.info('Creating Shopify metaobject for bundle');
      metaobjectId = await this.createMetaobject(client, bundle);
      log.info('Metaobject created', { metaobjectId });
    } catch (error: any) {
      const errorMsg = `Failed to create metaobject: ${error.message}`;
      log.error(errorMsg, { error: error.message });
      errors.push(errorMsg);
    }

    // Create discount
    try {
      log.info('Creating Shopify discount for bundle');
      discountId = await this.createDiscount(client, bundle);
      log.info('Discount created', { discountId });
    } catch (error: any) {
      const errorMsg = `Failed to create discount: ${error.message}`;
      log.error(errorMsg, { error: error.message });
      errors.push(errorMsg);
    }

    return { metaobjectId, discountId, errors };
  }

  /**
   * Update Shopify resources when a bundle is updated
   */
  async onBundleUpdate(
    bundle: BundleShopifyData,
    metaobjectId: string | null,
    discountId: string | null
  ): Promise<ShopifyIntegrationResult> {
    const log = createBundleLogger(bundle.id, bundle.shop);
    const client = this.getClient(bundle.shop);
    const errors: string[] = [];

    // Update metaobject if exists
    if (metaobjectId) {
      try {
        log.info('Updating Shopify metaobject for bundle');
        await this.updateMetaobject(client, metaobjectId, bundle);
        log.info('Metaobject updated', { metaobjectId });
      } catch (error: any) {
        const errorMsg = `Failed to update metaobject: ${error.message}`;
        log.error(errorMsg, { error: error.message });
        errors.push(errorMsg);
      }
    }

    // Update discount if exists
    if (discountId) {
      try {
        log.info('Updating Shopify discount for bundle');
        await this.updateDiscount(client, discountId, bundle);
        log.info('Discount updated', { discountId });
      } catch (error: any) {
        const errorMsg = `Failed to update discount: ${error.message}`;
        log.error(errorMsg, { error: error.message });
        errors.push(errorMsg);
      }
    }

    return { metaobjectId, discountId, errors };
  }

  /**
   * Deactivate discount when a bundle is unpublished
   */
  async onBundleUnpublish(
    bundleId: string,
    shop: string,
    discountId: string | null
  ): Promise<{ success: boolean; errors: string[] }> {
    const log = createBundleLogger(bundleId, shop);
    const client = this.getClient(shop);
    const errors: string[] = [];

    if (discountId) {
      try {
        log.info('Deactivating Shopify discount');
        await this.toggleDiscount(client, discountId, false);
        log.info('Discount deactivated', { discountId });
      } catch (error: any) {
        const errorMsg = `Failed to deactivate discount: ${error.message}`;
        log.error(errorMsg, { error: error.message });
        errors.push(errorMsg);
      }
    }

    return { success: errors.length === 0, errors };
  }

  /**
   * Reactivate discount when a bundle is republished
   */
  async onBundleRepublish(
    bundleId: string,
    shop: string,
    discountId: string | null
  ): Promise<{ success: boolean; errors: string[] }> {
    const log = createBundleLogger(bundleId, shop);
    const client = this.getClient(shop);
    const errors: string[] = [];

    if (discountId) {
      try {
        log.info('Reactivating Shopify discount');
        await this.toggleDiscount(client, discountId, true);
        log.info('Discount reactivated', { discountId });
      } catch (error: any) {
        const errorMsg = `Failed to reactivate discount: ${error.message}`;
        log.error(errorMsg, { error: error.message });
        errors.push(errorMsg);
      }
    }

    return { success: errors.length === 0, errors };
  }

  /**
   * Delete Shopify resources when a bundle is deleted
   */
  async onBundleDelete(
    bundleId: string,
    shop: string,
    metaobjectId: string | null,
    discountId: string | null
  ): Promise<{ success: boolean; errors: string[] }> {
    const log = createBundleLogger(bundleId, shop);
    const client = this.getClient(shop);
    const errors: string[] = [];

    // Delete metaobject
    if (metaobjectId) {
      try {
        log.info('Deleting Shopify metaobject');
        await this.deleteMetaobject(client, metaobjectId);
        log.info('Metaobject deleted', { metaobjectId });
      } catch (error: any) {
        const errorMsg = `Failed to delete metaobject: ${error.message}`;
        log.error(errorMsg, { error: error.message });
        errors.push(errorMsg);
      }
    }

    // Delete discount
    if (discountId) {
      try {
        log.info('Deleting Shopify discount');
        await this.deleteDiscount(client, discountId);
        log.info('Discount deleted', { discountId });
      } catch (error: any) {
        const errorMsg = `Failed to delete discount: ${error.message}`;
        log.error(errorMsg, { error: error.message });
        errors.push(errorMsg);
      }
    }

    return { success: errors.length === 0, errors };
  }

  // Private methods for individual Shopify operations

  /**
   * Create a metaobject for a bundle
   */
  private async createMetaobject(
    client: RateLimitedShopifyClient,
    bundle: BundleShopifyData
  ): Promise<string> {
    const productIds = bundle.components.map((c) => c.shopifyProductId);
    const totalQuantity = bundle.components.reduce((sum, c) => sum + c.quantity, 0);

    const response = await client.mutate<MetaobjectCreateResponse>(METAOBJECT_CREATE_MUTATION, {
      metaobject: {
        type: 'product-bundles',
        capabilities: {
          publishable: {
            status: 'ACTIVE',
          },
        },
        fields: [
          { key: 'bundle_name', value: bundle.name },
          { key: 'bundle_title', value: bundle.title },
          { key: 'description', value: bundle.description || '' },
          { key: 'created_at', value: new Date().toISOString() },
          { key: 'discount', value: String(Math.round(bundle.discountPercent)) },
          { key: 'products', value: JSON.stringify(productIds) },
        ],
      },
    });

    const result = response.data?.metaobjectCreate;
    if (!result) {
      throw new Error('No response from metaobject creation');
    }

    if (result.userErrors.length > 0) {
      throw new Error(result.userErrors.map((e) => e.message).join(', '));
    }

    if (!result.metaobject) {
      throw new Error('Metaobject creation returned no metaobject');
    }

    return result.metaobject.id;
  }

  /**
   * Update a metaobject for a bundle
   */
  private async updateMetaobject(
    client: RateLimitedShopifyClient,
    metaobjectId: string,
    bundle: BundleShopifyData
  ): Promise<void> {
    const productIds = bundle.components.map((c) => c.shopifyProductId);

    const response = await client.mutate<MetaobjectUpdateResponse>(METAOBJECT_UPDATE_MUTATION, {
      id: metaobjectId,
      metaobject: {
        fields: [
          { key: 'bundle_name', value: bundle.name },
          { key: 'bundle_title', value: bundle.title },
          { key: 'description', value: bundle.description || '' },
          { key: 'discount', value: String(Math.round(bundle.discountPercent)) },
          { key: 'products', value: JSON.stringify(productIds) },
        ],
      },
    });

    const result = response.data?.metaobjectUpdate;
    if (result?.userErrors && result.userErrors.length > 0) {
      throw new Error(result.userErrors.map((e) => e.message).join(', '));
    }
  }

  /**
   * Delete a metaobject
   */
  private async deleteMetaobject(
    client: RateLimitedShopifyClient,
    metaobjectId: string
  ): Promise<void> {
    const response = await client.mutate<MetaobjectDeleteResponse>(METAOBJECT_DELETE_MUTATION, {
      id: metaobjectId,
    });

    const result = response.data?.metaobjectDelete;
    if (result?.userErrors && result.userErrors.length > 0) {
      throw new Error(result.userErrors.map((e) => e.message).join(', '));
    }
  }

  /**
   * Create an automatic discount for a bundle
   */
  private async createDiscount(
    client: RateLimitedShopifyClient,
    bundle: BundleShopifyData
  ): Promise<string> {
    const productIds = bundle.components.map((c) => c.shopifyProductId);
    const totalMinQuantity = bundle.components.reduce((sum, c) => sum + c.quantity, 0);

    // Create a unique discount title based on bundle
    const discountTitle = `Bundle: ${bundle.title}`;

    const response = await client.mutate<DiscountCreateResponse>(DISCOUNT_CREATE_MUTATION, {
      automaticBasicDiscount: {
        title: discountTitle,
        startsAt: new Date().toISOString(),
        combinesWith: {
          productDiscounts: true,
          orderDiscounts: false,
          shippingDiscounts: true,
        },
        minimumRequirement: {
          quantity: {
            greaterThanOrEqualToQuantity: String(totalMinQuantity),
          },
        },
        customerGets: {
          items: {
            products: {
              productsToAdd: productIds,
            },
          },
          value: {
            percentage: bundle.discountPercent / 100,
          },
        },
      },
    });

    const result = response.data?.discountAutomaticBasicCreate;
    if (!result) {
      throw new Error('No response from discount creation');
    }

    if (result.userErrors.length > 0) {
      throw new Error(result.userErrors.map((e) => e.message).join(', '));
    }

    if (!result.automaticDiscountNode) {
      throw new Error('Discount creation returned no discount');
    }

    return result.automaticDiscountNode.id;
  }

  /**
   * Update an automatic discount for a bundle
   */
  private async updateDiscount(
    client: RateLimitedShopifyClient,
    discountId: string,
    bundle: BundleShopifyData
  ): Promise<void> {
    const productIds = bundle.components.map((c) => c.shopifyProductId);
    const totalMinQuantity = bundle.components.reduce((sum, c) => sum + c.quantity, 0);
    const discountTitle = `Bundle: ${bundle.title}`;

    const response = await client.mutate<DiscountUpdateResponse>(DISCOUNT_UPDATE_MUTATION, {
      id: discountId,
      automaticBasicDiscount: {
        title: discountTitle,
        minimumRequirement: {
          quantity: {
            greaterThanOrEqualToQuantity: String(totalMinQuantity),
          },
        },
        customerGets: {
          items: {
            products: {
              productsToAdd: productIds,
            },
          },
          value: {
            percentage: bundle.discountPercent / 100,
          },
        },
      },
    });

    const result = response.data?.discountAutomaticBasicUpdate;
    if (result?.userErrors && result.userErrors.length > 0) {
      throw new Error(result.userErrors.map((e) => e.message).join(', '));
    }
  }

  /**
   * Toggle a discount's active state
   */
  private async toggleDiscount(
    client: RateLimitedShopifyClient,
    discountId: string,
    activate: boolean
  ): Promise<void> {
    const now = new Date().toISOString();

    // To deactivate: set endsAt to now
    // To activate: remove endsAt and set startsAt to now
    const discountInput = activate
      ? { startsAt: now, endsAt: null }
      : { endsAt: now };

    const response = await client.mutate<DiscountUpdateResponse>(DISCOUNT_UPDATE_MUTATION, {
      id: discountId,
      automaticBasicDiscount: discountInput,
    });

    const result = response.data?.discountAutomaticBasicUpdate;
    if (result?.userErrors && result.userErrors.length > 0) {
      throw new Error(result.userErrors.map((e) => e.message).join(', '));
    }
  }

  /**
   * Delete a discount
   */
  private async deleteDiscount(
    client: RateLimitedShopifyClient,
    discountId: string
  ): Promise<void> {
    const response = await client.mutate<DiscountDeleteResponse>(DISCOUNT_DELETE_MUTATION, {
      id: discountId,
    });

    const result = response.data?.discountAutomaticDelete;
    if (result?.userErrors && result.userErrors.length > 0) {
      throw new Error(result.userErrors.map((e) => e.message).join(', '));
    }
  }
}

// Singleton instance
let shopifyIntegrationServiceInstance: ShopifyIntegrationService | null = null;

export function getShopifyIntegrationService(): ShopifyIntegrationService {
  if (!shopifyIntegrationServiceInstance) {
    shopifyIntegrationServiceInstance = new ShopifyIntegrationService();
  }
  return shopifyIntegrationServiceInstance;
}

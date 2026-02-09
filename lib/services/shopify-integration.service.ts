/**
 * Shopify Integration Service
 *
 * Handles creating, updating, and deleting Shopify resources (metaobjects and discounts)
 * when bundles are published, unpublished, or deleted.
 *
 * IMPORTANT: Uses discountAutomaticAppCreate (Shopify Function) instead of
 * discountAutomaticBasicCreate. The Function enforces that ALL bundle products
 * and quantities must be present in the cart before any discount applies.
 * See extensions/bundle-discount/ for the Function implementation.
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
  /** "percentage" or "fixed_amount" */
  discountType?: 'percentage' | 'fixed_amount';
  components: Array<{
    shopifyProductId: string;
    shopifyVariantId?: string;
    quantity: number;
  }>;
  /** Optional tiered bundle definitions for multi-tier discounts */
  tiers?: Array<{
    tierId: string;
    discountPercent: number;
    discountType?: 'percentage' | 'fixed_amount';
    /** Multiplier: how many sets of the base components this tier requires */
    bundleSets: number;
  }>;
}

export interface ShopifyIntegrationResult {
  metaobjectId: string | null;
  discountId: string | null;
  errors: string[];
}

// ============================================
// BUNDLE CONFIG FORMAT (written to discount metafield)
// ============================================

/**
 * This is the JSON structure stored in the discount's metafield.
 * The Shopify Function reads this to validate bundle presence in cart.
 */
interface BundleDiscountConfig {
  bundleId: string;
  bundles: BundleDefinitionConfig[];
}

interface BundleDefinitionConfig {
  tierId?: string;
  minBundleSets: number;
  maxBundleSets: number;
  components: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  discount: {
    type: 'percentage' | 'fixed_amount';
    value: number;
  };
}

// ============================================
// GraphQL Response Types
// ============================================

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

interface DiscountAppCreateResponse {
  discountAutomaticAppCreate: {
    automaticAppDiscount: {
      discountId: string;
    } | null;
    userErrors: Array<{
      field: string[];
      message: string;
      code: string;
    }>;
  };
}

interface DiscountAppUpdateResponse {
  discountAutomaticAppUpdate: {
    automaticAppDiscount: {
      discountId: string;
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

// ============================================
// GraphQL Mutations
// ============================================

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

/**
 * Creates an automatic discount powered by a Shopify Function.
 *
 * The Function (handle: "bundle-discount") validates that ALL bundle products
 * and required quantities are present in the cart before applying any discount.
 *
 * Bundle configuration is passed via the metafields array, which gets stored
 * on the discount node and is read by the Function's input query.
 */
const DISCOUNT_APP_CREATE_MUTATION = `
  mutation CreateBundleFunctionDiscount($automaticAppDiscount: DiscountAutomaticAppInput!) {
    discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) {
      automaticAppDiscount {
        discountId
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const DISCOUNT_APP_UPDATE_MUTATION = `
  mutation UpdateBundleFunctionDiscount($id: ID!, $automaticAppDiscount: DiscountAutomaticAppInput!) {
    discountAutomaticAppUpdate(id: $id, automaticAppDiscount: $automaticAppDiscount) {
      automaticAppDiscount {
        discountId
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
   * Creates both a metaobject and a Function-based automatic discount
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

    // Create Function-based discount
    try {
      log.info('Creating Shopify Function discount for bundle');
      discountId = await this.createFunctionDiscount(client, bundle);
      log.info('Function discount created', { discountId });
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
        log.info('Updating Shopify Function discount for bundle');
        await this.updateFunctionDiscount(client, discountId, bundle);
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
   * Deactivate discount when a bundle is unpublished.
   * For Function discounts, we set endsAt to now via the App update mutation.
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
        log.info('Deactivating Shopify Function discount');
        await this.toggleFunctionDiscount(client, discountId, false);
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
        log.info('Reactivating Shopify Function discount');
        await this.toggleFunctionDiscount(client, discountId, true);
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

  // ============================================
  // METAOBJECT OPERATIONS (unchanged)
  // ============================================

  private async createMetaobject(
    client: RateLimitedShopifyClient,
    bundle: BundleShopifyData
  ): Promise<string> {
    const productIds = bundle.components.map((c) => c.shopifyProductId);

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

  // ============================================
  // FUNCTION DISCOUNT OPERATIONS (replaces DiscountAutomaticBasic)
  // ============================================

  /**
   * Build the BundleDiscountConfig JSON that the Function reads from its metafield.
   *
   * For a simple (non-tiered) bundle:
   *   - One BundleDefinition with all components and the discount
   *
   * For tiered bundles:
   *   - Multiple BundleDefinitions, one per tier, sorted by best deal first
   *   - Each tier specifies a different bundleSets count and discount
   */
  private buildBundleConfig(bundle: BundleShopifyData): BundleDiscountConfig {
    const components = bundle.components.map((c) => ({
      productId: c.shopifyProductId,
      variantId: c.shopifyVariantId,
      quantity: c.quantity,
    }));

    if (bundle.tiers && bundle.tiers.length > 0) {
      // Tiered bundle: create a definition per tier
      const bundles: BundleDefinitionConfig[] = bundle.tiers.map((tier) => ({
        tierId: tier.tierId,
        minBundleSets: tier.bundleSets,
        maxBundleSets: tier.bundleSets,
        components,
        discount: {
          type: tier.discountType || 'percentage',
          value: tier.discountPercent,
        },
      }));

      return { bundleId: bundle.id, bundles };
    }

    // Simple bundle: single definition
    return {
      bundleId: bundle.id,
      bundles: [
        {
          minBundleSets: 1,
          maxBundleSets: 0, // unlimited
          components,
          discount: {
            type: bundle.discountType || 'percentage',
            value: bundle.discountPercent,
          },
        },
      ],
    };
  }

  /**
   * Create a Function-based automatic discount.
   *
   * Uses discountAutomaticAppCreate which links to our deployed Shopify Function.
   * The bundle configuration is stored in the discount's metafield so the Function
   * can read it at checkout time.
   */
  private async createFunctionDiscount(
    client: RateLimitedShopifyClient,
    bundle: BundleShopifyData
  ): Promise<string> {
    const discountTitle = `Bundle: ${bundle.title} [${bundle.id.slice(-6)}]`;
    const bundleConfig = this.buildBundleConfig(bundle);

    const response = await client.mutate<DiscountAppCreateResponse>(DISCOUNT_APP_CREATE_MUTATION, {
      automaticAppDiscount: {
        title: discountTitle,
        functionId: 'bundle-discount',
        startsAt: new Date().toISOString(),
        combinesWith: {
          productDiscounts: false,
          orderDiscounts: false,
          shippingDiscounts: true,
        },
        metafields: [
          {
            namespace: 'shopibundle',
            key: 'bundle_config',
            type: 'json',
            value: JSON.stringify(bundleConfig),
          },
        ],
      },
    });

    const result = response.data?.discountAutomaticAppCreate;
    if (!result) {
      throw new Error('No response from Function discount creation');
    }

    if (result.userErrors.length > 0) {
      throw new Error(result.userErrors.map((e) => e.message).join(', '));
    }

    if (!result.automaticAppDiscount) {
      throw new Error('Function discount creation returned no discount');
    }

    return result.automaticAppDiscount.discountId;
  }

  /**
   * Update a Function-based automatic discount.
   * Rewrites the bundle config metafield with the latest data.
   */
  private async updateFunctionDiscount(
    client: RateLimitedShopifyClient,
    discountId: string,
    bundle: BundleShopifyData
  ): Promise<void> {
    const discountTitle = `Bundle: ${bundle.title} [${bundle.id.slice(-6)}]`;
    const bundleConfig = this.buildBundleConfig(bundle);

    const response = await client.mutate<DiscountAppUpdateResponse>(DISCOUNT_APP_UPDATE_MUTATION, {
      id: discountId,
      automaticAppDiscount: {
        title: discountTitle,
        combinesWith: {
          productDiscounts: false,
          orderDiscounts: false,
          shippingDiscounts: true,
        },
        metafields: [
          {
            namespace: 'shopibundle',
            key: 'bundle_config',
            type: 'json',
            value: JSON.stringify(bundleConfig),
          },
        ],
      },
    });

    const result = response.data?.discountAutomaticAppUpdate;
    if (result?.userErrors && result.userErrors.length > 0) {
      throw new Error(result.userErrors.map((e) => e.message).join(', '));
    }
  }

  /**
   * Toggle a Function discount's active state.
   * For App discounts, use the same update mutation with startsAt/endsAt.
   */
  private async toggleFunctionDiscount(
    client: RateLimitedShopifyClient,
    discountId: string,
    activate: boolean
  ): Promise<void> {
    const now = new Date().toISOString();

    const discountInput = activate
      ? { startsAt: now, endsAt: null }
      : { endsAt: now };

    const response = await client.mutate<DiscountAppUpdateResponse>(DISCOUNT_APP_UPDATE_MUTATION, {
      id: discountId,
      automaticAppDiscount: discountInput,
    });

    const result = response.data?.discountAutomaticAppUpdate;
    if (result?.userErrors && result.userErrors.length > 0) {
      throw new Error(result.userErrors.map((e) => e.message).join(', '));
    }
  }

  /**
   * Delete a discount (works for both App and Basic discount types)
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

/**
 * Rate-Limited Shopify Client
 *
 * Wraps the Shopify GraphQL client with rate limiting.
 * Use this for all Shopify API calls in the V2 system.
 */

import { Session } from '@shopify/shopify-api';
import shopify from '@/utils/shopify';
import sessionHandler from '@/utils/sessionHandler';
import { ShopifyRateLimiter, getShopifyRateLimiter } from './rate-limiter';
import { logger } from '@/lib/monitoring/logger';
import { ShopifyMetrics } from '@/lib/monitoring/metrics';

export interface ShopifyClientOptions {
  shop: string;
  rateLimiter?: ShopifyRateLimiter;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, unknown>;
  }>;
  extensions?: {
    cost?: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

export class RateLimitedShopifyClient {
  private shop: string;
  private session: Session | null = null;
  private rateLimiter: ShopifyRateLimiter;

  constructor(options: ShopifyClientOptions) {
    this.shop = options.shop;
    this.rateLimiter = options.rateLimiter || getShopifyRateLimiter();
  }

  /**
   * Execute a GraphQL query with rate limiting
   */
  async query<T = any>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<GraphQLResponse<T>> {
    const startTime = performance.now();
    let success = false;

    try {
      // Ensure we have a session
      await this.ensureSession();

      // Acquire rate limit token
      await this.rateLimiter.acquire();

      // Create GraphQL client
      const client = new shopify.clients.Graphql({ session: this.session! });

      // Execute query using the query method which returns { body }
      const response = await client.query<GraphQLResponse<T>>({
        data: {
          query,
          variables,
        },
      });

      // Update rate limiter from response headers if available
      // The response may have headers depending on the client version
      const responseAny = response as any;
      if (responseAny.headers) {
        this.rateLimiter.updateFromHeaders(responseAny.headers);
      }

      success = true;

      // Extract the result from body
      const result = response.body as GraphQLResponse<T>;

      // Check for GraphQL errors
      if (result.errors && result.errors.length > 0) {
        logger.warn('GraphQL query returned errors', {
          shop: this.shop,
          errors: result.errors.map((e) => e.message),
        });
      }

      return result;
    } catch (error: any) {
      // Handle rate limiting (429)
      if (error?.response?.statusCode === 429) {
        const retryAfter = error.response.headers?.['retry-after'];
        const waitTime = retryAfter ? parseFloat(retryAfter) * 1000 : 1000;

        logger.warn('Shopify rate limit hit, retrying', {
          shop: this.shop,
          waitTime,
        });

        ShopifyMetrics.apiCall('graphql', performance.now() - startTime, false);

        // Wait and retry once
        await this.sleep(waitTime);
        return this.query<T>(query, variables);
      }

      throw error;
    } finally {
      const duration = performance.now() - startTime;
      ShopifyMetrics.apiCall('graphql', duration, success);
    }
  }

  /**
   * Execute a GraphQL mutation with rate limiting
   */
  async mutate<T = any>(
    mutation: string,
    variables?: Record<string, unknown>
  ): Promise<GraphQLResponse<T>> {
    return this.query<T>(mutation, variables);
  }

  /**
   * Batch multiple queries with rate limiting
   */
  async batchQueries<T = any>(
    queries: Array<{ query: string; variables?: Record<string, unknown> }>
  ): Promise<Array<GraphQLResponse<T>>> {
    const results: Array<GraphQLResponse<T>> = [];

    for (const { query, variables } of queries) {
      const result = await this.query<T>(query, variables);
      results.push(result);
    }

    return results;
  }

  /**
   * Get the current session
   */
  getSession(): Session | null {
    return this.session;
  }

  /**
   * Get rate limiter status
   */
  getRateLimitStatus() {
    return this.rateLimiter.getStatus();
  }

  // Private helpers

  private async ensureSession(): Promise<void> {
    if (this.session) return;

    const sessionId = shopify.session.getOfflineId(this.shop);
    const session = await sessionHandler.loadSession(sessionId);

    if (!session) {
      throw new Error(`No offline session found for shop: ${this.shop}`);
    }

    if (!session.accessToken) {
      throw new Error(`Session for ${this.shop} is missing accessToken`);
    }

    this.session = session;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Create a rate-limited Shopify client for a shop
 */
export function createShopifyClient(shop: string): RateLimitedShopifyClient {
  return new RateLimitedShopifyClient({ shop });
}

/**
 * Common GraphQL fragments for bundles
 */
export const GRAPHQL_FRAGMENTS = {
  PRODUCT_BASIC: `
    fragment ProductBasic on Product {
      id
      title
      handle
      status
      featuredImage {
        url
        altText
      }
      priceRangeV2 {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 1) {
        nodes {
          id
          price
          compareAtPrice
          inventoryQuantity
          sku
        }
      }
    }
  `,

  METAOBJECT_FIELDS: `
    fragment MetaobjectFields on Metaobject {
      id
      handle
      type
      fields {
        key
        value
        type
      }
      createdAt
      updatedAt
    }
  `,
};

/**
 * Common GraphQL queries
 */
export const QUERIES = {
  GET_PRODUCTS_BY_IDS: `
    query GetProductsByIds($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          ...ProductBasic
        }
      }
    }
    ${GRAPHQL_FRAGMENTS.PRODUCT_BASIC}
  `,

  GET_PRODUCT: `
    query GetProduct($id: ID!) {
      product(id: $id) {
        ...ProductBasic
        description
        vendor
        productType
        tags
        variants(first: 100) {
          nodes {
            id
            title
            price
            compareAtPrice
            inventoryQuantity
            sku
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
    }
    ${GRAPHQL_FRAGMENTS.PRODUCT_BASIC}
  `,
};

/**
 * Common GraphQL mutations
 */
export const MUTATIONS = {
  CREATE_AUTOMATIC_DISCOUNT: `
    mutation CreateAutomaticDiscount($discount: DiscountAutomaticBasicInput!) {
      discountAutomaticBasicCreate(automaticBasicDiscount: $discount) {
        automaticDiscountNode {
          id
          automaticDiscount {
            ... on DiscountAutomaticBasic {
              title
              startsAt
              endsAt
              status
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  DELETE_AUTOMATIC_DISCOUNT: `
    mutation DeleteAutomaticDiscount($id: ID!) {
      discountAutomaticDelete(id: $id) {
        deletedAutomaticDiscountId
        userErrors {
          field
          message
        }
      }
    }
  `,

  TOGGLE_AUTOMATIC_DISCOUNT: `
    mutation ToggleAutomaticDiscount($id: ID!, $status: DiscountStatus!) {
      discountAutomaticBasicUpdate(id: $id, automaticBasicDiscount: { status: $status }) {
        automaticDiscountNode {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
};

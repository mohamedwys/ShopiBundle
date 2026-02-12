/**
 * Publish Validation Service
 *
 * Validates that all prerequisites are met before publishing a bundle:
 * 1. Metaobject definition exists with all required fields
 * 2. Shopify Function "bundle-discount" is deployed
 *
 * This prevents the cryptic errors:
 * - "Field definition 'bundle_type' does not exist"
 * - "Function bundle-discount not found"
 */

import { RateLimitedShopifyClient } from '@/lib/shopify/client';
import { logger } from '@/lib/monitoring/logger';

const REQUIRED_METAOBJECT_FIELDS = [
  'bundle_name',
  'bundle_title',
  'bundle_type',
  'description',
  'created_at',
  'discount',
  'products',
  'selection_rules',
  'gift_settings',
  'subscription_settings',
];

const FIND_DEFINITION_QUERY = `
  query FindBundleMetaobjectDefinition {
    metaobjectDefinitions(first: 50) {
      edges {
        node {
          id
          type
          fieldDefinitions {
            key
          }
        }
      }
    }
  }
`;

const FIND_SHOPIFY_FUNCTION_QUERY = `
  query FindShopifyFunction {
    shopifyFunctions(first: 50) {
      edges {
        node {
          id
          apiType
          title
          appBridge {
            handle
          }
        }
      }
    }
  }
`;

export interface PublishValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  checks: {
    metaobjectDefinition: boolean;
    metaobjectFields: boolean;
    shopifyFunction: boolean;
  };
  details?: {
    missingFields?: string[];
    functionId?: string;
  };
}

export class PublishValidationService {
  /**
   * Validate that the shop is ready to publish bundles
   */
  async validatePublishReadiness(
    client: RateLimitedShopifyClient,
    shop: string
  ): Promise<PublishValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const checks = {
      metaobjectDefinition: false,
      metaobjectFields: false,
      shopifyFunction: false,
    };
    const details: PublishValidationResult['details'] = {};

    // Check 1: Metaobject definition exists
    try {
      const defsResponse = await client.query<any>(FIND_DEFINITION_QUERY, {});
      const definitions = defsResponse.data?.metaobjectDefinitions?.edges || [];

      const bundleDef = definitions.find(
        (edge: any) => edge.node.type === 'product-bundles'
      );

      if (!bundleDef) {
        checks.metaobjectDefinition = false;
        errors.push(
          'Metaobject definition "product-bundles" does not exist. ' +
            'Please run: POST /api/admin/sync-metaobject-definition'
        );
      } else {
        checks.metaobjectDefinition = true;

        // Check 2: All required fields present
        const existingKeys = new Set(bundleDef.node.fieldDefinitions.map((f: any) => f.key));
        const missingFields = REQUIRED_METAOBJECT_FIELDS.filter((key) => !existingKeys.has(key));

        if (missingFields.length > 0) {
          checks.metaobjectFields = false;
          details.missingFields = missingFields;
          errors.push(
            `Metaobject definition is missing required fields: ${missingFields.join(', ')}. ` +
              'Please run: POST /api/admin/sync-metaobject-definition'
          );
        } else {
          checks.metaobjectFields = true;
        }
      }
    } catch (error: any) {
      checks.metaobjectDefinition = false;
      checks.metaobjectFields = false;
      errors.push(`Failed to check metaobject definition: ${error.message}`);
    }

    // Check 3: Shopify Function deployed
    try {
      const functionsResponse = await client.query<any>(FIND_SHOPIFY_FUNCTION_QUERY, {});
      const functions = functionsResponse.data?.shopifyFunctions?.edges || [];

      const bundleDiscountFunction = functions.find(
        (edge: any) =>
          edge.node.appBridge?.handle === 'bundle-discount' ||
          edge.node.title?.toLowerCase().includes('bundle-discount')
      );

      if (!bundleDiscountFunction) {
        checks.shopifyFunction = false;
        errors.push(
          'Shopify Function "bundle-discount" is not deployed. ' +
            'Please run: npm run shopify app deploy'
        );
      } else {
        checks.shopifyFunction = true;
        details.functionId = bundleDiscountFunction.node.id;

        // Validate function type
        if (bundleDiscountFunction.node.apiType !== 'product_discounts') {
          warnings.push(
            `Function "bundle-discount" has unexpected type: ${bundleDiscountFunction.node.apiType}. ` +
              'Expected: product_discounts'
          );
        }
      }
    } catch (error: any) {
      checks.shopifyFunction = false;
      errors.push(`Failed to check Shopify Functions: ${error.message}`);
    }

    const valid = checks.metaobjectDefinition && checks.metaobjectFields && checks.shopifyFunction;

    if (!valid) {
      logger.warn('[PublishValidation] Validation failed for shop', {
        shop,
        checks,
        errors,
      });
    }

    return {
      valid,
      errors,
      warnings,
      checks,
      details,
    };
  }

  /**
   * Quick validation with helpful error message
   * Throws an error with clear instructions if validation fails
   */
  async validateOrThrow(client: RateLimitedShopifyClient, shop: string): Promise<void> {
    const result = await this.validatePublishReadiness(client, shop);

    if (!result.valid) {
      const errorMessage = [
        'Cannot publish bundle. Please fix the following issues:',
        '',
        ...result.errors.map((err, i) => `${i + 1}. ${err}`),
        '',
        'For more details, check: GET /api/admin/validate-publish-readiness',
      ].join('\n');

      throw new Error(errorMessage);
    }

    // Log warnings if any
    if (result.warnings.length > 0) {
      logger.warn('[PublishValidation] Warnings detected', {
        shop,
        warnings: result.warnings,
      });
    }
  }
}

// Singleton instance
let publishValidationServiceInstance: PublishValidationService | null = null;

export function getPublishValidationService(): PublishValidationService {
  if (!publishValidationServiceInstance) {
    publishValidationServiceInstance = new PublishValidationService();
  }
  return publishValidationServiceInstance;
}

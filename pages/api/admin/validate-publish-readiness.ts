/**
 * Validate Publish Readiness API
 *
 * GET /api/admin/validate-publish-readiness
 *
 * Checks if the shop is ready to publish bundles by validating:
 * 1. Metaobject definition exists with all required fields
 * 2. Shopify Function "bundle-discount" is deployed and available
 * 3. Session is valid
 *
 * Returns detailed error messages if any checks fail.
 * This should be called BEFORE attempting to publish a bundle.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  withShopAuth,
  ApiContext,
  sendSuccess,
  sendError,
} from '@/lib/middleware/with-shop-auth';
import { createShopifyClient } from '@/lib/shopify/client';

// All required metaobject fields
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
          name
          fieldDefinitions {
            key
            name
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
          apiVersion
          appKey
          appBridge {
            handle
          }
        }
      }
    }
  }
`;

interface ValidationCheck {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

interface ValidationResult {
  ready: boolean;
  checks: {
    metaobjectDefinitionExists: ValidationCheck;
    metaobjectFieldsComplete: ValidationCheck;
    discountFunctionDeployed: ValidationCheck;
    sessionValid: ValidationCheck;
  };
  errors: string[];
  warnings: string[];
}

async function handler(ctx: ApiContext): Promise<void> {
  const { shop, req, res } = ctx;

  if (req.method !== 'GET') {
    return sendError(res, 'Method not allowed', 405);
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const checks: ValidationResult['checks'] = {
    metaobjectDefinitionExists: {
      name: 'Metaobject Definition Exists',
      passed: false,
      message: '',
    },
    metaobjectFieldsComplete: {
      name: 'Metaobject Fields Complete',
      passed: false,
      message: '',
    },
    discountFunctionDeployed: {
      name: 'Discount Function Deployed',
      passed: false,
      message: '',
    },
    sessionValid: {
      name: 'Session Valid',
      passed: true,
      message: 'Session is valid',
    },
  };

  try {
    const client = createShopifyClient(shop);

    // ===================================
    // CHECK 1: Metaobject Definition Exists
    // ===================================
    try {
      const defsResponse = await client.query<any>(FIND_DEFINITION_QUERY, {});
      const definitions = defsResponse.data?.metaobjectDefinitions?.edges || [];

      const bundleDef = definitions.find(
        (edge: any) => edge.node.type === 'product-bundles'
      );

      if (!bundleDef) {
        checks.metaobjectDefinitionExists.passed = false;
        checks.metaobjectDefinitionExists.message = 'Metaobject definition "product-bundles" not found';
        errors.push('Metaobject definition does not exist. Run POST /api/admin/sync-metaobject-definition to create it.');
      } else {
        checks.metaobjectDefinitionExists.passed = true;
        checks.metaobjectDefinitionExists.message = 'Metaobject definition exists';
        checks.metaobjectDefinitionExists.details = {
          definitionId: bundleDef.node.id,
          type: bundleDef.node.type,
        };

        // ===================================
        // CHECK 2: All Required Fields Present
        // ===================================
        const existingKeys = new Set(bundleDef.node.fieldDefinitions.map((f: any) => f.key));
        const missingFields = REQUIRED_METAOBJECT_FIELDS.filter((key) => !existingKeys.has(key));

        if (missingFields.length > 0) {
          checks.metaobjectFieldsComplete.passed = false;
          checks.metaobjectFieldsComplete.message = `Missing ${missingFields.length} required fields: ${missingFields.join(', ')}`;
          checks.metaobjectFieldsComplete.details = {
            missingFields,
            existingFields: Array.from(existingKeys),
          };
          errors.push(
            `Metaobject definition is missing fields: ${missingFields.join(', ')}. Run POST /api/admin/sync-metaobject-definition to add them.`
          );
        } else {
          checks.metaobjectFieldsComplete.passed = true;
          checks.metaobjectFieldsComplete.message = 'All required metaobject fields are present';
          checks.metaobjectFieldsComplete.details = {
            fieldCount: existingKeys.size,
            fields: Array.from(existingKeys),
          };
        }
      }
    } catch (error: any) {
      checks.metaobjectDefinitionExists.passed = false;
      checks.metaobjectDefinitionExists.message = `Failed to check metaobject definition: ${error.message}`;
      errors.push(`Error checking metaobject definition: ${error.message}`);
    }

    // ===================================
    // CHECK 3: Shopify Function Deployed
    // ===================================
    try {
      const functionsResponse = await client.query<any>(FIND_SHOPIFY_FUNCTION_QUERY, {});
      const functions = functionsResponse.data?.shopifyFunctions?.edges || [];

      // Look for bundle-discount function
      const bundleDiscountFunction = functions.find(
        (edge: any) =>
          edge.node.appBridge?.handle === 'bundle-discount' ||
          edge.node.title?.toLowerCase().includes('bundle') ||
          edge.node.title?.toLowerCase().includes('discount')
      );

      if (!bundleDiscountFunction) {
        checks.discountFunctionDeployed.passed = false;
        checks.discountFunctionDeployed.message = 'Shopify Function "bundle-discount" not found';
        checks.discountFunctionDeployed.details = {
          availableFunctions: functions.map((edge: any) => ({
            id: edge.node.id,
            title: edge.node.title,
            handle: edge.node.appBridge?.handle,
            apiType: edge.node.apiType,
          })),
        };
        errors.push(
          'Shopify Function "bundle-discount" is not deployed. Run "npm run shopify app deploy" to deploy it.'
        );
      } else {
        checks.discountFunctionDeployed.passed = true;
        checks.discountFunctionDeployed.message = 'Shopify Function "bundle-discount" is deployed';
        checks.discountFunctionDeployed.details = {
          functionId: bundleDiscountFunction.node.id,
          title: bundleDiscountFunction.node.title,
          handle: bundleDiscountFunction.node.appBridge?.handle,
          apiType: bundleDiscountFunction.node.apiType,
          apiVersion: bundleDiscountFunction.node.apiVersion,
        };

        // Validate it's the right type
        if (bundleDiscountFunction.node.apiType !== 'product_discounts') {
          warnings.push(
            `Function found but has unexpected apiType: ${bundleDiscountFunction.node.apiType}. Expected: product_discounts`
          );
        }
      }
    } catch (error: any) {
      checks.discountFunctionDeployed.passed = false;
      checks.discountFunctionDeployed.message = `Failed to check Shopify Functions: ${error.message}`;
      errors.push(`Error checking Shopify Functions: ${error.message}`);
    }
  } catch (error: any) {
    console.error('[validate-publish-readiness] Error:', error);
    checks.sessionValid.passed = false;
    checks.sessionValid.message = `Session error: ${error.message}`;
    errors.push(`Session validation failed: ${error.message}`);
  }

  // Determine overall readiness
  const ready =
    checks.metaobjectDefinitionExists.passed &&
    checks.metaobjectFieldsComplete.passed &&
    checks.discountFunctionDeployed.passed &&
    checks.sessionValid.passed;

  const result: ValidationResult = {
    ready,
    checks,
    errors,
    warnings,
  };

  return sendSuccess(res, result);
}

export default withShopAuth(handler, {
  methods: ['GET'],
});

export const config = {
  api: {
    externalResolver: true,
  },
};

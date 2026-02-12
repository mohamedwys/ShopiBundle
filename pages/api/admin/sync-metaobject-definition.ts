/**
 * Sync Metaobject Definition API
 *
 * POST /api/admin/sync-metaobject-definition
 *
 * Ensures the "product-bundles" metaobject definition includes all required fields.
 * Safe to run multiple times (idempotent). Returns diff report of what was added.
 *
 * This fixes Error 1: "Field definition 'bundle_type' does not exist"
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  withShopAuth,
  ApiContext,
  sendSuccess,
  sendError,
} from '@/lib/middleware/with-shop-auth';
import { createShopifyClient } from '@/lib/shopify/client';

// Expected field definitions for product-bundles metaobject
const REQUIRED_FIELDS = [
  {
    key: 'bundle_name',
    name: 'Bundle Name',
    type: 'single_line_text_field',
    description: 'Name of The Bundle',
    required: true,
  },
  {
    key: 'bundle_title',
    name: 'Bundle Title',
    type: 'single_line_text_field',
    description: 'Title of the Bundle',
    required: true,
  },
  {
    key: 'bundle_type',
    name: 'Bundle Type',
    type: 'single_line_text_field',
    description: 'Bundle type: FIXED, TIERED, BOGO, MIX_MATCH, BUILD_YOUR_OWN, SUBSCRIPTION, GIFT',
    required: false,
  },
  {
    key: 'description',
    name: 'Description',
    type: 'multi_line_text_field',
    description: 'Description for a Bundle',
    required: true,
  },
  {
    key: 'created_at',
    name: 'Created At',
    type: 'date_time',
    description: 'Bundle Creation Time',
    required: true,
  },
  {
    key: 'discount',
    name: 'Discount',
    type: 'number_integer',
    description: 'Discount Percentage for the Bundle',
    required: true,
  },
  {
    key: 'products',
    name: 'Products',
    type: 'list.product_reference',
    description: 'Products in the Bundle',
    required: true,
  },
  {
    key: 'selection_rules',
    name: 'Selection Rules',
    type: 'json',
    description: 'JSON config for MIX_MATCH/BUILD_YOUR_OWN product selection constraints',
    required: false,
  },
  {
    key: 'gift_settings',
    name: 'Gift Settings',
    type: 'json',
    description: 'JSON config for GIFT bundle message and wrapping options',
    required: false,
  },
  {
    key: 'subscription_settings',
    name: 'Subscription Settings',
    type: 'json',
    description: 'JSON config for SUBSCRIPTION bundle delivery frequencies',
    required: false,
  },
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
            type {
              name
            }
          }
        }
      }
    }
  }
`;

const CREATE_DEFINITION_MUTATION = `
  mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
    metaobjectDefinitionCreate(definition: $definition) {
      metaobjectDefinition {
        id
        type
        name
        fieldDefinitions {
          key
          name
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

const UPDATE_DEFINITION_MUTATION = `
  mutation UpdateBundleMetaobjectDefinition($id: ID!, $definition: MetaobjectDefinitionUpdateInput!) {
    metaobjectDefinitionUpdate(id: $id, definition: $definition) {
      metaobjectDefinition {
        id
        type
        name
        fieldDefinitions {
          key
          name
          type {
            name
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

interface SyncResult {
  status: 'created' | 'updated' | 'no_changes';
  definitionId: string;
  existingFields: string[];
  addedFields: string[];
  missingFields: string[];
  allFields: string[];
}

async function handler(ctx: ApiContext): Promise<void> {
  const { shop, req, res } = ctx;

  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const client = createShopifyClient(shop);

    // 1. Find existing metaobject definition
    const defsResponse = await client.query<any>(FIND_DEFINITION_QUERY, {});
    const definitions = defsResponse.data?.metaobjectDefinitions?.edges || [];

    const bundleDef = definitions.find(
      (edge: any) => edge.node.type === 'product-bundles'
    );

    let result: SyncResult;

    if (!bundleDef) {
      // 2a. Definition doesn't exist - create it
      console.log('[sync-metaobject] Creating new product-bundles definition');

      const createResponse = await client.mutate<any>(CREATE_DEFINITION_MUTATION, {
        definition: {
          name: 'Product Bundles',
          type: 'product-bundles',
          description: 'Products Bundles',
          access: {
            storefront: 'PUBLIC_READ',
          },
          capabilities: {
            publishable: {
              enabled: true,
            },
          },
          fieldDefinitions: REQUIRED_FIELDS.map((f) => ({
            name: f.name,
            key: f.key,
            description: f.description,
            required: f.required,
            type: f.type,
          })),
        },
      });

      const createResult = createResponse.data?.metaobjectDefinitionCreate;
      if (createResult?.userErrors?.length > 0) {
        throw new Error(createResult.userErrors.map((e: any) => e.message).join(', '));
      }

      result = {
        status: 'created',
        definitionId: createResult.metaobjectDefinition.id,
        existingFields: [],
        addedFields: REQUIRED_FIELDS.map((f) => f.key),
        missingFields: [],
        allFields: REQUIRED_FIELDS.map((f) => f.key),
      };
    } else {
      // 2b. Definition exists - check for missing fields
      const definitionId = bundleDef.node.id;
      const existingKeys = new Set<string>(bundleDef.node.fieldDefinitions.map((f: any) => f.key as string));
      const existingFieldsList: string[] = Array.from(existingKeys);

      const missingFields = REQUIRED_FIELDS.filter((f) => !existingKeys.has(f.key));

      if (missingFields.length === 0) {
        console.log('[sync-metaobject] All fields already exist. No changes needed.');
        result = {
          status: 'no_changes',
          definitionId,
          existingFields: existingFieldsList,
          addedFields: [],
          missingFields: [],
          allFields: existingFieldsList,
        };
      } else {
        // 2c. Update definition with missing fields
        console.log(`[sync-metaobject] Adding ${missingFields.length} missing fields: ${missingFields.map((f) => f.key).join(', ')}`);

        const updateResponse = await client.mutate<any>(UPDATE_DEFINITION_MUTATION, {
          id: definitionId,
          definition: {
            fieldDefinitions: missingFields.map((f) => ({
              create: {
                key: f.key,
                name: f.name,
                type: f.type,
                description: f.description,
                required: f.required,
              },
            })),
          },
        });

        const updateResult = updateResponse.data?.metaobjectDefinitionUpdate;
        if (updateResult?.userErrors?.length > 0) {
          throw new Error(updateResult.userErrors.map((e: any) => e.message).join(', '));
        }

        const allFieldsAfterUpdate = updateResult.metaobjectDefinition.fieldDefinitions.map(
          (f: any) => f.key
        );

        result = {
          status: 'updated',
          definitionId,
          existingFields: existingFieldsList,
          addedFields: missingFields.map((f) => f.key),
          missingFields: [],
          allFields: allFieldsAfterUpdate,
        };
      }
    }

    return sendSuccess(res, {
      message:
        result.status === 'created'
          ? 'Metaobject definition created successfully'
          : result.status === 'updated'
          ? 'Metaobject definition updated successfully'
          : 'Metaobject definition is up to date',
      ...result,
    });
  } catch (error: any) {
    console.error('[sync-metaobject] Error:', error);
    return sendError(res, `Failed to sync metaobject definition: ${error.message}`, 500);
  }
}

export default withShopAuth(handler, {
  methods: ['POST'],
});

export const config = {
  api: {
    externalResolver: true,
  },
};

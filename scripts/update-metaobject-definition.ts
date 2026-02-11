/**
 * One-time migration script to add new metaobject fields.
 *
 * Run this once per shop after deploying the new schema.
 * The metaobject definition update is idempotent — running it
 * multiple times is safe (existing fields won't be duplicated).
 *
 * Usage: npx ts-node scripts/update-metaobject-definition.ts <shop-domain>
 */

import clientProvider from '@/utils/clientProvider';

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

const MUTATION = `
  mutation UpdateBundleMetaobjectDefinition($id: ID!, $definition: MetaobjectDefinitionUpdateInput!) {
    metaobjectDefinitionUpdate(id: $id, definition: $definition) {
      metaobjectDefinition {
        id
        type
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

// New field definitions to add
const NEW_FIELDS = [
  {
    key: 'bundle_type',
    name: 'Bundle Type',
    type: 'single_line_text_field',
    description: 'Bundle type: FIXED, TIERED, BOGO, MIX_MATCH, BUILD_YOUR_OWN, SUBSCRIPTION, GIFT',
  },
  {
    key: 'selection_rules',
    name: 'Selection Rules',
    type: 'json',
    description: 'JSON config for MIX_MATCH/BUILD_YOUR_OWN product selection constraints',
  },
  {
    key: 'gift_settings',
    name: 'Gift Settings',
    type: 'json',
    description: 'JSON config for GIFT bundle message and wrapping options',
  },
  {
    key: 'subscription_settings',
    name: 'Subscription Settings',
    type: 'json',
    description: 'JSON config for SUBSCRIPTION bundle delivery frequencies',
  },
];

async function main() {
  const shopDomain = process.argv[2];
  if (!shopDomain) {
    console.error('Usage: npx ts-node scripts/update-metaobject-definition.ts <shop-domain>');
    process.exit(1);
  }

  console.log(`Updating metaobject definition for shop: ${shopDomain}`);

  // Get offline client
  const { client } = await clientProvider.offline.graphqlClient({ shop: shopDomain });

  // Find the product-bundles metaobject definition
  const defsResponse: any = await client.request(FIND_DEFINITION_QUERY);
  const definitions = defsResponse.data?.metaobjectDefinitions?.edges || [];

  const bundleDef = definitions.find(
    (edge: any) => edge.node.type === 'product-bundles'
  );

  if (!bundleDef) {
    console.error('No "product-bundles" metaobject definition found. Has the app been installed?');
    process.exit(1);
  }

  const definitionId = bundleDef.node.id;
  const existingKeys = new Set(bundleDef.node.fieldDefinitions.map((f: any) => f.key));

  // Filter to only fields that don't already exist
  const fieldsToAdd = NEW_FIELDS.filter((f) => !existingKeys.has(f.key));

  if (fieldsToAdd.length === 0) {
    console.log('All fields already exist. Nothing to update.');
    return;
  }

  console.log(`Adding ${fieldsToAdd.length} new fields: ${fieldsToAdd.map((f) => f.key).join(', ')}`);

  // Execute the mutation
  const response: any = await client.request(MUTATION, {
    variables: {
      id: definitionId,
      definition: {
        fieldDefinitions: fieldsToAdd.map((f) => ({
          create: {
            key: f.key,
            name: f.name,
            type: f.type,
            description: f.description,
          },
        })),
      },
    },
  });

  const result = response.data?.metaobjectDefinitionUpdate;
  if (!result) {
    console.error('No response from mutation');
    process.exit(1);
  }

  if (result.userErrors?.length > 0) {
    console.error('Mutation errors:', result.userErrors);
    process.exit(1);
  }

  console.log('Metaobject definition updated successfully.');
  console.log('Fields:', result.metaobjectDefinition.fieldDefinitions.map((f: any) => f.key).join(', '));
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

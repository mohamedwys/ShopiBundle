/**
 * One-time migration script to add new metaobject fields.
 *
 * Run this once per shop after deploying the new schema.
 * The metaobject definition update is idempotent — running it
 * multiple times is safe (existing fields won't be duplicated).
 *
 * Usage: npx ts-node scripts/update-metaobject-definition.ts <shop-domain>
 */

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

console.log('Metaobject definition update mutation:');
console.log(JSON.stringify({ mutation: MUTATION, newFields: NEW_FIELDS }, null, 2));
console.log('\nRun this mutation via the Shopify Admin GraphQL API.');
console.log('First, find the metaobject definition ID:');
console.log('  query { metaobjectDefinitions(first: 10) { edges { node { id type } } } }');
console.log('Then call metaobjectDefinitionUpdate with the ID and new fieldDefinitions.');

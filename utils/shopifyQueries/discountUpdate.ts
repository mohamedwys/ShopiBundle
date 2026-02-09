import { GraphqlClient } from "@shopify/shopify-api";

/**
 * Update a Function-based automatic discount's bundle configuration.
 *
 * Rewrites the metafield with the new discount value so the Function
 * applies the updated percentage at checkout time.
 */
export async function discountUpdate(
  client: GraphqlClient,
  id: string,
  discount: string,
  products?: string[],
  bundleId?: string
) {
  // Build updated bundle config for the Function
  const bundleConfig = {
    bundleId: bundleId || id,
    bundles: [
      {
        minBundleSets: 1,
        maxBundleSets: 0,
        components: (products || []).map((productId) => ({
          productId,
          quantity: 1,
        })),
        discount: {
          type: "percentage" as const,
          value: parseFloat(discount),
        },
      },
    ],
  };

  await client.query({
    data: {
      query: `mutation discountAutomaticAppUpdate($id: ID!, $automaticAppDiscount: DiscountAutomaticAppInput!) {
        discountAutomaticAppUpdate(id: $id, automaticAppDiscount: $automaticAppDiscount) {
          automaticAppDiscount {
            discountId
          }
          userErrors {
            field
            code
            message
          }
        }
      }`,
      variables: {
        id: id,
        automaticAppDiscount: {
          metafields: [
            {
              namespace: "shopibundle",
              key: "bundle_config",
              type: "json",
              value: JSON.stringify(bundleConfig),
            },
          ],
        },
      },
    },
  });
}

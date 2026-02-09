import { GraphqlClient } from "@shopify/shopify-api";

// Bundle data to create a Function-based discount
export interface BundleDiscountData {
  title: string;
  discount: string;
  products: Array<string>;
  minProducts: string;
  /** Optional: bundle ID from the app's database */
  bundleId?: string;
}

// Discount create return data type (Function-based)
export type discountCreateMutation = {
  data: {
    discountAutomaticAppCreate: {
      automaticAppDiscount: {
        discountId: string;
      };
      userErrors: Array<any>;
    };
  };
};

/**
 * Create a Function-based automatic discount for a bundle.
 *
 * Uses discountAutomaticAppCreate which links to the bundle-discount Function.
 * The Function validates that ALL bundle products and quantities are in the cart
 * before applying the discount.
 *
 * Bundle configuration is stored in the discount's metafield (shopibundle.bundle_config)
 * which the Function reads via its input query.
 */
export async function discountCreate(
  client: GraphqlClient,
  data: BundleDiscountData
) {
  // Build the bundle config that the Function will read
  const bundleConfig = {
    bundleId: data.bundleId || data.title,
    bundles: [
      {
        minBundleSets: 1,
        maxBundleSets: 0, // unlimited
        components: data.products.map((productId) => ({
          productId,
          quantity: 1,
        })),
        discount: {
          type: "percentage" as const,
          value: parseFloat(data.discount),
        },
      },
    ],
  };

  const { body } = await client.query<discountCreateMutation>({
    data: {
      query: `mutation discountAutomaticAppCreate($automaticAppDiscount: DiscountAutomaticAppInput!) {
        discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) {
          automaticAppDiscount {
            discountId
          }
          userErrors {
            field
            message
          }
        }
      }`,
      variables: {
        automaticAppDiscount: {
          title: data.title,
          functionId: "bundle-discount",
          startsAt: new Date().toISOString(),
          combinesWith: {
            productDiscounts: false,
            orderDiscounts: false,
            shippingDiscounts: true,
          },
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

  return body.data?.discountAutomaticAppCreate.automaticAppDiscount.discountId;
}

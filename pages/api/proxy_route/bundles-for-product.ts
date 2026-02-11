import type { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";

/**
 * Proxy route to find bundles containing a specific product.
 * Called from storefront JavaScript via Shopify App Proxy.
 *
 * The verifyProxy middleware validates the Shopify signature and sets
 * req.user_shop to the authenticated shop domain. This prevents:
 * - Unsigned requests from arbitrary sources
 * - Cross-shop data access (requesting another shop's bundles)
 *
 * Query params (provided by Shopify proxy + widget):
 *   - product_id: The Shopify product ID to find bundles for
 *   - shop: Shop domain (verified by middleware via HMAC signature)
 *   - signature: Shopify HMAC signature (verified by middleware)
 *   - timestamp: Request timestamp (verified by middleware)
 */
async function handler(
  req: NextApiRequest & { user_shop?: string },
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { product_id } = req.query;
    // Use the verified shop from middleware, NOT from the raw query string.
    // This prevents cross-shop data access attacks.
    const shop = req.user_shop;

    if (!product_id) {
      return res.status(400).json({ error: "Missing product_id" });
    }

    if (!shop) {
      return res.status(401).json({ error: "Shop not verified" });
    }

    // Get offline client for the verified shop
    let client;
    try {
      const result = await clientProvider.offline.graphqlClient({
        shop: shop,
      });
      client = result.client;
    } catch (sessionError: any) {
      // Session not found - shop may have uninstalled or not completed OAuth
      // Return empty array instead of error for storefront
      return res.status(200).json([]);
    }

    // Query all bundles and filter by product
    const query = `
      query GetBundles($first: Int!, $type: String!) {
        metaobjects(type: $type, first: $first) {
          edges {
            node {
              id
              handle
              fields {
                key
                value
              }
            }
          }
        }
      }
    `;

    const response: any = await client.request(query, {
      variables: {
        type: "product-bundles",
        first: 250,
      },
    });

    const bundles = [];
    const normalizedProductId = product_id.toString();

    // Filter bundles that contain this product
    for (const edge of response.data.metaobjects.edges) {
      const bundle = edge.node;
      const fields: any = {};

      for (const field of bundle.fields) {
        fields[field.key] = field.value;
      }

      // Check if product is in bundle
      if (fields.products) {
        let products = [];
        try {
          products = JSON.parse(fields.products);
        } catch (e) {
          products = fields.products;
        }

        // Check if any product ID matches
        const hasProduct = products.some((pid: string) =>
          pid.includes(normalizedProductId) || normalizedProductId.includes(pid)
        );

        if (hasProduct) {
          bundles.push({
            id: bundle.handle,
            type: fields.bundle_type || 'FIXED',
            title: fields.bundle_title || fields.bundle_name,
            discount: fields.discount,
            description: fields.description,
            products: products,
            hasSelectionRules: !!fields.selection_rules,
            hasGiftSettings: !!fields.gift_settings,
            hasSubscriptionSettings: !!fields.subscription_settings,
          });
        }
      }
    }

    // Cache for 5 minutes on CDN
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.setHeader("Vary", "Accept-Encoding");

    return res.status(200).json(bundles);
  } catch (error) {
    console.error("Error fetching bundles for product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default withMiddleware("verifyProxy")(handler);

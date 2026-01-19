import { NextApiHandler } from "next";
import clientProvider from "@/utils/clientProvider";
import prisma from "@/utils/prisma";

/**
 * Proxy route to find bundles containing a specific product
 * Called from storefront JavaScript
 */
const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { product_id } = req.query;
    const shop = req.query.shop || req.headers["x-shopify-shop"];

    if (!product_id || !shop) {
      return res.status(400).json({ error: "Missing product_id or shop" });
    }

    // Get offline client for the shop
    const { client } = await clientProvider.offline.graphqlClient(
      shop as string
    );

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
        first: 50,
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
            title: fields.bundle_title || fields.bundle_name,
            discount: fields.discount,
            description: fields.description,
            products: products,
          });
        }
      }
    }

    return res.status(200).json(bundles);
  } catch (error) {
    console.error("Error fetching bundles for product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;

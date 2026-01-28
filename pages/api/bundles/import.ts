import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { NextApiHandler } from "next";
import { createBundle, discountCreate } from "@/utils/shopifyQueries";
import prisma from "@/utils/prisma";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  const { client, shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: false,
  });

  try {
    const { bundles } = JSON.parse(req.body);

    if (!Array.isArray(bundles) || bundles.length === 0) {
      return res.status(400).send("message: Invalid bundles data");
    }

    const results = {
      success: [],
      failed: [],
    };

    for (const bundleData of bundles) {
      try {
        // Validate required fields
        if (
          !bundleData.name ||
          !bundleData.title ||
          !bundleData.discount ||
          !bundleData.products ||
          bundleData.products.length === 0
        ) {
          results.failed.push({
            bundle: bundleData.name || "Unknown",
            error: "Missing required fields",
          });
          continue;
        }

        // Create bundle metaobject
        const handle = await createBundle(client, {
          bundleName: bundleData.name,
          bundleTitle: bundleData.title,
          description: bundleData.description || "",
          discount: bundleData.discount.toString(),
          products: bundleData.products,
        });

        // Create discount
        const discountId = await discountCreate(client, {
          title: `Bundle Discount - ${bundleData.name}`,
          discount: bundleData.discount.toString(),
          products: bundleData.products,
          minProducts: bundleData.products.length.toString(),
        });

        // Store bundle-discount mapping
        const bundleId = `gid://shopify/Metaobject/${handle}`;
        await prisma.bundle_discount_id.create({
          data: {
            bundleId: bundleId,
            bundleName: bundleData.name,
            discountId: discountId,
            shop: shop,
          },
        });

        results.success.push(bundleData.name);
      } catch (error) {
        console.error(`Error importing bundle ${bundleData.name}:`, error);
        results.failed.push({
          bundle: bundleData.name || "Unknown",
          error: error.message || "Unknown error",
        });
      }
    }

    return res.status(200).json({
      message: "Import completed",
      results,
    });
  } catch (error) {
    console.error("Error importing bundles:", error);
    return res.status(500).send("message: Error while importing bundles");
  }
};

export const config = {
  api: {
    externalResolver: true,
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default withMiddleware("verifyRequest")(handler);

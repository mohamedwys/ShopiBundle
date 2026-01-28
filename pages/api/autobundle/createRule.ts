import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { NextApiHandler } from "next";
import prisma from "@/utils/prisma";
import {
  discountCreate,
  getProductsByCollection,
} from "@/utils/shopifyQueries";
import { GetByCollectionProducts } from "../saveAutoBundleData";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  const { client, shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: false,
  });

  const data = JSON.parse(req.body);

  try {
    // Validate required fields
    if (!data.name || data.name.trim() === "") {
      return res.status(400).send("message: Rule name is required");
    }

    // Create auto bundle rule in database
    const rule = await prisma.auto_bundle_rules.create({
      data: {
        shop: shop,
        name: data.name,
        collections: data.collections || [],
        tags: data.tags || [],
        minPrice: data.minPrice || "0",
        maxPrice: data.maxPrice || "0",
        minProducts: data.minProducts || "2",
        discount: data.discount || "10",
        isActive: true,
      },
    });

    // Generate discount for the rule
    let collections = data.collections || [];
    if (collections.length === 0) {
      collections = data.allCollections || [];
    }

    let autoBundleProducts = [];

    // Filter through products and add products that match the requirements
    for (let collection of collections) {
      const response: GetByCollectionProducts = await getProductsByCollection(
        client,
        collection
      );

      if (response.length !== 0) {
        let products = response[0]["node"]["products"]["edges"];
        for (let productNode of products) {
          let product = productNode["node"];
          // check for required tags
          if (isHaveRequiredTags(data.tags || [], product.tags)) {
            let price = parseFloat(
              product["priceRangeV2"]["maxVariantPrice"].amount
            );
            // check for required price
            if (
              isHaveRequiredPrice(
                price,
                parseFloat(data.minPrice || "0"),
                parseFloat(data.maxPrice || "0")
              )
            ) {
              autoBundleProducts.push(product.id);
            }
          }
        }
      }
    }

    // Create discount if we have products
    if (autoBundleProducts.length > 0) {
      const discountId = await discountCreate(client, {
        title: `Auto Bundle: ${data.name}`,
        discount: data.discount,
        products: autoBundleProducts,
        minProducts: data.minProducts,
      });

      // Store the discount mapping
      await prisma.bundle_discount_id.create({
        data: {
          bundleId: `auto-rule-${rule.id}`,
          bundleName: data.name,
          discountId: discountId,
          shop: shop,
        },
      });
    }

    return res.status(200).json({ success: true, rule });
  } catch (error) {
    console.error("Exception while creating auto bundle rule:", error);
    return res
      .status(500)
      .send("message: Error while creating auto bundle rule");
  }
};

// Helper functions
function isHaveRequiredTags(requiredTags: string[], productTags: string[]) {
  if (requiredTags.length === 0) {
    return true;
  }
  for (let requiredTag of requiredTags) {
    if (productTags.includes(requiredTag)) {
      return true;
    }
  }
  return false;
}

function isHaveRequiredPrice(
  price: number,
  minPrice: number,
  maxPrice: number
) {
  if (price >= minPrice && price <= maxPrice) {
    return true;
  } else if (price >= minPrice && maxPrice === 0) {
    return true;
  } else if (minPrice === 0 && maxPrice === 0) {
    return true;
  }
  return false;
}

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withMiddleware("verifyRequest")(handler);

import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { NextApiHandler } from "next";
import { getProductsByCollection } from "@/utils/shopifyQueries";
import { GetByCollectionProducts } from "../saveAutoBundleData";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  const { client } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: false,
  });

  const data = JSON.parse(req.body);

  try {
    let collections = data.collections || [];

    // If no collections selected, preview would show all products
    if (collections.length === 0) {
      collections = data.allCollections || [];
    }

    let matchedProducts = [];
    let totalProductsScanned = 0;

    // Filter through products and find matches
    for (let collection of collections.slice(0, 10)) {
      // Limit to 10 collections for preview
      const response: GetByCollectionProducts = await getProductsByCollection(
        client,
        collection
      );

      if (response.length !== 0) {
        let products = response[0]["node"]["products"]["edges"];
        totalProductsScanned += products.length;

        for (let productNode of products) {
          let product = productNode["node"];

          // Check for required tags
          if (isHaveRequiredTags(data.tags || [], product.tags)) {
            let price = parseFloat(
              product["priceRangeV2"]["maxVariantPrice"].amount
            );

            // Check for required price
            if (
              isHaveRequiredPrice(
                price,
                parseFloat(data.minPrice || "0"),
                parseFloat(data.maxPrice || "0")
              )
            ) {
              // Get product details
              const productQuery = `
                query GetProduct($id: ID!) {
                  product(id: $id) {
                    id
                    title
                    handle
                    featuredImage {
                      url
                    }
                    priceRangeV2 {
                      maxVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              `;

              const productDetails: any = await client.request(productQuery, {
                variables: { id: product.id },
              });

              if (productDetails.data?.product) {
                matchedProducts.push({
                  id: productDetails.data.product.id,
                  title: productDetails.data.product.title,
                  handle: productDetails.data.product.handle,
                  image: productDetails.data.product.featuredImage?.url || null,
                  price: productDetails.data.product.priceRangeV2.maxVariantPrice.amount,
                  currency: productDetails.data.product.priceRangeV2.maxVariantPrice.currencyCode,
                  tags: product.tags,
                });

                // Limit preview to 20 products
                if (matchedProducts.length >= 20) break;
              }
            }
          }
        }
        if (matchedProducts.length >= 20) break;
      }
    }

    const summary = {
      totalMatched: matchedProducts.length,
      totalScanned: totalProductsScanned,
      meetsMinimum:
        matchedProducts.length >= parseInt(data.minProducts || "2"),
      estimatedDiscount: data.discount,
      criteria: {
        collections:
          collections.length > 0
            ? collections.join(", ")
            : "All collections",
        tags:
          data.tags && data.tags.length > 0
            ? data.tags.join(", ")
            : "All tags",
        priceRange: `${data.minPrice || "0"} - ${data.maxPrice || "∞"}`,
        minProducts: data.minProducts || "2",
      },
    };

    return res.status(200).json({
      products: matchedProducts,
      summary,
    });
  } catch (error) {
    console.error("Exception while previewing auto bundle:", error);
    return res
      .status(500)
      .send("message: Error while previewing auto bundle");
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

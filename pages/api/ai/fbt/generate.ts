import type { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "@/utils/middleware/withMiddleware";
import { PrismaClient } from "@prisma/client";
import clientProvider from "@/utils/clientProvider";
import { getOrders } from "@/utils/shopifyQueries/getOrders";
import { AprioriAlgorithm, Transaction } from "@/utils/ai/apriori";
import { createBundle } from "@/utils/shopifyQueries/createBundle";
import { discountCreate } from "@/utils/shopifyQueries/discountCreate";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { shop } = req.body;

  if (!shop) {
    return res.status(400).json({ error: "Shop is required" });
  }

  try {
    const config = await prisma.ai_fbt_config.findUnique({
      where: { shop },
    });

    if (!config || !config.isEnabled) {
      return res.status(400).json({ error: "AI FBT is not enabled for this shop" });
    }

    const { client } = await clientProvider.offline.graphqlClient({ shop });
    if (!client) {
      return res.status(500).json({ error: "Failed to get Shopify client" });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - config.lookbackDays);
    const startDateStr = startDate.toISOString().split("T")[0];

    const transactions: Transaction[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;
    let totalOrders = 0;

    while (hasNextPage && totalOrders < 10000) {
      const { orders, hasNextPage: nextPage, endCursor } = await getOrders(
        client,
        startDateStr,
        cursor,
        250
      );

      for (const order of orders) {
        const items = order.lineItems.edges
          .filter((edge) => edge.node.product?.id)
          .map((edge) => edge.node.product!.id.replace("gid://shopify/Product/", ""));

        if (items.length >= 2) {
          transactions.push({
            orderId: order.id,
            items: Array.from(new Set(items)),
            timestamp: new Date(order.createdAt),
          });
        }
      }

      hasNextPage = nextPage;
      cursor = endCursor;
      totalOrders += orders.length;

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (transactions.length < 10) {
      return res.status(400).json({
        error: "Not enough order data for AI analysis",
        transactionsFound: transactions.length,
      });
    }

    const apriori = new AprioriAlgorithm(
      transactions,
      config.minSupport,
      config.minConfidence,
      config.minLift
    );

    const suggestions = apriori.generateFBTSuggestions(config.maxBundlesPerProduct);

    await prisma.ai_fbt_bundles.updateMany({
      where: {
        shop,
        isManualOverride: false,
      },
      data: {
        isActive: false,
      },
    });

    const createdBundles = [];

    for (const suggestion of suggestions) {
      const variantGroupId = `variant_${Math.random().toString(36).substr(2, 9)}`;

      const bundleData = {
        bundleName: `AI FBT Bundle ${suggestion.productId}`,
        bundleTitle: "Frequently Bought Together",
        description: `AI-generated bundle with ${(suggestion.confidence * 100).toFixed(1)}% confidence`,
        discount: "10",
        products: [
          `gid://shopify/Product/${suggestion.productId}`,
          ...suggestion.bundledProducts.map((p) => `gid://shopify/Product/${p}`),
        ],
      };

      let bundleMetaobjectId: string | null = null;
      let discountId: string | null = null;

      try {
        const bundleResult = await createBundle(client, bundleData);
        if (bundleResult) {
          bundleMetaobjectId = bundleResult.bundleId;

          const discountResult = await discountCreate(client, {
            title: bundleResult.discountTitle,
            discount: bundleData.discount,
            products: bundleData.products,
            minProducts: String(bundleData.products.length),
          });

          if (discountResult) {
            discountId = discountResult;

            await prisma.bundle_discount_id.create({
              data: {
                bundleId: bundleMetaobjectId,
                bundleName: bundleData.bundleName,
                discountId: discountId,
                shop,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error creating bundle:", error);
      }

      const bundle = await prisma.ai_fbt_bundles.create({
        data: {
          shop,
          productId: suggestion.productId,
          bundledProductIds: suggestion.bundledProducts,
          confidenceScore: suggestion.confidence,
          support: suggestion.support,
          lift: suggestion.lift,
          source: "AI",
          variantGroupId,
          bundleMetaobjectId,
          discountId,
          isActive: true,
        },
      });

      createdBundles.push(bundle);
    }

    await prisma.ai_fbt_config.update({
      where: { shop },
      data: {
        lastGeneratedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      bundlesCreated: createdBundles.length,
      transactionsAnalyzed: transactions.length,
      bundles: createdBundles,
    });
  } catch (error: any) {
    console.error("AI FBT generation error:", error);
    return res.status(500).json({
      error: "Failed to generate AI bundles",
      message: error.message,
    });
  }
}

export default withMiddleware("verifyRequest")(handler);

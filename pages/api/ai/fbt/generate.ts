import {
  withShopAuth,
  ApiContext,
  sendSuccess,
  sendError,
} from "@/lib/middleware/with-shop-auth";
import prisma from "@/utils/prisma";
import clientProvider from "@/utils/clientProvider";
import { getOrders } from "@/utils/shopifyQueries/getOrders";
import { AprioriAlgorithm, Transaction } from "@/utils/ai/apriori";
import { createBundle } from "@/utils/shopifyQueries/createBundle";
import { discountCreate } from "@/utils/shopifyQueries/discountCreate";

async function handler(ctx: ApiContext): Promise<void> {
  const { shop, req, res } = ctx;

  try {
    const config = await prisma.ai_fbt_config.findUnique({
      where: { shop },
    });

    if (!config || !config.isEnabled) {
      return sendError(res, "AI FBT is not enabled for this shop", 400);
    }

    const { client } = await clientProvider.offline.graphqlClient({ shop });
    if (!client) {
      return sendError(res, "Failed to get Shopify client - please reinstall the app", 500);
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
      return sendError(res, `Not enough order data for AI analysis (found ${transactions.length} transactions)`, 400);
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

    return sendSuccess(res, {
      bundlesCreated: createdBundles.length,
      transactionsAnalyzed: transactions.length,
      bundles: createdBundles,
    });
  } catch (error: any) {
    console.error("AI FBT generation error:", error);
    return sendError(res, "Failed to generate AI bundles", 500);
  }
}

export default withShopAuth(handler, {
  methods: ["POST"],
});

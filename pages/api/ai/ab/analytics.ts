import {
  withShopAuth,
  ApiContext,
  sendSuccess,
  sendError,
} from "@/lib/middleware/with-shop-auth";
import prisma from "@/utils/prisma";

async function handler(ctx: ApiContext): Promise<void> {
  const { shop, req, res } = ctx;

  if (req.method !== "GET") {
    return sendError(res, "Method not allowed", 405);
  }

  const productId = req.query.productId as string;

  const where: any = { shop };
  if (productId) {
    where.productId = productId;
  }

  const events = await prisma.ai_bundle_events.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const variantStats = new Map<
    string,
    {
      impressions: number;
      clicks: number;
      addToCarts: number;
      purchases: number;
    }
  >();

  for (const event of events) {
    const variantId = event.variantGroupId || "unknown";
    if (!variantStats.has(variantId)) {
      variantStats.set(variantId, {
        impressions: 0,
        clicks: 0,
        addToCarts: 0,
        purchases: 0,
      });
    }

    const stats = variantStats.get(variantId)!;
    if (event.eventType === "impression") stats.impressions++;
    if (event.eventType === "click") stats.clicks++;
    if (event.eventType === "add_to_cart") stats.addToCarts++;
    if (event.eventType === "purchase") stats.purchases++;
  }

  const analytics = Array.from(variantStats.entries()).map(
    ([variantGroupId, stats]) => ({
      variantGroupId,
      ...stats,
      ctr: stats.impressions > 0 ? stats.clicks / stats.impressions : 0,
      conversionRate:
        stats.impressions > 0 ? stats.purchases / stats.impressions : 0,
    })
  );

  return sendSuccess(res, { analytics, totalEvents: events.length });
}

export default withShopAuth(handler, {
  methods: ["GET"],
});

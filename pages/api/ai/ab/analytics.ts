import type { NextApiRequest, NextApiResponse } from "next";
import { withMiddleware } from "@/utils/middleware/withMiddleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const shop = req.query.shop as string;
  const productId = req.query.productId as string;

  if (!shop) {
    return res.status(400).json({ error: "Shop is required" });
  }

  try {
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
        ctr: number;
        conversionRate: number;
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
          ctr: 0,
          conversionRate: 0,
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

    return res.status(200).json({
      analytics,
      totalEvents: events.length,
    });
  } catch (error: any) {
    console.error("A/B analytics error:", error);
    return res.status(500).json({
      error: "Failed to get A/B analytics",
      message: error.message,
    });
  }
}

export default withMiddleware("verifyRequest")(handler);

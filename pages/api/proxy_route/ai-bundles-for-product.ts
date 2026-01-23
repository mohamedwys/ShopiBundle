import type { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "@/utils/middleware/withMiddleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const shop = req.query.shop as string;
  const productId = req.query.productId as string;
  const sessionId = req.query.sessionId as string;

  if (!shop || !productId) {
    return res.status(400).json({ error: "Shop and productId are required" });
  }

  try {
    const config = await prisma.ai_fbt_config.findUnique({
      where: { shop },
    });

    if (!config || !config.isEnabled) {
      return res.status(200).json({ bundles: [], enabled: false });
    }

    let variantGroupId: string | null = null;

    if (sessionId) {
      const now = new Date();
      const assignment = await prisma.ai_bundle_ab_assignments.findFirst({
        where: {
          shop,
          sessionId,
          productId,
          expiresAt: { gt: now },
        },
      });

      if (assignment) {
        variantGroupId = assignment.variantGroupId;
      }
    }

    let bundles = await prisma.ai_fbt_bundles.findMany({
      where: {
        shop,
        productId,
        isActive: true,
        ...(variantGroupId ? { variantGroupId } : {}),
      },
      orderBy: { confidenceScore: "desc" },
      take: 3,
    });

    if (bundles.length === 0 && variantGroupId) {
      bundles = await prisma.ai_fbt_bundles.findMany({
        where: {
          shop,
          productId,
          isActive: true,
        },
        orderBy: { confidenceScore: "desc" },
        take: 3,
      });
    }

    return res.status(200).json({
      bundles: bundles.map((b) => ({
        id: b.id,
        productId: b.productId,
        bundledProductIds: b.bundledProductIds,
        confidenceScore: b.confidenceScore,
        variantGroupId: b.variantGroupId,
        bundleMetaobjectId: b.bundleMetaobjectId,
      })),
      enabled: true,
    });
  } catch (error: any) {
    console.error("Get AI bundles for product error:", error);
    return res.status(500).json({
      error: "Failed to get AI bundles",
      message: error.message,
    });
  }
}

export default withMiddleware("verifyProxy")(handler);

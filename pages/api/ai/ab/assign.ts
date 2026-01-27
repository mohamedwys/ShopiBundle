import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { shop, sessionId, productId } = req.body;

    if (!shop || !sessionId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const existingAssignment = await prisma.ai_bundle_ab_assignments.findFirst({
      where: {
        shop,
        sessionId,
        productId,
        expiresAt: { gt: now },
      },
    });

    if (existingAssignment) {
      return res.status(200).json({
        variantGroupId: existingAssignment.variantGroupId,
        existing: true,
      });
    }

    const aiBundles = await prisma.ai_fbt_bundles.findMany({
      where: {
        shop,
        productId,
        isActive: true,
      },
      orderBy: { confidenceScore: "desc" },
      take: 1,
    });

    if (aiBundles.length === 0) {
      return res.status(404).json({ error: "No AI bundles found for this product" });
    }

    const variantGroupId = aiBundles[0].variantGroupId || `variant_${Math.random().toString(36).substr(2, 9)}`;

    const assignment = await prisma.ai_bundle_ab_assignments.create({
      data: {
        shop,
        sessionId,
        productId,
        variantGroupId,
        expiresAt,
      },
    });

    return res.status(200).json({
      variantGroupId: assignment.variantGroupId,
      existing: false,
    });
  } catch (error: any) {
    console.error("A/B assignment error:", error);
    return res.status(500).json({
      error: "Failed to assign A/B variant",
      message: error.message,
    });
  }
}

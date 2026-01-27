import type { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "@/utils/middleware/withMiddleware";
import prisma from "@/utils/prisma";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bundleId, action, shop } = req.body;

  if (!bundleId || !action || !shop) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    if (action === "accept") {
      const bundle = await prisma.ai_fbt_bundles.update({
        where: { id: bundleId },
        data: {
          isActive: true,
          isManualOverride: true,
          lastUpdatedAt: new Date(),
        },
      });
      return res.status(200).json({ success: true, bundle });
    } else if (action === "reject") {
      const bundle = await prisma.ai_fbt_bundles.update({
        where: { id: bundleId },
        data: {
          isActive: false,
          isManualOverride: true,
          lastUpdatedAt: new Date(),
        },
      });
      return res.status(200).json({ success: true, bundle });
    } else if (action === "lock") {
      const bundle = await prisma.ai_fbt_bundles.update({
        where: { id: bundleId },
        data: {
          isManualOverride: true,
          lastUpdatedAt: new Date(),
        },
      });
      return res.status(200).json({ success: true, bundle });
    } else if (action === "unlock") {
      const bundle = await prisma.ai_fbt_bundles.update({
        where: { id: bundleId },
        data: {
          isManualOverride: false,
          lastUpdatedAt: new Date(),
        },
      });
      return res.status(200).json({ success: true, bundle });
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error: any) {
    console.error("Override AI bundle error:", error);
    return res.status(500).json({
      error: "Failed to override AI bundle",
      message: error.message,
    });
  }
}

export default withMiddleware("verifyRequest")(handler);

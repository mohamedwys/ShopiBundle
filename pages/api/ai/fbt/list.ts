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
  const isActive = req.query.isActive === "true";

  if (!shop) {
    return res.status(400).json({ error: "Shop is required" });
  }

  try {
    const where: any = { shop };

    if (productId) {
      where.productId = productId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const bundles = await prisma.ai_fbt_bundles.findMany({
      where,
      orderBy: [
        { isActive: "desc" },
        { confidenceScore: "desc" },
        { generatedAt: "desc" },
      ],
    });

    const config = await prisma.ai_fbt_config.findUnique({
      where: { shop },
    });

    return res.status(200).json({
      bundles,
      config,
    });
  } catch (error: any) {
    console.error("List AI bundles error:", error);
    return res.status(500).json({
      error: "Failed to list AI bundles",
      message: error.message,
    });
  }
}

export default withMiddleware("verifyRequest")(handler);

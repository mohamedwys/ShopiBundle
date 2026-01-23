import type { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "@/utils/middleware/withMiddleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const shop = req.query.shop || req.body.shop;

  if (!shop) {
    return res.status(400).json({ error: "Shop is required" });
  }

  if (req.method === "GET") {
    try {
      let config = await prisma.ai_fbt_config.findUnique({
        where: { shop: shop as string },
      });

      if (!config) {
        config = await prisma.ai_fbt_config.create({
          data: {
            shop: shop as string,
            isEnabled: false,
            minSupport: 0.01,
            minConfidence: 0.3,
            minLift: 1.0,
            maxBundlesPerProduct: 3,
            lookbackDays: 90,
          },
        });
      }

      return res.status(200).json({ config });
    } catch (error: any) {
      return res.status(500).json({
        error: "Failed to get config",
        message: error.message,
      });
    }
  } else if (req.method === "POST") {
    try {
      const {
        isEnabled,
        minSupport,
        minConfidence,
        minLift,
        maxBundlesPerProduct,
        lookbackDays,
      } = req.body;

      const config = await prisma.ai_fbt_config.upsert({
        where: { shop: shop as string },
        update: {
          isEnabled: isEnabled ?? undefined,
          minSupport: minSupport ?? undefined,
          minConfidence: minConfidence ?? undefined,
          minLift: minLift ?? undefined,
          maxBundlesPerProduct: maxBundlesPerProduct ?? undefined,
          lookbackDays: lookbackDays ?? undefined,
          updatedAt: new Date(),
        },
        create: {
          shop: shop as string,
          isEnabled: isEnabled ?? false,
          minSupport: minSupport ?? 0.01,
          minConfidence: minConfidence ?? 0.3,
          minLift: minLift ?? 1.0,
          maxBundlesPerProduct: maxBundlesPerProduct ?? 3,
          lookbackDays: lookbackDays ?? 90,
        },
      });

      return res.status(200).json({ success: true, config });
    } catch (error: any) {
      return res.status(500).json({
        error: "Failed to update config",
        message: error.message,
      });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withMiddleware("verifyRequest")(handler);

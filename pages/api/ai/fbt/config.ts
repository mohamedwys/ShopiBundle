import type { NextApiResponse } from "next";
import {
  withShopAuth,
  ApiContext,
  sendSuccess,
  sendError,
} from "@/lib/middleware/with-shop-auth";
import prisma from "@/utils/prisma";

async function handler(ctx: ApiContext): Promise<void> {
  const { shop, req, res } = ctx;

  if (req.method === "GET") {
    let config = await prisma.ai_fbt_config.findUnique({
      where: { shop },
    });

    if (!config) {
      config = await prisma.ai_fbt_config.create({
        data: {
          shop,
          isEnabled: false,
          minSupport: 0.01,
          minConfidence: 0.3,
          minLift: 1.0,
          maxBundlesPerProduct: 3,
          lookbackDays: 90,
        },
      });
    }

    return sendSuccess(res, { config });
  }

  if (req.method === "POST") {
    const {
      isEnabled,
      minSupport,
      minConfidence,
      minLift,
      maxBundlesPerProduct,
      lookbackDays,
    } = req.body;

    const config = await prisma.ai_fbt_config.upsert({
      where: { shop },
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
        shop,
        isEnabled: isEnabled ?? false,
        minSupport: minSupport ?? 0.01,
        minConfidence: minConfidence ?? 0.3,
        minLift: minLift ?? 1.0,
        maxBundlesPerProduct: maxBundlesPerProduct ?? 3,
        lookbackDays: lookbackDays ?? 90,
      },
    });

    return sendSuccess(res, { config });
  }

  return sendError(res, "Method not allowed", 405);
}

export default withShopAuth(handler, {
  methods: ["GET", "POST"],
});

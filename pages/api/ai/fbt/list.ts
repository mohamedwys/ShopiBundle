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
  const isActive = req.query.isActive === "true";

  const where: any = { shop };

  if (productId) {
    where.productId = productId;
  }

  if (req.query.isActive !== undefined) {
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

  return sendSuccess(res, { bundles, config });
}

export default withShopAuth(handler, {
  methods: ["GET"],
});

import {
  withShopAuth,
  ApiContext,
  sendSuccess,
  sendError,
} from "@/lib/middleware/with-shop-auth";
import prisma from "@/utils/prisma";

async function handler(ctx: ApiContext): Promise<void> {
  const { shop, req, res } = ctx;

  const { bundleId, action } = req.body;

  if (!bundleId || !action) {
    return sendError(res, "Missing required fields", 400);
  }

  try {
    let updateData: any;

    switch (action) {
      case "accept":
        updateData = { isActive: true, isManualOverride: true, lastUpdatedAt: new Date() };
        break;
      case "reject":
        updateData = { isActive: false, isManualOverride: true, lastUpdatedAt: new Date() };
        break;
      case "lock":
        updateData = { isManualOverride: true, lastUpdatedAt: new Date() };
        break;
      case "unlock":
        updateData = { isManualOverride: false, lastUpdatedAt: new Date() };
        break;
      default:
        return sendError(res, "Invalid action", 400);
    }

    const bundle = await prisma.ai_fbt_bundles.update({
      where: { id: bundleId },
      data: updateData,
    });

    return sendSuccess(res, { bundle });
  } catch (error: any) {
    console.error("Override AI bundle error:", error);
    return sendError(res, "Failed to override AI bundle", 500);
  }
}

export default withShopAuth(handler, {
  methods: ["POST"],
});

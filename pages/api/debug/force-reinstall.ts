import type { NextApiRequest, NextApiResponse } from "next";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";
import prisma from "@/utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { shop, confirm } = req.query;

  if (!shop || typeof shop !== 'string') {
    return res.status(400).json({
      error: "Missing shop parameter",
      usage: "/api/debug/force-reinstall?shop=YOUR_SHOP.myshopify.com&confirm=yes"
    });
  }

  if (confirm !== 'yes') {
    return res.status(400).json({
      error: "Please add &confirm=yes to proceed",
      warning: "This will delete ALL sessions for this shop",
      shop: shop,
      instruction: `Visit: /api/debug/force-reinstall?shop=${shop}&confirm=yes`
    });
  }

  try {
    console.log(`🗑️  Force reinstall requested for shop: ${shop}`);

    // Delete offline session (ignore if doesn't exist)
    const offlineSessionId = shopify.session.getOfflineId(shop);
    try {
      await sessionHandler.deleteSession(offlineSessionId);
      console.log(`✓ Deleted offline session: ${offlineSessionId}`);
    } catch (e) {
      console.log(`ℹ️  No offline session to delete: ${offlineSessionId} (this is ok)`);
    }

    // Delete any online sessions (ignore if don't exist)
    try {
      const onlineSessions = await sessionHandler.findSessionsByShop(shop);
      for (const session of onlineSessions) {
        try {
          await sessionHandler.deleteSession(session.id);
          console.log(`✓ Deleted online session: ${session.id}`);
        } catch (e) {
          console.log(`ℹ️  Could not delete session ${session.id} (may already be deleted)`);
        }
      }
    } catch (e) {
      console.log(`ℹ️  No online sessions to delete (this is ok)`);
    }

    // Delete from active_stores table
    try {
      await prisma.active_stores.delete({
        where: { shop: shop }
      });
      console.log(`✓ Deleted from active_stores table`);
    } catch (e) {
      console.log(`ℹ️  No entry in active_stores table (this is ok)`);
    }

    // Delete all bundle_discount_id entries for this shop
    try {
      const deleted = await prisma.bundle_discount_id.deleteMany({
        where: { shop: shop }
      });
      console.log(`✓ Deleted ${deleted.count} bundle_discount_id entries`);
    } catch (e) {
      console.log(`ℹ️  No bundle entries to delete (this is ok)`);
    }

    return res.status(200).json({
      success: true,
      message: "All sessions and data deleted successfully",
      shop: shop,
      nextStep: "Reinstall the app",
      reinstallUrl: `/api?shop=${shop}`,
      instruction: `Visit: /api?shop=${shop} to start fresh OAuth flow`
    });

  } catch (error) {
    console.error('Error during force reinstall:', error);
    return res.status(500).json({
      error: "Failed to delete sessions",
      message: error.message,
      shop: shop
    });
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default handler;

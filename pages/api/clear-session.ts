import { NextApiRequest, NextApiResponse } from "next";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";
import prisma from "@/utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const shop = req.query.shop as string;

    if (!shop) {
      return res.status(400).json({
        success: false,
        error: "Missing shop parameter",
        message: "Usage: /api/clear-session?shop=your-store.myshopify.com"
      });
    }

    console.log('=== CLEARING SESSION FOR SHOP ===');
    console.log('Shop:', shop);

    // Get expected offline session ID
    const offlineSessionId = shopify.session.getOfflineId(shop);
    console.log('Offline session ID:', offlineSessionId);

    // Delete all sessions for this shop
    const deletedSessions = await prisma.session.deleteMany({
      where: { shop }
    });

    console.log(`✓ Deleted ${deletedSessions.count} session(s) for shop:`, shop);

    // Also delete from active_stores to trigger fresh setup
    await prisma.active_stores.deleteMany({
      where: { shop }
    });

    console.log('✓ Cleared active_stores record for shop:', shop);

    return res.status(200).json({
      success: true,
      shop,
      deletedSessionCount: deletedSessions.count,
      message: `All sessions cleared for ${shop}. Please reinstall the app.`,
      reinstallUrl: `${process.env.SHOPIFY_APP_URL}/api?shop=${shop}`
    });
  } catch (error: any) {
    console.error("=== CLEAR SESSION ERROR ===");
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Unknown error",
      stack: error?.stack,
    });
  }
};

export default handler;

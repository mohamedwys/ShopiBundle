import { NextApiHandler } from "next";
import prisma from "@/utils/prisma";

/**
 * Force delete session for a shop
 * Visit: /api/debug/clear-session?shop=galactiva.myshopify.com
 *
 * USE WITH CAUTION: This will force logout and require app reinstallation
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const shop = req.query.shop as string;

    if (!shop) {
      return res.status(400).json({
        error: "Missing shop parameter",
        usage: "/api/debug/clear-session?shop=YOUR_SHOP.myshopify.com"
      });
    }

    const results = {
      shop,
      deleted: {
        sessions: 0,
        activeStore: false,
      },
      message: "",
    };

    // Delete all sessions for this shop
    const deletedSessions = await prisma.session.deleteMany({
      where: {
        shop: shop,
      },
    });
    results.deleted.sessions = deletedSessions.count;

    // Also delete the offline session by ID
    const offlineSessionId = `offline_${shop}`;
    try {
      await prisma.session.delete({
        where: {
          id: offlineSessionId,
        },
      });
      results.deleted.sessions += 1;
    } catch (e) {
      // Session might not exist, that's ok
    }

    // Reset active store status
    try {
      await prisma.active_stores.update({
        where: { shop },
        data: {
          isActive: false,
          setupError: "Session cleared - app needs reinstallation",
        },
      });
      results.deleted.activeStore = true;
    } catch (e) {
      // Store might not exist, that's ok
    }

    results.message = `Cleared ${results.deleted.sessions} session(s) for ${shop}. Please reinstall the app.`;

    return res.status(200).json({
      success: true,
      ...results,
      nextSteps: [
        `1. Visit: https://shopi-bundle.vercel.app/api/index?shop=${shop}`,
        "2. Click 'Install app'",
        "3. Accept permissions",
        "4. Verify token length is 100+ characters",
      ],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export default handler;

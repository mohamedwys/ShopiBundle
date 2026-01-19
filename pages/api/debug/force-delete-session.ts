import { NextApiHandler } from "next";
import prisma from "@/utils/prisma";
import shopify from "@/utils/shopify";

/**
 * Force delete a corrupted session to allow fresh OAuth flow
 * Visit: /api/debug/force-delete-session?shop=galactiva.myshopify.com&confirm=yes
 *
 * USE THIS WHEN:
 * - Token is corrupted (38 characters instead of 100+)
 * - Reinstalling doesn't fix the issue
 * - You need to force a completely fresh OAuth flow
 *
 * AFTER RUNNING THIS:
 * - Uninstall the app from Shopify admin
 * - Wait 30 seconds
 * - Reinstall the app
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const shop = req.query.shop as string;
    const confirm = req.query.confirm as string;

    if (!shop) {
      return res.status(400).json({
        error: "Missing shop parameter",
        usage: "/api/debug/force-delete-session?shop=yourstore.myshopify.com&confirm=yes",
      });
    }

    if (confirm !== "yes") {
      return res.status(400).json({
        error: "Must confirm deletion",
        usage: "/api/debug/force-delete-session?shop=yourstore.myshopify.com&confirm=yes",
        warning: "This will delete the session and require app reinstallation",
      });
    }

    const sessionId = shopify.session.getOfflineId(shop);

    // Check if session exists
    const existingSession = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) {
      return res.status(404).json({
        message: "No session found - nothing to delete",
        shop,
        sessionId,
        nextSteps: ["Install the app on the shop to create a new session"],
      });
    }

    // Parse and show current session info
    let currentTokenInfo;
    try {
      const sessionContent = JSON.parse(existingSession.content || "{}");
      const token = sessionContent.accessToken || "";
      currentTokenInfo = {
        length: token.length,
        prefix: token.substring(0, 6) + "...",
        suffix: "..." + token.substring(token.length - 4),
        isCorrupted: token.length < 50,
      };
    } catch (e) {
      currentTokenInfo = { error: "Could not parse session" };
    }

    // Delete the session
    await prisma.session.delete({
      where: { id: sessionId },
    });

    // Also delete all sessions for this shop (in case there are online sessions too)
    await prisma.session.deleteMany({
      where: { shop },
    });

    // Mark store as inactive
    await prisma.active_stores.update({
      where: { shop },
      data: {
        isActive: false,
        lastError: "Session manually deleted - awaiting reinstall"
      },
    }).catch(() => {
      // Ignore error if store record doesn't exist
    });

    return res.status(200).json({
      success: true,
      message: "Session deleted successfully",
      shop,
      sessionId,
      deletedSessionInfo: currentTokenInfo,
      nextSteps: [
        "1. Uninstall the app from Shopify admin (if still installed)",
        "2. Wait 30 seconds",
        "3. Reinstall the app from Shopify admin",
        "4. The OAuth flow will create a fresh session with a valid token",
        "5. Verify with: /api/debug/check-session?shop=" + shop,
      ],
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export default handler;

import { NextApiRequest, NextApiResponse } from "next";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const shop = "galactiva.myshopify.com";
    
    // Test offline session
    const offlineSessionId = shopify.session.getOfflineId(shop);
    console.log('Looking for offline session ID:', offlineSessionId);
    
    const offlineSession = await sessionHandler.loadSession(offlineSessionId);
    
    if (offlineSession) {
      return res.status(200).json({
        success: true,
        message: "Offline session found!",
        sessionId: offlineSession.id,
        shop: offlineSession.shop,
        hasAccessToken: !!offlineSession.accessToken,
        isOnline: offlineSession.isOnline,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Offline session not found",
        searchedFor: offlineSessionId,
      });
    }
  } catch (error: any) {
    console.error("Test session error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Unknown error",
    });
  }
};

export default handler;
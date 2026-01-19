import { NextApiRequest, NextApiResponse } from "next";
import shopify from "@/utils/shopify";
import sessionHandler from "@/utils/sessionHandler";
import prisma from "@/utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const shop = req.query.shop as string || "galactiva.myshopify.com";

    console.log('=== DEBUG SESSION START ===');
    console.log('Shop:', shop);

    // Get expected session ID
    const expectedOfflineSessionId = shopify.session.getOfflineId(shop);
    console.log('Expected offline session ID:', expectedOfflineSessionId);

    // Try to load offline session
    const offlineSession = await sessionHandler.loadSession(expectedOfflineSessionId);

    // Get all sessions for this shop from database
    const allSessionsForShop = await prisma.session.findMany({
      where: { shop },
      select: {
        id: true,
        shop: true,
        content: true,
      }
    });

    console.log(`Found ${allSessionsForShop.length} sessions in database for shop:`, shop);

    const sessionDetails = allSessionsForShop.map(record => {
      try {
        const data = JSON.parse(record.content || '{}');
        return {
          id: record.id,
          shop: record.shop,
          isOnline: data.isOnline,
          hasAccessToken: !!data.accessToken,
          accessTokenPreview: data.accessToken ? `${data.accessToken.substring(0, 10)}...` : null,
          scope: data.scope,
          expires: data.expires,
        };
      } catch (e) {
        return {
          id: record.id,
          shop: record.shop,
          error: 'Failed to parse session content',
        };
      }
    });

    return res.status(200).json({
      success: true,
      shop,
      expectedOfflineSessionId,
      offlineSessionFound: !!offlineSession,
      offlineSessionDetails: offlineSession ? {
        id: offlineSession.id,
        shop: offlineSession.shop,
        isOnline: offlineSession.isOnline,
        hasAccessToken: !!offlineSession.accessToken,
        scope: offlineSession.scope,
      } : null,
      allSessionsCount: allSessionsForShop.length,
      allSessions: sessionDetails,
      recommendation: !offlineSession
        ? "No offline session found. Please reinstall the app by visiting /api?shop=" + shop
        : offlineSession.accessToken
        ? "Offline session found with valid accessToken. Everything looks good!"
        : "Offline session found but missing accessToken. Please reinstall the app.",
    });
  } catch (error: any) {
    console.error("=== DEBUG SESSION ERROR ===");
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Unknown error",
      stack: error?.stack,
    });
  }
};

export default handler;

import { NextApiRequest, NextApiResponse } from "next";
import clientProvider from "@/utils/clientProvider";
import { getBundles } from "@/utils/shopifyQueries";
import shopify from "@/utils/shopify";
import sessionHandler from "@/utils/sessionHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const shop = "galactiva.myshopify.com";

    console.log('=== TEST BUNDLES START ===');
    console.log('Testing bundles fetch for:', shop);

    // Check session ID format
    const expectedSessionId = shopify.session.getOfflineId(shop);
    console.log('Expected session ID:', expectedSessionId);

    // Try to load session directly
    const session = await sessionHandler.loadSession(expectedSessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
        details: {
          shop,
          expectedSessionId,
          message: "No offline session exists for this shop. Please reinstall the app.",
        }
      });
    }

    console.log('✓ Session found:', {
      id: session.id,
      shop: session.shop,
      isOnline: session.isOnline,
      hasAccessToken: !!session.accessToken,
    });

    if (!session.accessToken) {
      return res.status(401).json({
        success: false,
        error: "Session missing accessToken",
        details: {
          shop,
          sessionId: session.id,
          message: "Session exists but has no accessToken. Please reinstall the app.",
        }
      });
    }

    // Get offline client
    const { client } = await clientProvider.offline.graphqlClient({ shop });
    console.log('✓ GraphQL client created');

    // Fetch bundles
    const bundlesResponse = await getBundles(client, true, undefined);
    console.log('✓ Bundles fetched successfully');

    return res.status(200).json({
      success: true,
      shop,
      sessionId: session.id,
      bundles: bundlesResponse,
      bundleCount: bundlesResponse?.edges?.length || 0,
    });
  } catch (error: any) {
    console.error("=== TEST BUNDLES ERROR ===");
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Unknown error",
      stack: error?.stack,
    });
  }
};

export default handler;
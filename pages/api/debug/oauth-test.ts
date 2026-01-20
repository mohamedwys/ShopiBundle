import { NextApiHandler } from "next";
import shopify from "@/utils/shopify";

/**
 * Test OAuth configuration and readiness
 * Visit: /api/debug/oauth-test?shop=galactiva.myshopify.com
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const shop = (req.query.shop as string) || "galactiva.myshopify.com";

    const diagnosis = {
      timestamp: new Date().toISOString(),
      shop,
      config: {
        apiKey: process.env.SHOPIFY_API_KEY ? "✓ Set" : "❌ Missing",
        apiSecret: process.env.SHOPIFY_API_SECRET ? "✓ Set" : "❌ Missing",
        apiVersion: process.env.SHOPIFY_API_VERSION,
        appUrl: process.env.SHOPIFY_APP_URL,
        scopes: process.env.SHOPIFY_API_SCOPES,
      },
      offlineSessionId: shopify.session.getOfflineId(shop),
      oauthUrl: `https://shopi-bundle.vercel.app/api?shop=${shop}`,
      callbackUrl: `https://shopi-bundle.vercel.app/api/auth/callback`,
      instructions: [
        "1. If OAuth hasn't completed, visit the oauthUrl above",
        "2. Authorize the app in Shopify",
        "3. You should be redirected back to the callback",
        "4. Check Vercel logs for any errors during callback",
        "5. Then verify session with: /api/debug/check-session?shop=" + shop,
      ],
    };

    return res.status(200).json(diagnosis);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export default handler;

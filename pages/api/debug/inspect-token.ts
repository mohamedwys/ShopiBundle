import { NextApiHandler } from "next";
import prisma from "@/utils/prisma";
import shopify from "@/utils/shopify";

/**
 * Debug endpoint to inspect the actual access token structure
 * Visit: /api/debug/inspect-token?shop=galactiva.myshopify.com
 *
 * WARNING: This exposes partial token data. Delete after debugging.
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const shop = (req.query.shop as string) || "galactiva.myshopify.com";

    // Check session in database
    const sessionId = shopify.session.getOfflineId(shop);
    const sessionData = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!sessionData || !sessionData.content) {
      return res.status(404).json({
        error: "Session not found",
        shop,
        sessionId,
      });
    }

    // Parse session content
    const sessionContent = JSON.parse(sessionData.content);
    const token = sessionContent.accessToken || "";

    // Analyze token structure
    const analysis = {
      timestamp: new Date().toISOString(),
      shop,
      sessionId,
      token: {
        exists: !!token,
        length: token.length,
        prefix: token.substring(0, 8) + "...", // First 8 chars
        suffix: "..." + token.substring(token.length - 8), // Last 8 chars
        fullPreview: token.substring(0, 50) + "...", // First 50 chars

        // Check if it looks like different token types
        isShopifyAccessToken: token.startsWith("shpat_") || token.startsWith("shpca_"),
        looksLikeApiKey: token.length < 50 && /^[a-f0-9]{32,40}$/.test(token),
        hasHyphens: token.includes("-"),
        hasUnderscores: token.includes("_"),

        // Character composition
        hasUpperCase: /[A-Z]/.test(token),
        hasLowerCase: /[a-z]/.test(token),
        hasNumbers: /[0-9]/.test(token),
        hasSpecialChars: /[^a-zA-Z0-9]/.test(token),
      },

      rawSessionContent: {
        id: sessionContent.id,
        shop: sessionContent.shop,
        isOnline: sessionContent.isOnline,
        scope: sessionContent.scope,
        expires: sessionContent.expires,
        state: sessionContent.state,
      },

      diagnosis: [] as string[],
      recommendation: [] as string[],
    };

    // Provide diagnosis
    if (token.length < 50) {
      analysis.diagnosis.push(`❌ Token is only ${token.length} characters (should be 100+)`);
    }

    if (token.length === 32 || token.length === 38) {
      analysis.diagnosis.push("⚠️ Token length matches API Key length (32-38 chars)");
      analysis.diagnosis.push("❌ API Key may have been stored instead of access token");
      analysis.recommendation.push("Check if SHOPIFY_API_KEY is being stored instead of accessToken");
    }

    if (!token.startsWith("shpat_") && !token.startsWith("shpca_")) {
      analysis.diagnosis.push("❌ Token doesn't have expected Shopify prefix (shpat_ or shpca_)");
      analysis.recommendation.push("This is NOT a valid Shopify access token");
    }

    if (token.length > 100) {
      analysis.diagnosis.push("✓ Token length looks correct");
    }

    if (analysis.diagnosis.length === 0) {
      analysis.diagnosis.push("⚠️ Unable to determine issue from token analysis");
    }

    return res.status(200).json(analysis);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export default handler;

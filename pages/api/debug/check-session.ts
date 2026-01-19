import { NextApiHandler } from "next";
import prisma from "@/utils/prisma";
import shopify from "@/utils/shopify";

/**
 * Debug endpoint to check session details and diagnose 401 errors
 * Visit: /api/debug/check-session?shop=galactiva.myshopify.com
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const shop = (req.query.shop as string) || "galactiva.myshopify.com";

    // Check environment
    const apiVersion = process.env.SHOPIFY_API_VERSION;

    // Check session in database
    const sessionId = shopify.session.getOfflineId(shop);
    const sessionData = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!sessionData) {
      return res.status(404).json({
        error: "Session not found",
        shop,
        sessionId,
        solution: "App needs to be installed on this shop",
      });
    }

    // Parse session content
    let sessionContent;
    let hasToken = false;
    let tokenLength = 0;
    let tokenPrefix = "";
    let tokenSuffix = "";
    let sessionApiVersion = null;

    try {
      sessionContent = JSON.parse(sessionData.content);
      hasToken = !!sessionContent.accessToken;
      const token = sessionContent.accessToken || "";
      tokenLength = token.length;
      tokenPrefix = token.substring(0, 6);
      tokenSuffix = token.substring(token.length - 4);

      // Try to extract API version from session (if stored)
      sessionApiVersion = sessionContent.apiVersion || null;
    } catch (e) {
      sessionContent = "Failed to parse";
    }

    // Check if store is active
    const activeStore = await prisma.active_stores.findUnique({
      where: { shop },
    });

    const diagnosis = {
      timestamp: new Date().toISOString(),
      shop,
      sessionId,

      environment: {
        apiVersion,
        isCorrect: apiVersion === "2025-10",
        warning: apiVersion === "2026-04"
          ? "⚠️ Environment variable SHOPIFY_API_VERSION is still 2026-04!"
          : null,
      },

      session: {
        exists: true,
        id: sessionData.id,
        shop: sessionData.shop,
        hasAccessToken: hasToken,
        tokenLength,
        tokenPrefix: tokenPrefix ? tokenPrefix + "..." : null,
        tokenSuffix: tokenSuffix ? "..." + tokenSuffix : null,
        tokenLooksValid: tokenLength > 50 && (tokenPrefix.startsWith("shpat_") || tokenPrefix.startsWith("shpca_")),
        sessionApiVersion,
      },

      store: {
        isActive: activeStore?.isActive,
        hasSetupError: !!activeStore?.setupError,
        setupError: activeStore?.setupError,
        lastError: activeStore?.lastError,
      },

      diagnosis: [],
      solution: [],
    };

    // Diagnose issues
    if (apiVersion === "2026-04") {
      diagnosis.diagnosis.push("❌ API version in environment is 2026-04 (invalid)");
      diagnosis.solution.push("1. Update Vercel env var SHOPIFY_API_VERSION to 2025-10");
      diagnosis.solution.push("2. Redeploy application");
      diagnosis.solution.push("3. Reinstall app on shop");
    } else if (apiVersion !== "2025-10") {
      diagnosis.diagnosis.push(`⚠️ API version is ${apiVersion} (not recommended)`);
      diagnosis.solution.push("Consider updating to 2025-10 (latest stable)");
    }

    if (!hasToken) {
      diagnosis.diagnosis.push("❌ Session has no access token");
      diagnosis.solution.push("Reinstall the app to generate new token");
    } else if (tokenLength < 50) {
      diagnosis.diagnosis.push(`❌ Access token is corrupted (${tokenLength} chars, should be 100+)`);
      diagnosis.diagnosis.push(`   Token preview: ${tokenPrefix}...${tokenSuffix}`);
      diagnosis.solution.push("1. Force delete session: /api/debug/force-delete-session?shop=" + shop + "&confirm=yes");
      diagnosis.solution.push("2. Uninstall app from Shopify admin");
      diagnosis.solution.push("3. Wait 30 seconds");
      diagnosis.solution.push("4. Reinstall the app");
    } else if (!tokenPrefix.startsWith("shpat_") && !tokenPrefix.startsWith("shpca_")) {
      diagnosis.diagnosis.push("⚠️ Token doesn't have expected Shopify prefix");
      diagnosis.diagnosis.push(`   Token starts with: ${tokenPrefix}...`);
      diagnosis.solution.push("Token may be invalid. Try reinstalling.");
    }

    if (sessionApiVersion && sessionApiVersion !== apiVersion) {
      diagnosis.diagnosis.push(
        `⚠️ Session was created with API version ${sessionApiVersion}, but app is using ${apiVersion}`
      );
      diagnosis.solution.push("Reinstall app to regenerate session with correct version");
    }

    if (activeStore?.setupError) {
      diagnosis.diagnosis.push(`⚠️ Setup error: ${activeStore.setupError}`);
    }

    if (diagnosis.diagnosis.length === 0) {
      diagnosis.diagnosis.push("✓ Configuration looks correct");
      diagnosis.solution.push("If 401 errors persist, try reinstalling the app");
    }

    return res.status(200).json(diagnosis);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export default handler;

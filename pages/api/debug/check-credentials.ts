import { NextApiHandler } from "next";
import shopify from "@/utils/shopify";

/**
 * Check if app credentials match configuration
 * Visit: /api/debug/check-credentials
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const diagnosis = {
      timestamp: new Date().toISOString(),

      environment: {
        SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
        SHOPIFY_API_KEY_length: process.env.SHOPIFY_API_KEY?.length,
        SHOPIFY_API_SECRET_exists: !!process.env.SHOPIFY_API_SECRET,
        SHOPIFY_API_SECRET_length: process.env.SHOPIFY_API_SECRET?.length,
        SHOPIFY_API_VERSION: process.env.SHOPIFY_API_VERSION,
        SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,
        SHOPIFY_API_SCOPES: process.env.SHOPIFY_API_SCOPES,
      },

      shopifyAppToml: {
        client_id: "15673a82b49113d07a0f066fd048267e",
        note: "This should match SHOPIFY_API_KEY above"
      },

      match: {
        keysMatch: process.env.SHOPIFY_API_KEY === "15673a82b49113d07a0f066fd048267e",
        diagnosis: [] as string[],
      },

      tokenIssue: {
        description: "Current token has prefix 'shpua_' which is NOT valid",
        validPrefixes: ["shpat_", "shpca_"],
        suspectedCause: [] as string[],
      }
    };

    // Diagnosis
    if (!diagnosis.match.keysMatch) {
      diagnosis.match.diagnosis.push("❌ SHOPIFY_API_KEY doesn't match client_id in shopify.app.toml");
      diagnosis.match.diagnosis.push("This means you're using credentials from a different app!");
      diagnosis.match.diagnosis.push("Solution: Update SHOPIFY_API_KEY in Vercel to match shopify.app.toml");
    } else {
      diagnosis.match.diagnosis.push("✓ SHOPIFY_API_KEY matches shopify.app.toml client_id");
    }

    // Token prefix diagnosis
    diagnosis.tokenIssue.suspectedCause.push(
      "The 'shpua_' prefix suggests one of these issues:",
      "1. App credentials (API key/secret) are from wrong app type",
      "2. App in Shopify Partners dashboard has incorrect configuration",
      "3. App was created as wrong type (e.g., custom app vs public app)",
      "4. OAuth flow is using wrong endpoints or parameters"
    );

    return res.status(200).json(diagnosis);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export default handler;

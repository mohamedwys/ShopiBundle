import { NextApiHandler } from "next";

/**
 * Debug endpoint to check environment configuration
 * Visit: /api/debug/config
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const config = {
      NODE_ENV: process.env.NODE_ENV,
      SHOPIFY_API_VERSION: process.env.SHOPIFY_API_VERSION,
      SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,
      SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ? "✓ Set" : "✗ Not Set",
      SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET ? "✓ Set" : "✗ Not Set",
      SHOPIFY_API_SCOPES: process.env.SHOPIFY_API_SCOPES,
      DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Not Set",
    };

    return res.status(200).json({
      timestamp: new Date().toISOString(),
      config,
      warning: config.SHOPIFY_API_VERSION === "2026-04"
        ? "⚠️ API version 2026-04 is invalid! Change to 2025-10"
        : config.SHOPIFY_API_VERSION === "2025-10"
        ? "✓ API version is correct"
        : "⚠️ Unexpected API version",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default handler;

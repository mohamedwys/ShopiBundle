import { ApiVersion, DeliveryMethod, shopifyApi, Session } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import appUninstallHandler from "./webhooks/app_uninstalled";

const isDev = process.env.NODE_ENV === "development";

// Setup Shopify configuration
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_API_SCOPES.split(","),
  hostName: process.env.SHOPIFY_APP_URL.replace(/https?:\/\//, ""), // Support both http and https
  hostScheme: "https",
  apiVersion: process.env.SHOPIFY_API_VERSION as ApiVersion,
  isEmbeddedApp: true,
  logger: { level: isDev ? 0 : 0 },

  // CRITICAL: Use offline tokens for persistent API access
  // Online tokens expire and are user-specific, offline tokens are shop-specific and permanent
  useOnlineTokens: false,

  // Future flags for better compatibility
  billing: undefined,
});

// Webhook handlers
shopify.webhooks.addHandlers({
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/app_uninstalled",
    callback: appUninstallHandler,
  },
});

export default shopify;
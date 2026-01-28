import { ApiVersion, DeliveryMethod, shopifyApi, Session } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import appUninstallHandler from "./webhooks/app_uninstalled";
import inventoryLevelsUpdateHandler from "./webhooks/inventory_levels_update";
import ordersCreateHandler from "./webhooks/orders_create";
import sessionHandler from "./sessionHandler";

const isDev = process.env.NODE_ENV === "development";

// Define session storage interface (SessionStorage not exported from @shopify/shopify-api)
interface SessionStorageInterface {
  storeSession(session: Session): Promise<boolean>;
  loadSession(id: string): Promise<Session | undefined>;
  deleteSession(id: string): Promise<boolean>;
  deleteSessions(ids: string[]): Promise<boolean>;
  findSessionsByShop(shop: string): Promise<Session[]>;
}

// Create custom session storage that uses our sessionHandler
// IMPORTANT: Error handling must allow errors to propagate for proper OAuth flow
const customSessionStorage: SessionStorageInterface = {
  async storeSession(session: Session): Promise<boolean> {
    // Let errors propagate - don't swallow them
    // The OAuth callback needs to know if session storage failed
    await sessionHandler.storeSession(session);
    return true;
  },

  async loadSession(id: string): Promise<Session | undefined> {
    return await sessionHandler.loadSession(id);
  },

  async deleteSession(id: string): Promise<boolean> {
    return await sessionHandler.deleteSession(id);
  },

  async deleteSessions(ids: string[]): Promise<boolean> {
    return await sessionHandler.deleteSessions(ids);
  },

  async findSessionsByShop(shop: string): Promise<Session[]> {
    return await sessionHandler.findSessionsByShop(shop);
  }
};

// Setup Shopify configuration
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_API_SCOPES.split(","),
  hostName: process.env.SHOPIFY_APP_URL.replace(/https?:\/\//, "").replace(/\/$/, ""), // Remove protocol and trailing slash
  hostScheme: "https",
  apiVersion: process.env.SHOPIFY_API_VERSION as ApiVersion,
  isEmbeddedApp: true,
  logger: { level: isDev ? 0 : 0 },

  // CRITICAL: Use offline tokens for persistent API access
  useOnlineTokens: false,

  // Configure session storage to use our database
  sessionStorage: customSessionStorage,

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
  INVENTORY_LEVELS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/inventory_levels_update",
    callback: inventoryLevelsUpdateHandler,
  },
  ORDERS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/orders_create",
    callback: ordersCreateHandler,
  },
});

export default shopify;
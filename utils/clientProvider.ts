import { Session } from "@shopify/shopify-api";
import shopify from "./shopify";
import sessionHandler from "./sessionHandler";

type ClientParams = {
  req?: any;
  res?: any;
  isOnline?: boolean;
  shop?: string;
};

const fetchSession = async ({ req, res, isOnline, shop }: ClientParams): Promise<Session> => {
  if (shop && !req) {
    // Offline session lookup by shop domain
    const sessionId = shopify.session.getOfflineId(shop);
    console.log(`Fetching offline session for shop: ${shop}, sessionId: ${sessionId}`);

    const session = await sessionHandler.loadSession(sessionId);

    if (!session) {
      console.error(`✗ No offline session found for shop: ${shop}, expected sessionId: ${sessionId}`);
      throw new Error(`No offline session found for shop: ${shop}. Please reinstall the app.`);
    }

    if (!session.accessToken) {
      console.error(`✗ Offline session exists but has no accessToken for shop: ${shop}`);
      throw new Error(`Session for ${shop} is missing accessToken. Please reinstall the app.`);
    }

    console.log(`✓ Offline session found for shop: ${shop}`);
    return session;
  }

  const sessionId = await shopify.session.getCurrentId({
    isOnline: !!isOnline,
    rawRequest: req,
    rawResponse: res,
  });

  if (!sessionId) {
    console.error('✗ No session ID found in request');
    throw new Error("No session ID found");
  }

  console.log(`Fetching session with ID: ${sessionId}`);
  const session = await sessionHandler.loadSession(sessionId);

  if (!session) {
    console.error(`✗ No session found for id: ${sessionId}`);
    throw new Error(`No session found for id: ${sessionId}`);
  }

  console.log(`✓ Session found for id: ${sessionId}`);
  return session;
};

export const clientProvider = {
  graphqlClient: async ({ req, res, isOnline = true }: ClientParams) => {
    const session = await fetchSession({ req, res, isOnline });
    const client = new shopify.clients.Graphql({ session });
    return { client, shop: session.shop, session };
  },

  restClient: async ({ req, res, isOnline = true }: ClientParams) => {
    const session = await fetchSession({ req, res, isOnline });
    const client = new shopify.clients.Rest({ session });
    return { client, shop: session.shop, session };
  },

  offline: {
    graphqlClient: async ({ shop }: ClientParams) => {
      if (!shop) throw new Error("Shop parameter is required for offline client");
      const session = await fetchSession({ shop });
      const client = new shopify.clients.Graphql({ session });
      return { client, shop: session.shop, session };
    },

    restClient: async ({ shop }: ClientParams) => {
      if (!shop) throw new Error("Shop parameter is required for offline client");
      const session = await fetchSession({ shop });
      const client = new shopify.clients.Rest({ session });
      return { client, shop: session.shop, session };
    },
  },
};

export default clientProvider;
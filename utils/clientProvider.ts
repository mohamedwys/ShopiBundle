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
    // Offline session
    const sessionId = shopify.session.getOfflineId(shop);
    const session = await sessionHandler.loadSession(sessionId);
    if (!session) throw new Error(`No offline session found for shop: ${shop}`);
    return session;
  }

  const sessionId = await shopify.session.getCurrentId({
    isOnline: !!isOnline,
    rawRequest: req,
    rawResponse: res,
  });

  if (!sessionId) throw new Error("No session ID found");

  const session = await sessionHandler.loadSession(sessionId);
  if (!session) throw new Error(`No session found for id: ${sessionId}`);
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
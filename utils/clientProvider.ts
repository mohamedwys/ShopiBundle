// utils/clientProvider.ts
import { ApiVersion } from "@shopify/shopify-api";
import shopify from "./shopify";
import sessionHandler from "./sessionHandler";

const currentApiVersion = ApiVersion.January23;

type ClientParams = {
  req?: any;
  res?: any;
  isOnline?: boolean;
  shop?: string;
};

const fetchSession = async ({ req, res, isOnline, shop }: ClientParams) => {
  if (shop && !req) {
    // Offline session
    const sessionId = shopify.session.getOfflineId(shop);
    return await sessionHandler.loadSession(sessionId);
  }

  const sessionId = await shopify.session.getCurrentId({
    isOnline: !!isOnline,
    rawRequest: req,
    rawResponse: res,
  });

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
    const client = new shopify.clients.Rest({
      session,
      apiVersion: currentApiVersion,
    });
    return { client, shop: session.shop, session };
  },

  offline: {
    graphqlClient: async ({ shop }: ClientParams) => {
      const session = await fetchSession({ shop });
      const client = new shopify.clients.Graphql({ session });
      return { client, shop: session.shop, session };
    },

    restClient: async ({ shop }: ClientParams) => {
      const session = await fetchSession({ shop });
      const client = new shopify.clients.Rest({
        session,
        apiVersion: currentApiVersion,
      });
      return { client, shop: session.shop, session };
    },
  },
};

export default clientProvider;

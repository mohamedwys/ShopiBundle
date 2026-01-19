import { ApiVersion } from "@shopify/shopify-api";
import sessionHandler from "./sessionHandler";
import shopify from "./shopify";

const currentApiVersion = ApiVersion.January23;

interface ClientProviderParams {
  req?: any;
  res?: any;
  isOnline?: boolean;
  shop?: string;
}

// Fetch the session from DB
const fetchSession = async ({ req, res, isOnline, shop }: ClientProviderParams) => {
  if (shop) {
    // Offline session
    const sessionId = shopify.session.getOfflineId(shop);
    return await sessionHandler.loadSession(sessionId);
  }

  // Online session
  if (!req || !res) throw new Error("req and res are required for online session");
  const sessionId = await shopify.session.getCurrentId({ isOnline: !!isOnline, rawRequest: req, rawResponse: res });
  return await sessionHandler.loadSession(sessionId);
};

const graphqlClient = async ({ req, res, isOnline, shop }: ClientProviderParams) => {
  const session = await fetchSession({ req, res, isOnline, shop });
  if (!session) throw new Error("No session found");

  const client = new shopify.clients.Graphql({ session });
  return { client, shop: session.shop, session };
};

const restClient = async ({ req, res, isOnline, shop }: ClientProviderParams) => {
  const session = await fetchSession({ req, res, isOnline, shop });
  if (!session) throw new Error("No session found");

  const client = new shopify.clients.Rest({
    session,
    apiVersion: currentApiVersion,
  });

  return { client, shop: session.shop, session };
};

// Offline clients for background tasks
const offline = {
  graphqlClient: async ({ shop }: { shop: string }) => {
    return graphqlClient({ shop });
  },
  restClient: async ({ shop }: { shop: string }) => {
    return restClient({ shop });
  },
};

export default { graphqlClient, restClient, offline };

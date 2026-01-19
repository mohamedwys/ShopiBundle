import { ApiVersion } from "@shopify/shopify-api";
import shopify from "./shopify";
import sessionHandler from "./sessionHandler";

const currentApiVersion = ApiVersion.January23;

async function fetchSession({ req, res, isOnline }: { req?: any; res?: any; isOnline: boolean }) {
  // Get session ID from Shopify
  const sessionId = await shopify.session.getCurrentId({
    isOnline,
    rawRequest: req,
    rawResponse: res,
  });

  // Load session from Prisma
  const session = await sessionHandler.loadSession(sessionId);

  if (!session) throw new Error(`No session found for id: ${sessionId}`);

  return session;
}

async function graphqlClient({ req, res, isOnline }: { req?: any; res?: any; isOnline: boolean }) {
  const session = await fetchSession({ req, res, isOnline });
  const client = new shopify.clients.Graphql({ session });
  return { client, shop: session.shop, session };
}

async function restClient({ req, res, isOnline }: { req?: any; res?: any; isOnline: boolean }) {
  const session = await fetchSession({ req, res, isOnline });
  const client = new shopify.clients.Rest({
    session,
    apiVersion: currentApiVersion,
  });
  return { client, shop: session.shop, session };
}

// Offline clients (without request/response)
async function fetchOfflineSession(shop: string) {
  const sessionID = shopify.session.getOfflineId(shop);
  const session = await sessionHandler.loadSession(sessionID);
  if (!session) throw new Error(`No offline session found for shop: ${shop}`);
  return session;
}

const offline = {
  graphqlClient: async ({ shop }: { shop: string }) => {
    const session = await fetchOfflineSession(shop);
    const client = new shopify.clients.Graphql({ session });
    return { client, shop, session };
  },
  restClient: async ({ shop }: { shop: string }) => {
    const session = await fetchOfflineSession(shop);
    const client = new shopify.clients.Rest({ session, apiVersion: currentApiVersion });
    return { client, shop, session };
  },
};

const clientProvider = { graphqlClient, restClient, offline };

export default clientProvider;

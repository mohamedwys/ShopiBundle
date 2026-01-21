import withMiddleware from "@/utils/middleware/withMiddleware";
import shopify from "@/utils/shopify";
import { NextApiHandler } from "next";
import { getCollections } from "@/utils/shopifyQueries";

const handler: NextApiHandler = async (req, res) => {
  //Reject anything that's not a POST
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  // Use the session provided by verifyRequest middleware
  const session = req.user_session;

  if (!session) {
    console.error('✗ No session found in request context');
    return res.status(401).json({ error: "Unauthorized", message: "No session found" });
  }

  try {
    // Create GraphQL client with the validated session
    const client = new shopify.clients.Graphql({ session });

    const response = await getCollections(client);
    const collections = JSON.stringify(response);
    return res.status(200).json(collections);
  } catch (error) {
    console.error("Exception while getting collections:", error);
    return res.status(500).send("message: Error while getting collections");
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withMiddleware("verifyRequest")(handler);

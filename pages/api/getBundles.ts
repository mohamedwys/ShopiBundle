import { NextApiHandler } from "next";
import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";
import { getBundles } from "@/utils/shopifyQueries";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Only POST requests allowed." });
  }

  try {
    // Get Shopify GraphQL client with online session
    const { client } = await clientProvider.graphqlClient({ req, res, isOnline: true });

    const { after, cursor } = req.body;

    // Fetch bundles from Shopify
    const response = await getBundles(client, after, cursor);

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("Error in /api/getBundles:", error.message || error);
    return res.status(403).json({ error: error.message || "No session found or invalid request." });
  }
};

export const config = {
  api: { externalResolver: true },
};

export default withMiddleware("verifyRequest")(handler);

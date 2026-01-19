import { NextApiHandler } from "next";
import clientProvider from "@/utils/clientProvider";
import { getBundles } from "@/utils/shopifyQueries";
import withMiddleware from "@/utils/middleware/withMiddleware";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid request method" });
  }

  try {
    // Use online session for embedded Shopify app
    const { client } = await clientProvider.graphqlClient({ req, res, isOnline: true });

    const { after, cursor } = req.body ? JSON.parse(req.body) : {};
    const response = await getBundles(client, after, cursor);

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("Error fetching bundles:", error);
    if (error.message.includes("No session found")) {
      return res.status(403).json({ error: "No session found. Please refresh the app." });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Wrap with Shopify session verification middleware
export default withMiddleware("verifyRequest")(handler);

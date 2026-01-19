// pages/api/getBundles.ts
import type { NextApiHandler } from "next";
import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { getBundles } from "@/utils/shopifyQueries";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get Shopify GraphQL client with online session
    const { client, shop } = await clientProvider.graphqlClient({
      req,
      res,
      isOnline: true,
    });

    const { after, cursor } = req.body;

    const bundlesResponse = await getBundles(client, after, cursor);

    return res.status(200).json({ shop, bundles: bundlesResponse });
  } catch (error: any) {
    console.error("Error in getBundles API:", error.message || error);
    return res.status(403).json({
      error: "No session found or invalid session",
      message: error.message || null,
    });
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withMiddleware("verifyRequest")(handler);

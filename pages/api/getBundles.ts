import type { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { getBundles } from "@/utils/shopifyQueries";

interface BundlesRequestBody {
  after?: string;
  cursor?: string;
}

interface BundlesResponse {
  shop: string;
  bundles: any;
}

interface ErrorResponse {
  error: string;
  message?: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<BundlesResponse | ErrorResponse>
) => {
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

    const { after, cursor } = req.body as BundlesRequestBody;

    const bundlesResponse = await getBundles(client, after, cursor);

    return res.status(200).json({ shop, bundles: bundlesResponse });
  } catch (error: any) {
    console.error("Error in getBundles API:", error?.message || error);
    return res.status(403).json({
      error: "No session found or invalid session",
      message: error?.message || "Unknown error occurred",
    });
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withMiddleware("verifyRequest")(handler);
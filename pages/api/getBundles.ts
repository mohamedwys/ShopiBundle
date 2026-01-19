import type { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { getBundles } from "@/utils/shopifyQueries";

interface BundlesRequestBody {
  after?: boolean;
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
    // Try to get online session first, fallback to offline if not available
    let client, shop;
    
    try {
      const result = await clientProvider.graphqlClient({
        req,
        res,
        isOnline: true,
      });
      client = result.client;
      shop = result.shop;
    } catch (onlineError) {
      console.log('Online session not found, trying offline session...');
      
      // Fallback to offline session
      // Extract shop from session or request
      const shopDomain = req.headers['x-shop-domain'] as string || 
                         req.query.shop as string;
      
      if (!shopDomain) {
        throw new Error('No shop domain found in request');
      }
      
      const result = await clientProvider.offline.graphqlClient({
        shop: shopDomain,
      });
      client = result.client;
      shop = result.shop;
    }

    const { after, cursor } = req.body as BundlesRequestBody;

    const bundlesResponse = await getBundles(
      client,
      after ?? true,
      cursor
    );

    return res.status(200).json({ shop, bundles: bundlesResponse });
  } catch (error: any) {
    console.error("Error in getBundles API:", error?.message || error);
    
    // If it's an auth error, return 401 so frontend can trigger re-auth
    if (error?.message?.includes('session') || error?.message?.includes('No shop')) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Please reinstall the app",
      });
    }
    
    return res.status(500).json({
      error: "Failed to fetch bundles",
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
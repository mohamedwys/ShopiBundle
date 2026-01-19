import type { NextApiRequest, NextApiResponse } from "next";
import clientProvider from "@/utils/clientProvider";
import { getBundles } from "@/utils/shopifyQueries";
import shopify from "@/utils/shopify";

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
    // Extract shop from the authorization token or query
    const authHeader = req.headers.authorization;
    let shop: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      
      try {
        // Decode the session token to get shop
        const payload = await shopify.session.decodeSessionToken(token);
        shop = payload.dest.replace('https://', '');
      } catch (tokenError) {
        console.error('Token decode error:', tokenError);
      }
    }

    // Fallback to query parameter
    if (!shop) {
      shop = req.query.shop as string;
    }

    if (!shop) {
      return res.status(400).json({
        error: "Missing shop parameter",
        message: "Shop domain is required",
      });
    }

    console.log('Fetching bundles for shop:', shop);

    // Use offline session (persistent access token)
    const { client } = await clientProvider.offline.graphqlClient({ shop });

    const { after, cursor } = req.body as BundlesRequestBody;

    const bundlesResponse = await getBundles(
      client,
      after ?? true,
      cursor
    );

    return res.status(200).json({ shop, bundles: bundlesResponse });
  } catch (error: any) {
    console.error("Error in getBundles API:", error?.message || error);
    
    // Provide specific error messages
    if (error?.message?.includes('session') || error?.message?.includes('No offline session')) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Please reinstall the app to create a new session",
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

// Remove middleware temporarily to debug
export default handler;
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
  diagnosticUrl?: string;
  fixSteps?: string[];
  details?: any;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<BundlesResponse | ErrorResponse>
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Extract shop from the authorization token
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

    if (!shop) {
      return res.status(400).json({
        error: "Missing shop parameter",
        message: "Could not determine shop from request",
      });
    }

    console.log('Fetching bundles for shop:', shop);
    console.log('Using OFFLINE session ID:', `offline_${shop}`);

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

    // Handle specific error types

    // 1. Session not found
    if (error?.message?.includes('session') || error?.message?.includes('No offline session')) {
      return res.status(401).json({
        error: "No session found",
        message: "Please reinstall the app. The offline session does not exist for this shop.",
      });
    }

    // 2. Shopify API 401 Unauthorized - Invalid access token
    if (error?.networkStatusCode === 401 || error?.response?.statusCode === 401 || error?.message?.includes('Unauthorized')) {
      console.error('❌ CRITICAL: Shopify returned 401 Unauthorized');
      console.error('This means the access token is INVALID or EXPIRED');
      console.error('Solution: Delete session and reinstall app');

      return res.status(401).json({
        error: "Invalid access token",
        message: "The stored access token is invalid. Please reinstall the app to generate a new token.",
        diagnosticUrl: `/api/debug/validate-token?shop=${shop}`,
        fixSteps: [
          "Step 1: Visit /api/debug/force-delete-session?shop=" + shop + "&confirm=yes",
          "Step 2: Uninstall app from Shopify admin",
          "Step 3: Wait 30 seconds",
          "Step 4: Reinstall app via /api?shop=" + shop,
        ],
      });
    }

    // 3. GraphQL errors
    if (error?.response?.errors) {
      return res.status(400).json({
        error: "GraphQL query failed",
        message: error.response.errors[0]?.message || "GraphQL error occurred",
        details: error.response.errors,
      });
    }

    // 4. Generic error
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

// Export without middleware for now
export default handler;
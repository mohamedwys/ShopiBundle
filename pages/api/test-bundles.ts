import { NextApiRequest, NextApiResponse } from "next";
import clientProvider from "@/utils/clientProvider";
import { getBundles } from "@/utils/shopifyQueries";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const shop = "galactiva.myshopify.com";
    
    console.log('Testing bundles fetch for:', shop);
    
    // Get offline client
    const { client } = await clientProvider.offline.graphqlClient({ shop });
    console.log('✓ GraphQL client created');
    
    // Fetch bundles
    const bundlesResponse = await getBundles(client, true, undefined);
    console.log('✓ Bundles fetched');
    
    return res.status(200).json({
      success: true,
      shop,
      bundles: bundlesResponse,
      bundleCount: bundlesResponse?.edges?.length || 0,
    });
  } catch (error: any) {
    console.error("Test bundles error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Unknown error",
      stack: error?.stack,
    });
  }
};

export default handler;
import { NextApiRequest, NextApiResponse } from 'next';
import shopify from "@/utils/shopify";
import { logAuthDebug } from "@/utils/authDebug";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    logAuthDebug('AUTH BEGIN', req);

    const { shop } = req.query;

    if (!shop || typeof shop !== 'string') {
      res.status(400);
      return res.send("Missing shop parameter");
    }

    const sanitizedShop = shopify.utils.sanitizeShop(shop);

    if (!sanitizedShop) {
      res.status(400);
      return res.send("Invalid shop domain");
    }

    console.log('Starting OAuth for shop:', sanitizedShop);

    await shopify.auth.begin({
      shop: sanitizedShop,
      callbackPath: '/api/auth/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });

    console.log('=== AUTH BEGIN COMPLETE ===');

  } catch (error) {
    console.error('=== AUTH BEGIN ERROR ===', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).send(`Authentication error: ${errorMessage}`);
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;

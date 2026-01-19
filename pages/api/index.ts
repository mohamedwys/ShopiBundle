import { NextApiRequest, NextApiResponse } from 'next';
import shopify from "@/utils/shopify";
import prisma from "@/utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { shop, embedded, host } = req.query;

    if (!shop || typeof shop !== 'string') {
      res.status(500);
      return res.send("No shop provided");
    }

    const sanitizedShop = shopify.utils.sanitizeShop(shop);
    console.log('Auth start for shop:', sanitizedShop, 'embedded:', embedded, 'host:', host);

    // Handle embedded app redirect
    if (embedded === "1" && host) {
      const queryParams = new URLSearchParams({
        shop: sanitizedShop,
        host: typeof host === 'string' ? host : '',
      }).toString();

      console.log('Redirecting to exitframe');
      return res.redirect(`/exitframe?${queryParams}`);
    }

    console.log('Starting OAuth for shop:', sanitizedShop);

    // Start OAuth with proper configuration
    await shopify.auth.begin({
      shop: sanitizedShop,
      callbackPath: '/api/auth/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });

  } catch (e) {
    console.error(`---> Error at /api/index`, e);
    
    const { shop } = req.query;
    const error = e as Error;

    if (shop && typeof shop === 'string') {
      const sanitizedShop = shopify.utils.sanitizeShop(shop);
      try {
        await prisma.active_stores.upsert({
          where: { shop: sanitizedShop },
          update: { 
            isActive: false,
            lastError: error.message,
            lastErrorAt: new Date(),
          },
          create: { 
            shop: sanitizedShop, 
            isActive: false,
            lastError: error.message,
            lastErrorAt: new Date(),
          },
        });

        console.log('Cleared sessions for shop:', sanitizedShop);
      } catch (dbError) {
        console.error('Error updating DB:', dbError);
      }
    }
    
    res.status(500).send(error.message);
  }
};

export default handler;
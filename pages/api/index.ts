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

    console.log('Auth start for shop:', shop, 'embedded:', embedded, 'host:', host);

    // Handle embedded app redirect
    if (embedded === "1") {
      const sanitizedShop = shopify.utils.sanitizeShop(shop);
      const queryParams = new URLSearchParams({
        shop: sanitizedShop,
        host: typeof host === 'string' ? host : '',
        redirectUri: `/api?shop=${sanitizedShop}&host=${host}`,
      }).toString();

      console.log('Redirecting to exitframe');
      return res.redirect(`/exitframe?${queryParams}`);
    }

    console.log('Starting OAuth for shop:', shop);

    // Start OAuth - Fixed callback path to match your file structure
    await shopify.auth.begin({
      shop: shopify.utils.sanitizeShop(shop),
      callbackPath: '/api/auth/callback', // Changed from /tokens to /callback
      isOnline: false, // Start with offline for persistent access
      rawRequest: req,
      rawResponse: res,
    });

  } catch (e) {
    console.error(`---> Error at /api/index`, e);
    
    const { shop } = req.query;
    const error = e as Error;

    if (shop && typeof shop === 'string') {
      try {
        await prisma.active_stores.upsert({
          where: { shop },
          update: { isActive: false },
          create: { shop, isActive: false },
        });

        await prisma.session.deleteMany({
          where: { shop },
        });

        console.log('Cleared sessions for shop:', shop);
      } catch (dbError) {
        console.error('Error clearing sessions:', dbError);
      }
      
      res.redirect(`/api?shop=${shop}`);
    } else {
      res.status(500).send(error.message);
    }
  }
};

export default handler;
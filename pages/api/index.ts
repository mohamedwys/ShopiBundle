import { NextApiRequest, NextApiResponse } from 'next';
import shopify from "@/utils/shopify";
import prisma from "@/utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { shop, embedded, host, fromExitframe } = req.query;

    if (!shop || typeof shop !== 'string') {
      res.status(400);
      return res.send("No shop provided");
    }

    const sanitizedShop = shopify.utils.sanitizeShop(shop);

    if (!sanitizedShop) {
      res.status(400);
      return res.send("Invalid shop domain");
    }

    console.log('Auth start for shop:', sanitizedShop, 'embedded:', embedded, 'host:', host, 'fromExitframe:', fromExitframe);

    // If request is from embedded app, redirect to exitframe to break out of iframe
    // IMPORTANT: Only redirect if explicitly embedded AND not already coming from exitframe
    const isEmbedded = embedded === "1";
    const alreadyExited = fromExitframe === "1";

    if (isEmbedded && !alreadyExited) {
      const queryParams = new URLSearchParams({
        shop: sanitizedShop,
        ...(host && typeof host === 'string' && { host }),
        redirectUri: `/api?shop=${sanitizedShop}${host ? `&host=${host}` : ''}&fromExitframe=1`,
      }).toString();

      console.log('Redirecting to exitframe to break out of iframe');
      return res.redirect(`/exitframe?${queryParams}`);
    }

    console.log('Starting OAuth for shop:', sanitizedShop);

    // Start OAuth - this should only run outside iframe
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
      if (sanitizedShop) {
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
        } catch (dbError) {
          console.error('Error updating DB:', dbError);
        }
      }
    }
    
    res.status(500).send(`Authentication error: ${error.message}`);
  }
};

export default handler;
import { NextApiRequest, NextApiResponse } from 'next';
import {
  CookieNotFound,
  InvalidOAuthError,
  InvalidSession,
} from "@shopify/shopify-api";
import shopify from "@/utils/shopify";
import prisma from "@/utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { shop, embedded, host } = req.query;

    if (!shop || typeof shop !== 'string') {
      res.status(500);
      return res.send("No shop provided");
    }

    console.log('Auth start for shop:', shop, 'embedded:', embedded);

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

    // FIXED: Point to token.ts (your actual first callback)
    console.log('Starting OAuth for shop:', shop);
    
    return await shopify.auth.begin({
      shop,
      callbackPath: `/api/auth/tokens`, // ← Matches token.ts file
      isOnline: false, // First get offline token
      rawRequest: req,
      rawResponse: res,
    });

  } catch (e) {
    console.error(`---> Error at /api/index`, e);
    
    const { shop } = req.query;
    const error = e as Error;

    switch (true) {
      case e instanceof InvalidOAuthError:
        console.error('Invalid OAuth error:', error.message);
        res.status(400).send(error.message);
        break;

      case e instanceof CookieNotFound:
      case e instanceof InvalidSession:
        console.log('Session invalid, clearing data for shop:', shop);
        
        if (shop && typeof shop === 'string') {
          try {
            await prisma.active_stores.update({
              where: { shop },
              data: { 
                isActive: false,
                lastError: 'Session expired or invalid',
                lastErrorAt: new Date()
              },
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
          res.status(400).send('Invalid shop parameter');
        }
        break;

      default:
        console.error('Unexpected auth error:', error);
        res.status(500).send(error.message);
        break;
    }
  }
};

export default handler;
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/prisma";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";
import {
  CookieNotFound,
  InvalidOAuthError,
  InvalidSession,
} from "@shopify/shopify-api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Token callback received for shop:', req.query.shop);

    // Exchange code for OFFLINE access token
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;
    
    if (!session) {
      throw new Error('No session returned from Shopify');
    }

    console.log('Offline token received, storing session');

    // Store the offline session
    await sessionHandler.storeSession(session);

    // Register webhooks with offline token
    try {
      const webhookRegisterResponse = await shopify.webhooks.register({
        session,
      });
      console.log('Webhooks registered:', webhookRegisterResponse);
    } catch (webhookError) {
      console.error('Webhook registration failed (non-critical):', webhookError);
    }

    const { shop } = session;

    // Mark shop as active
    await prisma.active_stores.upsert({
      where: { shop },
      update: { 
        isActive: true,
        installedAt: new Date(),
        lastError: null
      },
      create: { 
        shop, 
        isActive: true,
        installedAt: new Date()
      },
    });

    console.log('Shop activated:', shop);

    // CRITICAL DECISION: Do you need online token?
    // Option 1: Redirect directly to app (simpler)
    const redirectUrl = `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`;
    console.log('Redirecting to app:', redirectUrl);
    return res.redirect(redirectUrl);

    // Option 2: Get online token too (uncomment if needed)
    /*
    console.log('Starting online token flow');
    return await shopify.auth.begin({
      shop: session.shop,
      callbackPath: `/api/auth/callback`, // Points to callback.ts for online token
      isOnline: true, // Now get online token
      rawRequest: req,
      rawResponse: res,
    });
    */

  } catch (e) {
    console.error(`---> Error at /api/auth/tokens`, e);

    const { shop } = req.query;
    const error = e as Error;

    if (shop && typeof shop === 'string') {
      await prisma.active_stores.upsert({
        where: { shop },
        update: { 
          isActive: false,
          lastError: error.message,
          lastErrorAt: new Date()
        },
        create: { 
          shop, 
          isActive: false,
          lastError: error.message,
          lastErrorAt: new Date()
        },
      });
    }

    switch (true) {
      case e instanceof InvalidOAuthError:
        res.status(400).send(error.message);
        break;
      case e instanceof CookieNotFound:
      case e instanceof InvalidSession:
        if (shop && typeof shop === 'string') {
          await prisma.session.deleteMany({
            where: { shop },
          });
          res.redirect(`/api?shop=${shop}`);
        } else {
          res.status(400).send('Invalid session');
        }
        break;
      default:
        res.status(500).send(error.message);
        break;
    }
  }
};

export default handler;
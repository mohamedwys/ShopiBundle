import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/prisma";
import { createBundleDefinition } from "@/utils/shopifyQueries/createBundleDefinition";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Auth callback received');

    // Exchange code for OFFLINE access token first
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;
    
    if (!session) {
      throw new Error('No session returned from Shopify');
    }

    console.log('Offline session received for shop:', session.shop);

    // Store the offline session
    await sessionHandler.storeSession(session);

    const { shop } = session;

    // Create bundle definition
    try {
      const client = new shopify.clients.Graphql({ session });
      const bundleDefResult = await createBundleDefinition(client);
      console.log('Bundle definition created:', bundleDefResult);
      
      // Update store record
      await prisma.active_stores.upsert({
        where: { shop },
        create: {
          shop,
          isActive: true,
          scope: session.scope || '',
        },
        update: {
          isActive: true,
          scope: session.scope || '',
          setupError: null,
          lastError: null,
        },
      });
    } catch (defError) {
      console.error('Bundle definition creation failed:', defError);
      const errorMessage = defError instanceof Error ? defError.message : 'Unknown error';
      
      await prisma.active_stores.upsert({
        where: { shop },
        create: {
          shop,
          isActive: true,
          setupError: errorMessage,
          scope: session.scope || '',
        },
        update: {
          setupError: errorMessage,
        },
      });
    }

    // Now initiate ONLINE token flow for user-specific operations
    const host = req.query.host as string;
    
    console.log('Offline session complete, starting online session flow...');
    
    // Redirect to online auth
    await shopify.auth.begin({
      shop,
      callbackPath: '/api/auth/online/callback',
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

  } catch (error) {
    console.error('===> Auth callback error:', error);
    
    const { shop } = req.query;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (shop && typeof shop === 'string') {
      try {
        await prisma.active_stores.upsert({
          where: { shop },
          create: {
            shop,
            isActive: false,
            lastError: errorMessage,
            lastErrorAt: new Date(),
            scope: '',
          },
          update: {
            lastError: errorMessage,
            lastErrorAt: new Date(),
          },
        });
      } catch (dbError) {
        console.error('Failed to update error in DB:', dbError);
      }
      
      // Restart auth flow
      return res.redirect(`/api?shop=${shop}`);
    }

    return res.status(500).send(errorMessage);
  }
};

export default handler;
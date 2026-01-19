import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/prisma";
import { createBundleDefinition } from "@/utils/shopifyQueries/createBundleDefinition";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Auth callback received, query params:', req.query);

    // Exchange code for OFFLINE access token
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;
    
    if (!session) {
      throw new Error('No session returned from Shopify');
    }

    console.log('Offline session created:', {
      id: session.id,
      shop: session.shop,
      isOnline: session.isOnline,
    });

    // Store the offline session
    await sessionHandler.storeSession(session);
    console.log('Offline session stored successfully');

    const { shop } = session;

    // Create bundle definition
    try {
      const client = new shopify.clients.Graphql({ session });
      const bundleDefResult = await createBundleDefinition(client);
      console.log('Bundle definition created:', bundleDefResult);
      
      // Update store record - removed scope field
      await prisma.active_stores.upsert({
        where: { shop },
        create: {
          shop,
          isActive: true,
        },
        update: {
          isActive: true,
          setupError: null,
          lastError: null,
        },
      });
      console.log('Store record updated');
    } catch (defError) {
      console.error('Bundle definition creation failed (non-critical):', defError);
      const errorMessage = defError instanceof Error ? defError.message : 'Unknown error';
      
      await prisma.active_stores.upsert({
        where: { shop },
        create: {
          shop,
          isActive: true,
          setupError: errorMessage,
        },
        update: {
          setupError: errorMessage,
        },
      });
    }

    // Get host from query for redirect
    const host = req.query.host as string;
    
    // Redirect directly to the app
    const redirectUrl = host 
      ? `/?shop=${shop}&host=${host}`
      : `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`;
    
    console.log('Auth complete! Redirecting to:', redirectUrl);
    
    return res.redirect(redirectUrl);

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
          },
          update: {
            lastError: errorMessage,
            lastErrorAt: new Date(),
            isActive: false,
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
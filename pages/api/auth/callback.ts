import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/prisma";
import { createBundleDefinition } from "@/utils/shopifyQueries/createBundleDefinition";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('=== AUTH CALLBACK START ===');
    console.log('Query params:', req.query);

    // Exchange code for OFFLINE access token
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;
    
    if (!session) {
      throw new Error('No session returned from Shopify');
    }

    console.log('Session received:', {
      id: session.id,
      shop: session.shop,
      isOnline: session.isOnline,
      accessToken: session.accessToken ? 'EXISTS' : 'MISSING',
    });

    // Store the offline session
    await sessionHandler.storeSession(session);
    console.log('✓ Session stored with ID:', session.id);

    // Verify session was stored
    const storedSession = await sessionHandler.loadSession(session.id);
    if (!storedSession) {
      throw new Error(`Session was not stored correctly. ID: ${session.id}`);
    }
    console.log('✓ Session verified in database');

    const { shop } = session;

    // Create bundle definition
    try {
      const client = new shopify.clients.Graphql({ session });
      await createBundleDefinition(client);
      console.log('✓ Bundle definition created');
      
      // Update store record
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
      console.log('✓ Store record updated');
    } catch (defError) {
      console.error('Bundle definition creation failed:', defError);
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
    
    console.log('=== AUTH CALLBACK SUCCESS ===');
    console.log('Redirecting to:', redirectUrl);
    
    return res.redirect(redirectUrl);

  } catch (error) {
    console.error('=== AUTH CALLBACK ERROR ===', error);
    
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
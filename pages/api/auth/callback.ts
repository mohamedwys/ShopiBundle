import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/prisma";
import { createBundleDefinition } from "@/utils/shopifyQueries/createBundleDefinition";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Online token callback received');

    // Exchange code for ONLINE access token
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;
    
    if (!session) {
      throw new Error('No session returned from Shopify');
    }

    console.log('Online token received, storing session');

    // Store the online session
    await sessionHandler.storeSession(session);

    const { shop } = session;

    // Create bundle definition (only needs to happen once)
    try {
      const client = new shopify.clients.Graphql({ session });
      const bundleDefResult = await createBundleDefinition(client);
      console.log('Bundle definition created:', bundleDefResult);
    } catch (defError) {
      console.error('Bundle definition creation failed (non-critical):', defError);
      const errorMessage = defError instanceof Error ? defError.message : 'Unknown error';
      
      await prisma.active_stores.update({
        where: { shop },
        data: { setupError: errorMessage }
      });
    }

    // CRITICAL: Redirect to Shopify admin embedded app
    const redirectUrl = `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`;
    
    console.log('Redirecting to app:', redirectUrl);
    
    return res.redirect(redirectUrl);

  } catch (error) {
    console.error('===> Online token callback error:', error);
    
    const { shop } = req.query;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (shop && typeof shop === 'string') {
      try {
        await prisma.active_stores.update({
          where: { shop },
          data: { 
            lastError: errorMessage,
            lastErrorAt: new Date()
          },
        });
      } catch (dbError) {
        console.error('Failed to update error:', dbError);
      }
      
      // Restart from beginning
      return res.redirect(`/api?shop=${shop}`);
    }

    return res.status(500).send(errorMessage);
  }
};

export default handler;

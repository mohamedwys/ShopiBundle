import { NextApiRequest, NextApiResponse } from 'next';
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Online auth callback received');

    // Exchange code for ONLINE access token
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;
    
    if (!session) {
      throw new Error('No online session returned from Shopify');
    }

    console.log('Online session received for shop:', session.shop);

    // Store the online session
    await sessionHandler.storeSession(session);

    const { shop } = session;
    const host = req.query.host as string;

    // Determine redirect URL
    let redirectUrl: string;

    if (host) {
      // Redirect back to the app with host parameter
      redirectUrl = `/?shop=${shop}&host=${host}`;
    } else {
      // Fallback to Shopify admin
      redirectUrl = `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`;
    }
    
    console.log('Auth complete! Redirecting to:', redirectUrl);
    
    return res.redirect(redirectUrl);

  } catch (error) {
    console.error('===> Online auth callback error:', error);
    
    const { shop } = req.query;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (shop && typeof shop === 'string') {
      // Restart auth flow
      return res.redirect(`/api?shop=${shop}`);
    }

    return res.status(500).send(errorMessage);
  }
};

export default handler;
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/prisma";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { shop, code, state, host } = req.query;

    console.log('Token callback received:', { 
      shop, 
      hasCode: !!code, 
      hasState: !!state,
      host 
    });

    if (!shop || typeof shop !== 'string') {
      throw new Error('Missing shop parameter');
    }

    if (!code || typeof code !== 'string') {
      throw new Error('Missing authorization code');
    }

    // CRITICAL FIX: Manually exchange code for token (bypasses cookie validation)
    const sanitizedShop = shopify.utils.sanitizeShop(shop);
    
    // Build the access token request
    const accessTokenResponse = await new shopify.clients.Rest({
      session: shopify.session.customAppSession(sanitizedShop),
    }).post({
      path: 'oauth/access_token',
      data: {
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      },
    });

    const { access_token, scope } = accessTokenResponse.body as {
      access_token: string;
      scope: string;
    };

    console.log('Access token received for:', shop);

    // Create session manually
    const session = shopify.session.customAppSession(sanitizedShop);
    session.accessToken = access_token;
    session.scope = scope;

    // Store session
    await sessionHandler.storeSession(session);
    console.log('Session stored successfully');

    // Register webhooks
    try {
      const webhookRegisterResponse = await shopify.webhooks.register({
        session,
      });
      console.log('Webhooks registered:', webhookRegisterResponse);
    } catch (webhookError) {
      console.error('Webhook registration failed:', webhookError);
    }

    // Mark shop as active
    await prisma.active_stores.upsert({
      where: { shop: sanitizedShop },
      update: { isActive: true },
      create: { shop: sanitizedShop, isActive: true },
    });

    console.log('Shop activated:', sanitizedShop);

    // Redirect to app
    const redirectUrl = `https://${sanitizedShop}/admin/apps/${process.env.SHOPIFY_API_KEY}`;
    console.log('Redirecting to:', redirectUrl);
    
    return res.redirect(redirectUrl);

  } catch (error) {
    console.error('===> Token callback error:', error);
    
    const { shop } = req.query;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (shop && typeof shop === 'string') {
      await prisma.active_stores.upsert({
        where: { shop },
        update: { isActive: false },
        create: { shop, isActive: false },
      });
    }

    return res.status(500).send(`Authentication failed: ${errorMessage}`);
  }
};

export default handler;
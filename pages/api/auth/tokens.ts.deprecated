import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/prisma";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";
import { Session } from "@shopify/shopify-api";

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

    const sanitizedShop = shopify.utils.sanitizeShop(shop);
    
    console.log('Exchanging code for access token...');

    // Manually exchange authorization code for access token
    const tokenResponse = await fetch(
      `https://${sanitizedShop}/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_API_KEY,
          client_secret: process.env.SHOPIFY_API_SECRET,
          code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${errorText}`);
    }

    const tokenData = await tokenResponse.json() as {
      access_token: string;
      scope: string;
    };

    console.log('✓ Access token received from Shopify:', {
      shop,
      tokenLength: tokenData.access_token.length,
      tokenPrefix: tokenData.access_token.substring(0, 6) + '...',
      tokenSuffix: '...' + tokenData.access_token.substring(tokenData.access_token.length - 4),
      scope: tokenData.scope,
      looksValid: tokenData.access_token.length > 50 &&
                  (tokenData.access_token.startsWith('shpat_') ||
                   tokenData.access_token.startsWith('shpca_'))
    });

    // Create session manually
    const session = new Session({
      id: `offline_${sanitizedShop}`,
      shop: sanitizedShop,
      state: typeof state === 'string' ? state : '',
      isOnline: false,
      accessToken: tokenData.access_token,
      scope: tokenData.scope,
    });

    // Store session
    await sessionHandler.storeSession(session);
    console.log('Session stored successfully');

    // Register webhooks
    try {
      const webhookRegisterResponse = await shopify.webhooks.register({
        session,
      });
      console.log('Webhooks registered:', JSON.stringify(webhookRegisterResponse, null, 2));
    } catch (webhookError) {
      console.error('Webhook registration failed (non-critical):', webhookError);
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
      try {
        await prisma.active_stores.upsert({
          where: { shop },
          update: { isActive: false },
          create: { shop, isActive: false },
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    return res.status(500).send(`Authentication failed: ${errorMessage}`);
  }
};

export default handler;
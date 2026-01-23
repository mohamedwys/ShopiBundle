import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/prisma";
import { createBundleDefinition } from "@/utils/shopifyQueries/createBundleDefinition";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";
import { logAuthDebug, validateShopifyRedirect } from "@/utils/authDebug";
import crypto from 'crypto';
import { Session } from '@shopify/shopify-api';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    logAuthDebug('AUTH CALLBACK', req);

    const validation = validateShopifyRedirect(req);
    if (!validation.valid) {
      console.error('OAuth callback validation failed:', validation.errors);
      validation.errors.forEach(error => console.error(`  - ${error}`));
    }

    const { code, hmac, shop, state, host } = req.query;

    if (!shop || typeof shop !== 'string') {
      throw new Error('Missing shop parameter');
    }

    if (!code || typeof code !== 'string') {
      throw new Error('Missing authorization code');
    }

    if (!state || typeof state !== 'string') {
      throw new Error('Missing state parameter');
    }

    if (!hmac || typeof hmac !== 'string') {
      throw new Error('Missing HMAC signature');
    }

    const sanitizedShop = shopify.utils.sanitizeShop(shop);

    if (!sanitizedShop) {
      throw new Error('Invalid shop domain');
    }

    console.log('Processing cookieless OAuth callback for shop:', sanitizedShop);

    // Verify HMAC
    const queryParams = { ...req.query };
    delete queryParams.hmac;

    const message = Object.keys(queryParams)
      .sort()
      .map(key => `${key}=${queryParams[key]}`)
      .join('&');

    const generatedHmac = crypto
      .createHmac('sha256', process.env.SHOPIFY_API_SECRET!)
      .update(message)
      .digest('hex');

    if (generatedHmac !== hmac) {
      throw new Error('HMAC validation failed - request may be forged');
    }

    console.log('✓ HMAC validation passed');

    // Verify state from database (CSRF protection)
    const oauthState = await prisma.oauth_state.findUnique({
      where: { state },
    });

    if (!oauthState) {
      throw new Error('Invalid OAuth state - possible CSRF attack');
    }

    if (oauthState.shop !== sanitizedShop) {
      throw new Error('Shop mismatch in OAuth state');
    }

    console.log('✓ OAuth state verified from database');

    // Clean up old OAuth states (older than 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    await prisma.oauth_state.deleteMany({
      where: {
        createdAt: {
          lt: tenMinutesAgo,
        },
      },
    });

    // Delete the used state
    await prisma.oauth_state.delete({
      where: { state },
    });

    console.log('✓ OAuth state cleaned up');

    // Exchange authorization code for access token
    const tokenUrl = `https://${sanitizedShop}/admin/oauth/access_token`;
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${tokenResponse.status} ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, scope } = tokenData;

    if (!access_token) {
      throw new Error('No access token received from Shopify');
    }

    console.log('✓ Access token received from Shopify');

    // Validate token format
    const tokenLength = access_token.length;
    const tokenPrefix = access_token.substring(0, 6);

    console.log('Token info:', {
      length: tokenLength,
      prefix: tokenPrefix + '...',
    });

    if (!tokenPrefix.startsWith('shpat_') && !tokenPrefix.startsWith('shpca_')) {
      throw new Error(`Invalid token prefix: ${tokenPrefix}`);
    }

    if (tokenLength < 30) {
      throw new Error(`Token too short: ${tokenLength} chars`);
    }

    console.log('✓ Token validation passed');

    // Create session manually
    const sessionId = shopify.session.getOfflineId(sanitizedShop);
    const session = new Session({
      id: sessionId,
      shop: sanitizedShop,
      state: state,
      isOnline: false,
      accessToken: access_token,
      scope: scope,
    });

    console.log('Session created:', {
      id: session.id,
      shop: session.shop,
      isOnline: session.isOnline,
      scope: session.scope,
    });

    // Store the offline session
    await sessionHandler.storeSession(session);
    console.log('✓ Session stored with ID:', session.id);

    // Verify session was stored
    const storedSession = await sessionHandler.loadSession(session.id);
    if (!storedSession || !storedSession.accessToken) {
      throw new Error('Session storage verification failed');
    }

    console.log('✓ Session verified in database');

    // Create bundle definition
    try {
      const client = new shopify.clients.Graphql({ session });
      await createBundleDefinition(client);
      console.log('✓ Bundle definition created');

      // Update store record
      await prisma.active_stores.upsert({
        where: { shop: sanitizedShop },
        create: {
          shop: sanitizedShop,
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
        where: { shop: sanitizedShop },
        create: {
          shop: sanitizedShop,
          isActive: true,
          setupError: errorMessage,
        },
        update: {
          setupError: errorMessage,
        },
      });
    }

    // Redirect to app
    const redirectUrl = host && typeof host === 'string'
      ? `/?shop=${sanitizedShop}&host=${host}`
      : `https://${sanitizedShop}/admin/apps/${process.env.SHOPIFY_API_KEY}`;

    console.log('=== AUTH CALLBACK SUCCESS ===');
    console.log('Redirecting to:', redirectUrl);

    return res.redirect(redirectUrl);

  } catch (error) {
    console.error('=== AUTH CALLBACK ERROR ===', error);

    const { shop } = req.query;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (shop && typeof shop === 'string') {
      const sanitizedShop = shopify.utils.sanitizeShop(shop);
      if (sanitizedShop) {
        try {
          await prisma.active_stores.upsert({
            where: { shop: sanitizedShop },
            create: {
              shop: sanitizedShop,
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
        return res.redirect(`/api?shop=${sanitizedShop}`);
      }
    }

    return res.status(500).send(errorMessage);
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;

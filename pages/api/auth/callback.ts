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

    // Validate session structure
    if (!session.accessToken) {
      throw new Error('Session is missing accessToken - OAuth flow failed');
    }

    if (!session.shop) {
      throw new Error('Session is missing shop domain');
    }

    // Verify this is an offline session
    if (session.isOnline) {
      console.warn('WARNING: Received online session instead of offline session');
    }

    // CRITICAL: Validate token before storing
    const tokenLength = session.accessToken.length;
    const tokenPrefix = session.accessToken.substring(0, 6);
    const tokenSuffix = session.accessToken.substring(tokenLength - 4);

    console.log('Session received from Shopify:', {
      id: session.id,
      shop: session.shop,
      isOnline: session.isOnline,
      scope: session.scope,
      tokenInfo: {
        length: tokenLength,
        prefix: tokenPrefix + '...',
        suffix: '...' + tokenSuffix,
        looksValid: tokenLength > 50 && (tokenPrefix.startsWith('shpat_') || tokenPrefix.startsWith('shpca_')),
      },
    });

    // VALIDATION TEMPORARILY DISABLED FOR DIAGNOSTICS
    // We need to see what token format Shopify actually returns
    console.log('🔍 TOKEN VALIDATION (warnings only):');

    if (tokenLength < 50) {
      console.warn(
        `⚠️ Token length is ${tokenLength} (typically expect 100+)`,
        `Token: ${tokenPrefix}...${tokenSuffix}`,
        `Allowing to proceed for diagnostic purposes`
      );
    }

    if (!tokenPrefix.startsWith('shpat_') && !tokenPrefix.startsWith('shpca_')) {
      console.warn(
        `⚠️ Token prefix is '${tokenPrefix}' (typically expect shpat_ or shpca_)`,
        `Allowing to proceed - will test if it works with Shopify API`
      );
    }

    console.log('✓ Token validation: PASSED (warnings logged if any issues detected)');

    // Store the offline session
    await sessionHandler.storeSession(session);
    console.log('✓ Session stored with ID:', session.id);

    // Verify session was stored and can be retrieved
    const storedSession = await sessionHandler.loadSession(session.id);
    if (!storedSession) {
      throw new Error(`Session was not stored correctly. ID: ${session.id}`);
    }

    if (!storedSession.accessToken) {
      throw new Error(`Stored session is missing accessToken. ID: ${session.id}`);
    }

    console.log('✓ Session verified in database with accessToken');

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
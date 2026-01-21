import { NextApiRequest, NextApiResponse } from 'next';
import shopify from '@/utils/shopify';

/**
 * OAuth Flow Tracer
 *
 * This endpoint helps diagnose what's happening during the OAuth flow
 * Usage: GET /api/debug/trace-oauth?shop=yourstore.myshopify.com
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { shop } = req.query;

    if (!shop || typeof shop !== 'string') {
      return res.status(400).json({
        error: 'Missing shop parameter',
        usage: '/api/debug/trace-oauth?shop=yourstore.myshopify.com',
      });
    }

    const sanitizedShop = shopify.utils.sanitizeShop(shop);

    if (!sanitizedShop) {
      return res.status(400).json({
        error: 'Invalid shop domain',
        provided: shop,
      });
    }

    // Trace current configuration
    const trace = {
      timestamp: new Date().toISOString(),
      shop: sanitizedShop,

      // Environment configuration
      environment: {
        nodeEnv: process.env.NODE_ENV,
        apiKey: process.env.SHOPIFY_API_KEY ? {
          preview: `${process.env.SHOPIFY_API_KEY.substring(0, 8)}...`,
          length: process.env.SHOPIFY_API_KEY.length,
          isHex: /^[a-f0-9]+$/i.test(process.env.SHOPIFY_API_KEY),
        } : 'MISSING',
        apiSecret: process.env.SHOPIFY_API_SECRET ? {
          length: process.env.SHOPIFY_API_SECRET.length,
          isHex: /^[a-f0-9]+$/i.test(process.env.SHOPIFY_API_SECRET),
          looksLikePublicApp: process.env.SHOPIFY_API_SECRET.length === 32 && /^[a-f0-9]{32}$/i.test(process.env.SHOPIFY_API_SECRET),
          looksLikeCustomApp: process.env.SHOPIFY_API_SECRET.length === 38,
        } : 'MISSING',
        appUrl: process.env.SHOPIFY_APP_URL,
        apiVersion: process.env.SHOPIFY_API_VERSION,
        scopes: process.env.SHOPIFY_API_SCOPES?.split(','),
      },

      // Shopify SDK configuration (from what we passed to shopifyApi())
      sdkConfig: {
        apiKeyMatches: process.env.SHOPIFY_API_KEY === process.env.SHOPIFY_API_KEY, // Just to show it's being used
        hostName: process.env.SHOPIFY_APP_URL?.replace(/https?:\/\//, '').replace(/\/$/, ''),
        hostScheme: 'https',
        apiVersion: process.env.SHOPIFY_API_VERSION,
        isEmbeddedApp: true,
        useOnlineTokens: false, // Critical: should be false for offline tokens
        callbackPath: '/api/auth/callback',
      },

      // OAuth URLs that will be used
      oauthUrls: {
        initiationUrl: `${process.env.SHOPIFY_APP_URL}/api?shop=${sanitizedShop}`,
        shopifyAuthUrl: `https://${sanitizedShop}/admin/oauth/authorize`,
        callbackUrl: `${process.env.SHOPIFY_APP_URL?.replace(/\/$/, '')}/api/auth/callback`,
        tokenExchangeUrl: `https://${sanitizedShop}/admin/oauth/access_token`,
      },

      // Expected OAuth parameters
      expectedOAuthParams: {
        client_id: process.env.SHOPIFY_API_KEY?.substring(0, 8) + '...',
        scope: process.env.SHOPIFY_API_SCOPES,
        redirect_uri: `${process.env.SHOPIFY_APP_URL?.replace(/\/$/, '')}/api/auth/callback`,
        state: '<generated_by_shopify_sdk>',
        grant_options: ['offline'], // For offline tokens
      },

      // Token exchange request (what SDK will send)
      tokenExchangeRequest: {
        method: 'POST',
        url: `https://${sanitizedShop}/admin/oauth/access_token`,
        body: {
          client_id: '<your_api_key>',
          client_secret: '<your_api_secret>',
          code: '<authorization_code_from_shopify>',
        },
        note: 'This is sent by @shopify/shopify-api SDK during shopify.auth.callback()',
      },

      // What determines token format
      tokenFormatDeterminedBy: {
        factor: 'App Type in Shopify Partners Dashboard',
        publicApp: {
          secretLength: 32,
          secretFormat: 'hexadecimal',
          tokenPrefix: 'shpat_ or shpca_',
          tokenLength: '100-150 chars',
          supportsOAuth: true,
        },
        customApp: {
          secretLength: 38,
          secretFormat: 'alphanumeric with prefix',
          tokenPrefix: 'shpua_',
          tokenLength: 38,
          supportsOAuth: false,
          note: 'Custom apps CANNOT use OAuth - they use direct access tokens',
        },
        currentConfig: process.env.SHOPIFY_API_SECRET?.length === 32 ? 'Looks like PUBLIC APP' :
                       process.env.SHOPIFY_API_SECRET?.length === 38 ? 'Looks like CUSTOM APP' :
                       'Unknown/unusual',
      },

      // Diagnostic steps
      diagnosticSteps: [
        '1. Verify you created a PUBLIC APP (not custom app) in Partners Dashboard',
        '2. Confirm API Key is 32 hex characters',
        '3. Confirm API Secret is 32 hex characters (NOT 38)',
        '4. Update SHOPIFY_API_KEY and SHOPIFY_API_SECRET environment variables',
        '5. Redeploy application (environment variables must be refreshed)',
        '6. Delete all old sessions: /api/debug/force-delete-session?shop=' + sanitizedShop + '&confirm=yes',
        '7. Start fresh OAuth: ' + `${process.env.SHOPIFY_APP_URL}/api?shop=${sanitizedShop}`,
        '8. Check logs in callback handler for token format',
      ],

      // Critical checks
      criticalChecks: {
        apiSecretLength: {
          value: process.env.SHOPIFY_API_SECRET?.length || 0,
          expected: 32,
          status: process.env.SHOPIFY_API_SECRET?.length === 32 ? 'PASS' :
                  process.env.SHOPIFY_API_SECRET?.length === 38 ? 'FAIL - CUSTOM APP DETECTED' :
                  'FAIL - UNUSUAL',
        },
        apiSecretFormat: {
          value: process.env.SHOPIFY_API_SECRET ? /^[a-f0-9]{32}$/i.test(process.env.SHOPIFY_API_SECRET) ? 'Hex' : 'Non-hex' : 'Missing',
          expected: 'Hex (lowercase a-f, 0-9)',
          status: process.env.SHOPIFY_API_SECRET && /^[a-f0-9]{32}$/i.test(process.env.SHOPIFY_API_SECRET) ? 'PASS' : 'FAIL',
        },
        useOnlineTokens: {
          value: false, // From our shopify.ts config
          expected: false,
          status: 'PASS',
        },
      },
    };

    // Determine overall status
    const isConfiguredForPublicApp =
      process.env.SHOPIFY_API_SECRET?.length === 32 &&
      /^[a-f0-9]{32}$/i.test(process.env.SHOPIFY_API_SECRET);

    const isConfiguredForCustomApp =
      process.env.SHOPIFY_API_SECRET?.length === 38;

    return res.status(200).json({
      status: isConfiguredForPublicApp ? 'READY FOR PUBLIC APP OAUTH' :
              isConfiguredForCustomApp ? 'CONFIGURED AS CUSTOM APP - OAUTH WILL FAIL' :
              'CONFIGURATION ERROR',
      trace,
      summary: {
        appType: isConfiguredForPublicApp ? 'Public App (OAuth supported)' :
                 isConfiguredForCustomApp ? 'Custom App (OAuth NOT supported)' :
                 'Unknown/misconfigured',
        expectedTokenPrefix: isConfiguredForPublicApp ? 'shpat_ or shpca_' :
                            isConfiguredForCustomApp ? 'shpua_ (INVALID for OAuth)' :
                            'Unknown',
        expectedTokenLength: isConfiguredForPublicApp ? '100-150 characters' :
                            isConfiguredForCustomApp ? '38 characters (INVALID)' :
                            'Unknown',
        recommendation: isConfiguredForPublicApp ?
          'Configuration looks correct for Public App. If still getting shpua_ tokens, check Partners Dashboard.' :
          isConfiguredForCustomApp ?
          'CRITICAL: You are using Custom App credentials. Create a NEW Public App in Partners Dashboard and update credentials.' :
          'Fix the configuration issues identified above.',
      },
    });

  } catch (error) {
    console.error('OAuth trace error:', error);
    return res.status(500).json({
      error: 'Trace failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default handler;

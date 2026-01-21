import { NextApiRequest, NextApiResponse } from 'next';
import shopify from '@/utils/shopify';
import prisma from '@/utils/prisma';

/**
 * OAuth Readiness Check
 *
 * This endpoint performs a comprehensive pre-flight check before OAuth
 * to ensure the app is properly configured to receive valid tokens.
 *
 * Usage: GET /api/debug/oauth-readiness?shop=yourstore.myshopify.com
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { shop } = req.query;

    if (!shop || typeof shop !== 'string') {
      return res.status(400).json({
        error: 'Missing shop parameter',
        usage: '/api/debug/oauth-readiness?shop=yourstore.myshopify.com',
      });
    }

    const sanitizedShop = shopify.utils.sanitizeShop(shop);

    if (!sanitizedShop) {
      return res.status(400).json({
        error: 'Invalid shop domain',
        provided: shop,
      });
    }

    const checks = [];
    let readyForOAuth = true;

    // Check 1: Environment variables
    const envVarsOk =
      !!process.env.SHOPIFY_API_KEY &&
      !!process.env.SHOPIFY_API_SECRET &&
      !!process.env.SHOPIFY_APP_URL &&
      !!process.env.SHOPIFY_API_VERSION;

    checks.push({
      name: 'Environment Variables',
      status: envVarsOk ? 'PASS' : 'FAIL',
      details: {
        apiKeySet: !!process.env.SHOPIFY_API_KEY,
        apiSecretSet: !!process.env.SHOPIFY_API_SECRET,
        appUrlSet: !!process.env.SHOPIFY_APP_URL,
        apiVersionSet: !!process.env.SHOPIFY_API_VERSION,
      },
    });

    if (!envVarsOk) readyForOAuth = false;

    // Check 2: App URL configuration
    const appUrl = process.env.SHOPIFY_APP_URL || '';
    const appUrlValid = appUrl.startsWith('https://') && !appUrl.endsWith('/');

    checks.push({
      name: 'App URL Configuration',
      status: appUrlValid ? 'PASS' : 'FAIL',
      details: {
        url: appUrl,
        usesHttps: appUrl.startsWith('https://'),
        noTrailingSlash: !appUrl.endsWith('/'),
        expectedCallbackUrl: `${appUrl}/api/auth/callback`,
      },
    });

    if (!appUrlValid) readyForOAuth = false;

    // Check 3: API credentials format
    const apiKey = process.env.SHOPIFY_API_KEY || '';
    const apiKeyValid = /^[a-f0-9]{32}$/i.test(apiKey);

    checks.push({
      name: 'API Key Format',
      status: apiKeyValid ? 'PASS' : 'WARNING',
      details: {
        length: apiKey.length,
        expectedLength: 32,
        format: apiKeyValid ? 'Valid hex format' : 'Unusual format',
        preview: apiKey ? `${apiKey.substring(0, 8)}...` : 'MISSING',
      },
    });

    if (!apiKeyValid) {
      checks[checks.length - 1].warning =
        'API key format is unusual. This may indicate a legacy or incorrectly configured app in Shopify Partners Dashboard.';
    }

    // Check 4: API version
    const apiVersion = process.env.SHOPIFY_API_VERSION || '';
    const versionValid = /^\d{4}-\d{2}$/.test(apiVersion);

    checks.push({
      name: 'API Version',
      status: versionValid ? 'PASS' : 'FAIL',
      details: {
        version: apiVersion,
        format: versionValid ? 'Valid (YYYY-MM)' : 'Invalid',
      },
    });

    if (!versionValid) readyForOAuth = false;

    // Check 5: Database connectivity
    let dbConnected = false;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch (dbError) {
      console.error('Database check failed:', dbError);
    }

    checks.push({
      name: 'Database Connection',
      status: dbConnected ? 'PASS' : 'FAIL',
      details: {
        connected: dbConnected,
      },
    });

    if (!dbConnected) readyForOAuth = false;

    // Check 6: Existing sessions
    let existingSession = null;
    try {
      const sessionId = `offline_${sanitizedShop}`;
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
      });

      if (session) {
        const sessionData = JSON.parse(session.content || '{}');
        existingSession = {
          id: sessionId,
          hasAccessToken: !!sessionData.accessToken,
          tokenLength: sessionData.accessToken?.length || 0,
          tokenPrefix: sessionData.accessToken?.substring(0, 6) || 'N/A',
          isValid:
            sessionData.accessToken &&
            sessionData.accessToken.length > 50 &&
            (sessionData.accessToken.startsWith('shpat_') ||
              sessionData.accessToken.startsWith('shpca_')),
        };
      }
    } catch (sessionError) {
      console.error('Session check failed:', sessionError);
    }

    checks.push({
      name: 'Existing Session',
      status: existingSession
        ? existingSession.isValid
          ? 'PASS'
          : 'WARNING'
        : 'INFO',
      details: existingSession || { message: 'No existing session found' },
    });

    if (existingSession && !existingSession.isValid) {
      checks[checks.length - 1].warning =
        'An invalid session exists. It will be replaced during OAuth. ' +
        'If you continue to get invalid tokens, the issue is in Shopify Partners Dashboard configuration.';
    }

    // Check 7: Shopify SDK configuration
    checks.push({
      name: 'Shopify SDK Configuration',
      status: 'INFO',
      details: {
        useOnlineTokens: false,
        isEmbeddedApp: true,
        hostScheme: 'https',
        expectedTokenType: 'Offline (shop-specific, permanent)',
        expectedTokenPrefix: 'shpat_ or shpca_',
        expectedTokenLength: '100+ characters',
      },
    });

    // Generate OAuth URL for testing
    const oauthUrl = `${process.env.SHOPIFY_APP_URL}/api?shop=${sanitizedShop}`;

    // Final assessment
    const assessment = {
      ready: readyForOAuth,
      status: readyForOAuth ? 'READY' : 'NOT READY',
      shop: sanitizedShop,
      timestamp: new Date().toISOString(),
      checks,
      oauthUrl: readyForOAuth ? oauthUrl : undefined,
      partnersConfiguration: {
        message: 'Ensure these settings match in Shopify Partners Dashboard',
        appUrl: process.env.SHOPIFY_APP_URL,
        redirectUrl: `${process.env.SHOPIFY_APP_URL}/api/auth/callback`,
        apiVersion: process.env.SHOPIFY_API_VERSION,
        scopes: process.env.SHOPIFY_API_SCOPES?.split(','),
        clientId: apiKey ? `${apiKey.substring(0, 8)}...` : 'MISSING',
      },
      knownIssue: {
        problem: 'Receiving shpua_ tokens (38 chars) instead of shpat_/shpca_ tokens (100+ chars)',
        cause: 'App misconfiguration in Shopify Partners Dashboard',
        solutions: [
          '1. Verify app is created as "Public app" (not custom/legacy type)',
          '2. Confirm Client ID in Partners matches your SHOPIFY_API_KEY',
          '3. Check redirect URLs match exactly',
          '4. Try rotating API credentials in Partners Dashboard',
          '5. If all else fails, create a new app in Partners Dashboard',
        ],
        documentation: 'See SHOPIFY_APP_FIX_GUIDE.md for detailed steps',
      },
      nextSteps: readyForOAuth
        ? [
            `Visit: ${oauthUrl}`,
            'Complete OAuth flow',
            'Check token format using: /api/debug/check-session?shop=' + sanitizedShop,
            'If you get shpua_ token, fix Shopify Partners Dashboard configuration',
          ]
        : [
            'Fix the failed checks above',
            'Update environment variables',
            'Verify Shopify Partners Dashboard settings',
            'Run this check again',
          ],
    };

    return res.status(readyForOAuth ? 200 : 400).json(assessment);

  } catch (error) {
    console.error('OAuth readiness check error:', error);
    return res.status(500).json({
      error: 'Readiness check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default handler;

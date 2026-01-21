import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/prisma";
import shopify from "@/utils/shopify";
import { Session } from '@shopify/shopify-api';

// Define the expected GraphQL response structure
interface ShopQueryResponse {
  data?: {
    shop?: {
      name: string;
      email: string;
      myshopifyDomain: string;
      plan: {
        displayName: string;
      };
    };
  };
}

/**
 * Validates if the stored access token actually works with Shopify
 * Visit: /api/debug/validate-token?shop=YOUR_SHOP.myshopify.com
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const shop = (req.query.shop as string) || "galactiva.myshopify.com";

    console.log('=== TOKEN VALIDATION START ===');
    console.log('Shop:', shop);

    const results: any = {
      timestamp: new Date().toISOString(),
      shop,
      checks: {},
      issues: [],
      recommendations: [],
    };

    // 1. Check environment configuration
    const apiVersion = process.env.SHOPIFY_API_VERSION;
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiSecret = process.env.SHOPIFY_API_SECRET;
    const scopes = process.env.SHOPIFY_API_SCOPES;

    results.checks.environment = {
      apiVersion,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      scopes: scopes?.split(','),
    };

    // 2. Get session from database
    const sessionId = shopify.session.getOfflineId(shop);
    const sessionData = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!sessionData) {
      results.issues.push('❌ No session found in database');
      results.recommendations.push('Reinstall the app: /api?shop=' + shop);
      return res.status(404).json(results);
    }

    const sessionContent = JSON.parse(sessionData.content);
    const token = sessionContent.accessToken;
    const tokenLength = token?.length || 0;
    const tokenPrefix = token?.substring(0, 6) || '';

    results.checks.session = {
      exists: true,
      sessionId,
      hasAccessToken: !!token,
      tokenLength,
      tokenPrefix: tokenPrefix + '...',
      tokenSuffix: '...' + token?.substring(token.length - 4),
      scope: sessionContent.scope,
      isOnline: sessionContent.isOnline,
    };

    if (!token) {
      results.issues.push('❌ Session has no access token');
      results.recommendations.push('Reinstall the app to generate new token');
      return res.status(200).json(results);
    }

    // 3. Validate token format
    if (tokenLength < 30) {
      results.issues.push(`❌ Token is too short (${tokenLength} chars, should be 30+)`);
      results.recommendations.push('Force delete session: /api/debug/force-delete-session?shop=' + shop + '&confirm=yes');
      results.recommendations.push('Then reinstall the app');
    }

    if (!tokenPrefix.startsWith('shpat_') && !tokenPrefix.startsWith('shpca_')) {
      results.issues.push(`❌ Token has invalid prefix: ${tokenPrefix}`);
      results.recommendations.push('Token should start with shpat_ or shpca_');
      results.recommendations.push('Reinstall the app to get valid token');
    }

    // 4. Test token with a simple GraphQL query
    console.log('Testing token with Shopify API...');

    try {
      const session = new Session({
        id: sessionId,
        shop,
        state: 'test',
        isOnline: false,
        accessToken: token,
      });

      const client = new shopify.clients.Graphql({ session });

      // Try a simple query to test token validity
      const response = await client.query({
        data: {
          query: `{
            shop {
              name
              email
              myshopifyDomain
              plan {
                displayName
              }
            }
          }`,
        },
      });

      // Type assert the response body to our expected structure
      const responseBody = response.body as ShopQueryResponse;

      // Check if response has data
      if (responseBody && responseBody.data && responseBody.data.shop) {
        const shopData = responseBody.data.shop;

        results.checks.tokenValidation = {
          valid: true,
          shopName: shopData.name,
          shopEmail: shopData.email,
          shopDomain: shopData.myshopifyDomain,
          plan: shopData.plan.displayName,
        };

        console.log('✓ Token is VALID!');
        results.recommendations.push('✓ Token is working correctly!');
      } else {
        // Token worked but response is unexpected
        results.checks.tokenValidation = {
          valid: true,
          shopName: 'Unknown (unexpected response format)',
          shopEmail: 'Unknown',
          shopDomain: shop,
          plan: 'Unknown',
        };

        console.log('✓ Token is VALID (but response format unexpected)');
        results.recommendations.push('✓ Token is working but response format was unexpected');
      }

    } catch (apiError: any) {
      console.error('Token validation failed:', apiError);

      results.checks.tokenValidation = {
        valid: false,
        error: apiError.message,
        statusCode: apiError.response?.statusCode || apiError.networkStatusCode,
      };

      if (apiError.networkStatusCode === 401 || apiError.response?.statusCode === 401) {
        results.issues.push('❌ Token is INVALID - Shopify returned 401 Unauthorized');
        results.issues.push('This means the token was rejected by Shopify');
        results.recommendations.push('SOLUTION: Delete session and reinstall app');
        results.recommendations.push('Step 1: /api/debug/force-delete-session?shop=' + shop + '&confirm=yes');
        results.recommendations.push('Step 2: Uninstall app from Shopify admin');
        results.recommendations.push('Step 3: Wait 30 seconds');
        results.recommendations.push('Step 4: Reinstall app via /api?shop=' + shop);
      } else {
        results.issues.push(`❌ API Error: ${apiError.message}`);
        results.recommendations.push('Check if shop domain is correct: ' + shop);
      }
    }

    // 5. Check for scope mismatch
    const configuredScopes = scopes?.split(',').map(s => s.trim()) || [];
    const sessionScopes = sessionContent.scope?.split(',').map((s: string) => s.trim()) || [];

    results.checks.scopes = {
      configured: configuredScopes,
      inSession: sessionScopes,
      match: JSON.stringify(configuredScopes.sort()) === JSON.stringify(sessionScopes.sort()),
    };

    if (!results.checks.scopes.match) {
      results.issues.push('⚠️ Scope mismatch between configuration and session');
      results.issues.push(`Configured: ${configuredScopes.join(', ')}`);
      results.issues.push(`In session: ${sessionScopes.join(', ')}`);
      results.recommendations.push('Reinstall app to update scopes');
    }

    // 6. Overall status
    results.status = results.issues.length === 0 ? 'healthy' : 'issues_found';

    console.log('=== TOKEN VALIDATION COMPLETE ===');
    console.log('Status:', results.status);
    console.log('Issues:', results.issues.length);

    return res.status(200).json(results);

  } catch (error: any) {
    console.error('=== TOKEN VALIDATION ERROR ===', error);
    return res.status(500).json({
      error: 'Validation failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

export default handler;

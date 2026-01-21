import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/prisma";
import shopify from "@/utils/shopify";

/**
 * Comprehensive diagnostic endpoint for troubleshooting the app
 * Visit: /api/diagnostic?shop=YOUR_SHOP.myshopify.com
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const shop = (req.query.shop as string) || "galactiva.myshopify.com";

    console.log('=== DIAGNOSTIC START ===');
    console.log('Shop:', shop);

    const diagnosticResults: any = {
      timestamp: new Date().toISOString(),
      shop,
      status: 'running',
      checks: {},
      issues: [],
      recommendations: [],
    };

    // 1. Check Environment Variables
    diagnosticResults.checks.environment = {
      hasApiKey: !!process.env.SHOPIFY_API_KEY,
      hasApiSecret: !!process.env.SHOPIFY_API_SECRET,
      hasPublicApiKey: !!process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
      apiVersion: process.env.SHOPIFY_API_VERSION,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Missing',
      nodeEnv: process.env.NODE_ENV,
      apiKeyMatch: process.env.SHOPIFY_API_KEY === process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
    };

    if (!diagnosticResults.checks.environment.apiKeyMatch) {
      diagnosticResults.issues.push('⚠️ SHOPIFY_API_KEY and NEXT_PUBLIC_SHOPIFY_API_KEY do not match');
      diagnosticResults.recommendations.push('Ensure both API keys match in environment variables');
    }

    if (!diagnosticResults.checks.environment.hasPublicApiKey) {
      diagnosticResults.issues.push('❌ NEXT_PUBLIC_SHOPIFY_API_KEY is not set');
      diagnosticResults.recommendations.push('Set NEXT_PUBLIC_SHOPIFY_API_KEY in environment variables');
    }

    // 2. Check Database Connectivity
    try {
      await prisma.$queryRaw`SELECT 1`;
      diagnosticResults.checks.database = {
        connected: true,
        provider: 'PostgreSQL (via Prisma)',
      };
    } catch (dbError: any) {
      diagnosticResults.checks.database = {
        connected: false,
        error: dbError.message,
      };
      diagnosticResults.issues.push('❌ Database connection failed');
      diagnosticResults.recommendations.push('Check DATABASE_URL environment variable');
    }

    // 3. Check Session in Database
    const sessionId = shopify.session.getOfflineId(shop);
    const sessionData = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    diagnosticResults.checks.session = {
      sessionId,
      exists: !!sessionData,
    };

    if (sessionData) {
      try {
        const sessionContent = JSON.parse(sessionData.content);
        const hasToken = !!sessionContent.accessToken;
        const token = sessionContent.accessToken || "";
        const tokenLength = token.length;
        const tokenPrefix = token.substring(0, 6);
        const tokenSuffix = token.substring(token.length - 4);

        diagnosticResults.checks.session = {
          ...diagnosticResults.checks.session,
          shop: sessionData.shop,
          hasAccessToken: hasToken,
          tokenLength,
          tokenPrefix: tokenPrefix ? tokenPrefix + "..." : null,
          tokenSuffix: tokenSuffix ? "..." + tokenSuffix : null,
          tokenValid: tokenLength >= 30 && (tokenPrefix.startsWith("shpat_") || tokenPrefix.startsWith("shpca_")),
          scope: sessionContent.scope,
          isOnline: sessionContent.isOnline,
        };

        if (!hasToken) {
          diagnosticResults.issues.push('❌ Session exists but has no access token');
          diagnosticResults.recommendations.push('Reinstall the app to generate a new session');
        } else if (tokenLength < 30) {
          diagnosticResults.issues.push(`❌ Access token is too short (${tokenLength} chars)`);
          diagnosticResults.recommendations.push('Force delete session and reinstall: /api/debug/force-delete-session?shop=' + shop + '&confirm=yes');
        } else if (!tokenPrefix.startsWith("shpat_") && !tokenPrefix.startsWith("shpca_")) {
          diagnosticResults.issues.push('❌ Access token has invalid prefix: ' + tokenPrefix);
          diagnosticResults.recommendations.push('Reinstall the app to get a valid token');
        }
      } catch (parseError: any) {
        diagnosticResults.checks.session.parseError = parseError.message;
        diagnosticResults.issues.push('❌ Failed to parse session content');
      }
    } else {
      diagnosticResults.issues.push('❌ No session found for shop: ' + shop);
      diagnosticResults.recommendations.push('Install or reinstall the app on this shop');
    }

    // 4. Check Active Stores
    const activeStore = await prisma.active_stores.findUnique({
      where: { shop },
    });

    diagnosticResults.checks.activeStore = {
      exists: !!activeStore,
      isActive: activeStore?.isActive,
      setupError: activeStore?.setupError,
      lastError: activeStore?.lastError,
      lastErrorAt: activeStore?.lastErrorAt,
    };

    if (activeStore?.setupError) {
      diagnosticResults.issues.push('⚠️ Setup error: ' + activeStore.setupError);
    }

    if (activeStore?.lastError) {
      diagnosticResults.issues.push('⚠️ Last error: ' + activeStore.lastError);
    }

    // 5. Check Auto Bundle Rules
    try {
      const autoBundleRulesCount = await prisma.auto_bundle_rules.count({
        where: { shop },
      });
      diagnosticResults.checks.autoBundleRules = {
        count: autoBundleRulesCount,
      };
    } catch (bundlesError: any) {
      diagnosticResults.checks.autoBundleRules = {
        error: bundlesError.message,
      };
    }

    // 6. Check Bundle Discounts
    try {
      const bundleDiscountsCount = await prisma.bundle_discount_id.count({
        where: { shop },
      });
      diagnosticResults.checks.bundleDiscounts = {
        count: bundleDiscountsCount,
      };
    } catch (discountError: any) {
      diagnosticResults.checks.bundleDiscounts = {
        error: discountError.message,
      };
    }

    // 7. Overall Status
    diagnosticResults.status = diagnosticResults.issues.length === 0 ? 'healthy' : 'issues_found';

    if (diagnosticResults.issues.length === 0) {
      diagnosticResults.recommendations.push('✓ All checks passed! App should be working correctly.');
    }

    console.log('=== DIAGNOSTIC COMPLETE ===');
    console.log('Status:', diagnosticResults.status);
    console.log('Issues:', diagnosticResults.issues.length);

    return res.status(200).json(diagnosticResults);

  } catch (error: any) {
    console.error('=== DIAGNOSTIC ERROR ===', error);
    return res.status(500).json({
      error: 'Diagnostic failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

export default handler;

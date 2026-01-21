import { NextApiRequest, NextApiResponse } from 'next';
import shopify from '@/utils/shopify';

/**
 * Configuration Validator
 *
 * This endpoint validates that your Shopify app is correctly configured
 * to prevent the "shpua_" invalid token issue.
 *
 * Usage: GET /api/debug/validate-config
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const issues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Check required environment variables
    const requiredEnvVars = [
      'SHOPIFY_API_KEY',
      'SHOPIFY_API_SECRET',
      'SHOPIFY_API_SCOPES',
      'SHOPIFY_APP_URL',
      'SHOPIFY_API_VERSION',
    ];

    const missingEnvVars = requiredEnvVars.filter(
      varName => !process.env[varName]
    );

    if (missingEnvVars.length > 0) {
      issues.push(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`
      );
    }

    // Validate API key format (should be 32 hex characters)
    if (process.env.SHOPIFY_API_KEY) {
      const apiKey = process.env.SHOPIFY_API_KEY;
      if (!/^[a-f0-9]{32}$/i.test(apiKey)) {
        warnings.push(
          `API Key format looks unusual. Expected 32 hexadecimal characters, got: ${apiKey.length} chars`
        );
      }
    }

    // Validate API secret format (should be 32 hex characters)
    if (process.env.SHOPIFY_API_SECRET) {
      const secret = process.env.SHOPIFY_API_SECRET;
      if (!/^[a-f0-9]{32}$/i.test(secret)) {
        const warningMsg = `API Secret format looks unusual. Expected 32 hexadecimal characters, got: ${secret.length} chars`;

        if (secret.length === 38) {
          // 38 chars = same length as invalid shpua_ token!
          issues.push(
            `${warningMsg}. CRITICAL: This 38-character secret length matches the invalid shpua_ token format. ` +
            `This strongly indicates your app is configured as a CUSTOM APP or LEGACY APP in Shopify Partners Dashboard. ` +
            `You MUST reconfigure it as a PUBLIC APP or create a new PUBLIC APP. ` +
            `Custom apps use different authentication and will always generate invalid tokens for OAuth flows.`
          );
        } else {
          warnings.push(warningMsg);
        }
      }
    }

    // Validate app URL
    if (process.env.SHOPIFY_APP_URL) {
      const appUrl = process.env.SHOPIFY_APP_URL;

      if (!appUrl.startsWith('https://')) {
        issues.push(
          `App URL must use HTTPS. Current: ${appUrl}`
        );
      }

      if (appUrl.includes('localhost') || appUrl.includes('127.0.0.1')) {
        warnings.push(
          `App URL is set to localhost. This will only work in development with ngrok or similar tunneling.`
        );
      }

      if (appUrl.endsWith('/')) {
        warnings.push(
          `App URL should not end with trailing slash. Current: ${appUrl}`
        );
      }
    }

    // Validate API version format
    if (process.env.SHOPIFY_API_VERSION) {
      const version = process.env.SHOPIFY_API_VERSION;

      // Should be in format YYYY-MM (e.g., 2025-10)
      if (!/^\d{4}-\d{2}$/.test(version)) {
        warnings.push(
          `API version format looks incorrect. Expected YYYY-MM format, got: ${version}`
        );
      } else {
        // Check if version is recent (not older than 12 months)
        const [year, month] = version.split('-').map(Number);
        const versionDate = new Date(year, month - 1);
        const now = new Date();
        const monthsOld = (now.getTime() - versionDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

        if (monthsOld > 12) {
          warnings.push(
            `API version (${version}) is ${Math.round(monthsOld)} months old. Consider updating to a recent version.`
          );
        }

        if (monthsOld < 0) {
          warnings.push(
            `API version (${version}) is set to a future date. This may cause issues.`
          );
        }
      }
    }

    // Validate scopes
    if (process.env.SHOPIFY_API_SCOPES) {
      const scopes = process.env.SHOPIFY_API_SCOPES.split(',');

      if (scopes.length === 0) {
        issues.push('No API scopes defined. App will have no permissions.');
      }

      // Check for common scope format issues
      scopes.forEach(scope => {
        if (scope.trim() !== scope) {
          warnings.push(`Scope has leading/trailing whitespace: "${scope}"`);
        }
      });
    }

    // Validate Shopify SDK configuration
    const shopifyConfig = {
      apiVersion: process.env.SHOPIFY_API_VERSION,
      isEmbeddedApp: true,
      useOnlineTokens: false, // Should be false for offline tokens
      hostName: process.env.SHOPIFY_APP_URL?.replace(/https?:\/\//, ''),
    };

    // Check OAuth callback configuration
    const appUrl = process.env.SHOPIFY_APP_URL?.replace(/\/$/, '') || '';
    const expectedCallbackUrl = `${appUrl}/api/auth/callback`;

    recommendations.push(
      `Ensure your Shopify Partners Dashboard has these exact settings:\n` +
      `  - App URL: ${appUrl}\n` +
      `  - Redirect URL: ${expectedCallbackUrl}\n` +
      `  - API Version: ${process.env.SHOPIFY_API_VERSION}\n` +
      `  - Scopes: ${process.env.SHOPIFY_API_SCOPES}`
    );

    // Check for common misconfiguration patterns that cause shpua_ tokens
    if (process.env.SHOPIFY_API_KEY && process.env.SHOPIFY_API_KEY.length !== 32) {
      issues.push(
        `API Key length is ${process.env.SHOPIFY_API_KEY.length} characters. ` +
        `Standard Shopify API keys are 32 characters. ` +
        `This may indicate you're using credentials from a legacy or incorrectly configured app.`
      );
    }

    // Generate report
    const isValid = issues.length === 0;
    const severity = issues.length > 0 ? 'CRITICAL' : warnings.length > 0 ? 'WARNING' : 'OK';

    const report = {
      status: severity,
      valid: isValid,
      timestamp: new Date().toISOString(),
      configuration: {
        apiKey: process.env.SHOPIFY_API_KEY
          ? `${process.env.SHOPIFY_API_KEY.substring(0, 8)}...`
          : 'MISSING',
        apiSecretSet: !!process.env.SHOPIFY_API_SECRET,
        apiSecretLength: process.env.SHOPIFY_API_SECRET?.length || 0,
        appUrl: appUrl || 'MISSING',
        appUrlRaw: process.env.SHOPIFY_APP_URL || 'MISSING',
        apiVersion: process.env.SHOPIFY_API_VERSION || 'MISSING',
        scopes: process.env.SHOPIFY_API_SCOPES?.split(',') || [],
        callbackUrl: expectedCallbackUrl,
        useOnlineTokens: false,
        isEmbeddedApp: true,
      },
      validation: {
        issues: issues.length > 0 ? issues : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
        recommendations: recommendations.length > 0 ? recommendations : undefined,
      },
      expectedTokenFormat: {
        prefix: 'shpat_ or shpca_',
        minLength: 100,
        description: 'Valid modern Shopify access tokens',
      },
      invalidTokenFormat: {
        prefix: 'shpua_',
        length: 38,
        description: 'Invalid token format - indicates app misconfiguration',
        cause: 'Wrong app type or credentials in Shopify Partners Dashboard',
      },
      nextSteps: isValid
        ? [
            'Configuration looks good!',
            'If you still get invalid tokens (shpua_), the issue is in Shopify Partners Dashboard:',
            '1. Verify app type is "Public app" (not custom/legacy)',
            '2. Check that Client ID in Partners matches SHOPIFY_API_KEY',
            '3. Try rotating API credentials',
            '4. As last resort, create a new app in Partners Dashboard',
          ]
        : [
            'Fix the configuration issues listed above',
            'Update your Shopify Partners Dashboard to match these settings',
            'Redeploy your application',
            'Delete old sessions and reinstall the app',
          ],
    };

    return res.status(isValid ? 200 : 400).json(report);

  } catch (error) {
    console.error('Config validation error:', error);
    return res.status(500).json({
      error: 'Configuration validation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default handler;

import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Environment Variables Check
 *
 * Shows current runtime environment variables to verify deployment
 * Usage: GET /api/debug/env-check
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = process.env.SHOPIFY_API_KEY || '';
  const apiSecret = process.env.SHOPIFY_API_SECRET || '';

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    runtime: {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL,
    },
    credentials: {
      apiKey: {
        exists: !!apiKey,
        length: apiKey.length,
        preview: apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'MISSING',
        format: /^[a-f0-9]{32}$/i.test(apiKey) ? 'Valid 32-char hex (PUBLIC APP)' :
                apiKey.length === 32 ? 'Length is 32 but not hex' :
                'Invalid format',
      },
      apiSecret: {
        exists: !!apiSecret,
        length: apiSecret.length,
        preview: apiSecret ? `${apiSecret.substring(0, 4)}...${apiSecret.substring(apiSecret.length - 4)}` : 'MISSING',
        format: /^[a-f0-9]{32}$/i.test(apiSecret) ? '✅ Valid 32-char hex (PUBLIC APP)' :
                apiSecret.length === 38 ? '❌ 38 chars (CUSTOM APP - WRONG!)' :
                apiSecret.length === 32 ? '⚠️ Length is 32 but not hex format' :
                `❌ ${apiSecret.length} chars (Invalid)`,
        appType: /^[a-f0-9]{32}$/i.test(apiSecret) ? 'PUBLIC APP' :
                 apiSecret.length === 38 ? 'CUSTOM APP' :
                 'UNKNOWN/INVALID',
      },
      appUrl: process.env.SHOPIFY_APP_URL,
      apiVersion: process.env.SHOPIFY_API_VERSION,
      scopes: process.env.SHOPIFY_API_SCOPES,
    },
    diagnosis: {
      status: /^[a-f0-9]{32}$/i.test(apiSecret) ? '✅ READY - Public App credentials detected' :
              apiSecret.length === 38 ? '❌ WRONG - Custom App credentials detected' :
              '❌ ERROR - Invalid credentials',
      message: /^[a-f0-9]{32}$/i.test(apiSecret) ?
        'Environment is correctly configured for Public App OAuth' :
        apiSecret.length === 38 ?
        'Environment still has CUSTOM APP credentials. You need to:\n' +
        '1. Copy API Key and Secret from your NEW Public App in Partners Dashboard\n' +
        '2. Update SHOPIFY_API_KEY and SHOPIFY_API_SECRET in Vercel\n' +
        '3. Redeploy the app (environment changes require redeployment)' :
        'Invalid credentials format. Please verify your API credentials.',
    },
    instructions: apiSecret.length === 38 ? {
      step1: 'Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
      step2: 'Update SHOPIFY_API_KEY and SHOPIFY_API_SECRET with values from your NEW Public App',
      step3: 'Click "Redeploy" (environment changes only take effect after redeployment)',
      step4: 'Run this check again to verify',
      step5: 'Delete old sessions: /api/debug/force-delete-session?shop=yourstore.myshopify.com&confirm=yes',
      step6: 'Reinstall app: /api?shop=yourstore.myshopify.com',
    } : undefined,
  });
};

export default handler;

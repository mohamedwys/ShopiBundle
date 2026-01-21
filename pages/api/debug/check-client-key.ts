import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Check if client-side API key is available
 * Usage: GET /api/debug/check-client-key
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({
    serverSide: {
      SHOPIFY_API_KEY: {
        exists: !!process.env.SHOPIFY_API_KEY,
        preview: process.env.SHOPIFY_API_KEY ? `${process.env.SHOPIFY_API_KEY.substring(0, 8)}...` : 'MISSING',
      },
    },
    clientSide: {
      NEXT_PUBLIC_SHOPIFY_API_KEY: {
        exists: !!process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
        preview: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY ? `${process.env.NEXT_PUBLIC_SHOPIFY_API_KEY.substring(0, 8)}...` : 'MISSING',
        note: 'This MUST be set for App Bridge to work in the browser',
      },
    },
    diagnosis: {
      status: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY ? '✅ Client key exists' : '❌ Client key MISSING',
      problem: !process.env.NEXT_PUBLIC_SHOPIFY_API_KEY ?
        'App Bridge cannot initialize without NEXT_PUBLIC_SHOPIFY_API_KEY' : null,
      fix: !process.env.NEXT_PUBLIC_SHOPIFY_API_KEY ? [
        '1. Go to Vercel → Settings → Environment Variables',
        '2. Add: NEXT_PUBLIC_SHOPIFY_API_KEY = <your-api-key>',
        '3. Use the SAME value as SHOPIFY_API_KEY',
        '4. Redeploy the app',
      ] : null,
    },
  });
};

export default handler;

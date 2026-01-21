import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Request Context Diagnostic
 *
 * Shows detailed information about the current request
 * Helps diagnose iframe/cookie issues
 *
 * Usage: GET /api/debug/request-context
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = req.headers;

  return res.status(200).json({
    timestamp: new Date().toISOString(),

    request: {
      method: req.method,
      url: req.url,
      query: req.query,
    },

    headers: {
      referer: headers.referer || 'none',
      userAgent: headers['user-agent'] || 'none',
      host: headers.host || 'none',
      origin: headers.origin || 'none',
      cookie: headers.cookie ? 'present (not shown for security)' : 'none',
      secFetchDest: headers['sec-fetch-dest'] || 'none',
      secFetchMode: headers['sec-fetch-mode'] || 'none',
      secFetchSite: headers['sec-fetch-site'] || 'none',
    },

    environment: {
      SHOPIFY_API_KEY: {
        exists: !!process.env.SHOPIFY_API_KEY,
        preview: process.env.SHOPIFY_API_KEY?.substring(0, 8) + '...',
      },
      NEXT_PUBLIC_SHOPIFY_API_KEY: {
        exists: !!process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
        preview: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY?.substring(0, 8) + '...',
      },
      SHOPIFY_API_SECRET: {
        exists: !!process.env.SHOPIFY_API_SECRET,
        length: process.env.SHOPIFY_API_SECRET?.length || 0,
      },
      SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,
    },

    detection: {
      isEmbedded: headers.referer?.includes('.myshopify.com') || false,
      hasEmbeddedParam: req.query.embedded === '1',
      hasHostParam: !!req.query.host,
      likelyInIframe: headers['sec-fetch-dest'] === 'iframe' ||
                      headers['sec-fetch-dest'] === 'embed',
    },

    diagnosis: {
      status: !headers.referer?.includes('.myshopify.com') ?
        '✅ Top-level request (good for OAuth)' :
        '⚠️ Request from Shopify iframe (may have cookie issues)',

      recommendation: headers.referer?.includes('.myshopify.com') ?
        'If trying to do OAuth, access the app URL directly in a new tab (not through Shopify admin)' :
        'Request context looks good for OAuth',
    },
  });
};

export default handler;

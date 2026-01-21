import { NextApiRequest, NextApiResponse } from 'next';
import shopify from '@/utils/shopify';

/**
 * Direct OAuth Installation Endpoint
 *
 * Use this URL to install the app properly outside of iframe:
 * https://shopi-bundle.vercel.app/api/install?shop=yourstore.myshopify.com
 *
 * This ensures OAuth happens in top-level window, avoiding cookie issues
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { shop } = req.query;

    if (!shop || typeof shop !== 'string') {
      return res.status(400).send(`
        <h1>Missing Shop Parameter</h1>
        <p>Usage: /api/install?shop=yourstore.myshopify.com</p>
      `);
    }

    const sanitizedShop = shopify.utils.sanitizeShop(shop);

    if (!sanitizedShop) {
      return res.status(400).send(`
        <h1>Invalid Shop Domain</h1>
        <p>Provided: ${shop}</p>
        <p>Must be a valid .myshopify.com domain</p>
      `);
    }

    console.log('=== DIRECT INSTALL START ===');
    console.log('Shop:', sanitizedShop);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Referer:', req.headers['referer']);

    // Check if we're in an iframe (based on headers)
    const referer = req.headers['referer'] || '';
    const inIframe = referer.includes('.myshopify.com');

    if (inIframe) {
      console.log('⚠️ Request appears to be from iframe, redirecting to exitframe');

      // Redirect to exitframe to break out
      const exitframeUrl = `/exitframe?shop=${sanitizedShop}&redirectUri=${encodeURIComponent(`/api/install?shop=${sanitizedShop}`)}`;
      return res.redirect(exitframeUrl);
    }

    console.log('✓ Request is in top-level window, starting OAuth');

    // Start OAuth flow
    await shopify.auth.begin({
      shop: sanitizedShop,
      callbackPath: '/api/auth/callback',
      isOnline: false, // Use offline tokens
      rawRequest: req,
      rawResponse: res,
    });

    console.log('OAuth initiated successfully');

  } catch (error) {
    console.error('=== INSTALL ERROR ===', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return res.status(500).send(`
      <h1>Installation Error</h1>
      <p>${errorMessage}</p>
      <h2>Troubleshooting:</h2>
      <ul>
        <li>Make sure you're accessing this URL in a NEW browser tab (not within Shopify admin)</li>
        <li>Clear browser cookies and try again</li>
        <li>Try in an incognito/private window</li>
        <li>Check that your app is properly configured in Partners Dashboard</li>
      </ul>
      <a href="/api/install?shop=${req.query.shop}">Try Again</a>
    `);
  }
};

export default handler;

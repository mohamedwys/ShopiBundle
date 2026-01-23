import { NextApiRequest, NextApiResponse } from 'next';
import shopify from "@/utils/shopify";
import prisma from "@/utils/prisma";
import { logAuthDebug } from "@/utils/authDebug";
import crypto from 'crypto';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    logAuthDebug('AUTH BEGIN', req);

    const { shop } = req.query;

    if (!shop || typeof shop !== 'string') {
      res.status(400);
      return res.send("Missing shop parameter");
    }

    const sanitizedShop = shopify.utils.sanitizeShop(shop);

    if (!sanitizedShop) {
      res.status(400);
      return res.send("Invalid shop domain");
    }

    console.log('Starting cookieless OAuth for shop:', sanitizedShop);

    // Generate a random state for CSRF protection
    const state = crypto.randomBytes(16).toString('hex');

    // Store OAuth state in database (bypassing cookies)
    await prisma.oauth_state.create({
      data: {
        state,
        shop: sanitizedShop,
        isOnline: false,
      },
    });

    console.log('✓ OAuth state stored in database:', state);

    // Build authorization URL manually
    const scopes = process.env.SHOPIFY_API_SCOPES;
    const redirectUri = `${process.env.SHOPIFY_APP_URL}/api/auth/callback`;
    const apiKey = process.env.SHOPIFY_API_KEY;

    const authUrl = `https://${sanitizedShop}/admin/oauth/authorize?` +
      `client_id=${apiKey}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}&` +
      `grant_options[]=per-user`;

    console.log('Redirecting to Shopify OAuth URL');
    console.log('Redirect URI:', redirectUri);

    // Redirect to Shopify's OAuth authorization page
    return res.redirect(authUrl);

  } catch (error) {
    console.error('=== AUTH BEGIN ERROR ===', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).send(`Authentication error: ${errorMessage}`);
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;

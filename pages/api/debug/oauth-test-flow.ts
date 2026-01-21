import { NextApiRequest, NextApiResponse } from 'next';
import shopify from '@/utils/shopify';
import prisma from '@/utils/prisma';

/**
 * OAuth Flow Test
 *
 * Tests current state and shows what will happen during OAuth
 * Usage: GET /api/debug/oauth-test-flow?shop=yourstore.myshopify.com
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { shop } = req.query;

    if (!shop || typeof shop !== 'string') {
      return res.status(400).json({
        error: 'Missing shop parameter',
      });
    }

    const sanitizedShop = shopify.utils.sanitizeShop(shop);
    if (!sanitizedShop) {
      return res.status(400).json({ error: 'Invalid shop domain' });
    }

    // Check existing session
    const offlineSessionId = `offline_${sanitizedShop}`;
    const existingSession = await prisma.session.findUnique({
      where: { id: offlineSessionId },
    });

    let tokenInfo = null;
    if (existingSession) {
      const sessionData = JSON.parse(existingSession.content || '{}');
      const token = sessionData.accessToken || '';
      tokenInfo = {
        length: token.length,
        prefix: token.substring(0, 6),
        isValid: token.startsWith('shpat_') || token.startsWith('shpca_'),
        isInvalid: token.startsWith('shpua_'),
      };
    }

    return res.status(200).json({
      shop: sanitizedShop,
      existingSession: existingSession ? {
        id: offlineSessionId,
        token: tokenInfo,
        status: tokenInfo?.isInvalid ? '❌ INVALID (shpua_)' : tokenInfo?.isValid ? '✅ VALID' : '❓ Unknown',
      } : null,
      recommendation: tokenInfo?.isInvalid ?
        'Delete invalid session and reinstall app' :
        !existingSession ?
        'No session - run OAuth to create one' :
        'Session looks valid',
      actions: {
        deleteSession: `/api/debug/force-delete-session?shop=${sanitizedShop}&confirm=yes`,
        reinstall: `/api?shop=${sanitizedShop}`,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
};

export default handler;

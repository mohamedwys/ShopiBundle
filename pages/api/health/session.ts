import { NextApiRequest, NextApiResponse } from 'next';
import sessionHandler from '@/utils/sessionHandler';
import shopify from '@/utils/shopify';
import prisma from '@/utils/prisma';

/**
 * Session Health Check Endpoint
 *
 * Use this to verify session persistence is working correctly.
 * GET /api/health/session?shop=myshop.myshopify.com
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shop } = req.query;

  // General health check (no shop specified)
  if (!shop || typeof shop !== 'string') {
    try {
      // Test database connection
      const sessionCount = await prisma.session.count();
      const storeCount = await prisma.active_stores.count();

      return res.status(200).json({
        status: 'healthy',
        database: 'connected',
        sessions: sessionCount,
        stores: storeCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        status: 'unhealthy',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Shop-specific session check
  try {
    const sanitizedShop = shopify.utils.sanitizeShop(shop);

    if (!sanitizedShop) {
      return res.status(400).json({ error: 'Invalid shop domain' });
    }

    const sessionId = shopify.session.getOfflineId(sanitizedShop);
    const session = await sessionHandler.loadSession(sessionId);

    // Check store status
    const storeRecord = await prisma.active_stores.findUnique({
      where: { shop: sanitizedShop },
    });

    return res.status(200).json({
      shop: sanitizedShop,
      sessionId,
      session: {
        exists: !!session,
        hasAccessToken: !!session?.accessToken,
        tokenPrefix: session?.accessToken?.substring(0, 10) + '...' || null,
        scope: session?.scope || null,
        isOnline: session?.isOnline ?? null,
      },
      store: {
        exists: !!storeRecord,
        isActive: storeRecord?.isActive ?? null,
        hasSetupError: !!storeRecord?.setupError,
        lastError: storeRecord?.lastError || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Session health check error:', error);
    return res.status(500).json({
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}

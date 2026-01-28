import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

/**
 * General Health Check Endpoint
 *
 * GET /api/health - Returns overall application health status
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const checks: Record<string, any> = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  };

  // Database health check
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - startTime;

    checks.database = {
      status: 'connected',
      latency: `${dbLatency}ms`,
    };
  } catch (error) {
    checks.status = 'degraded';
    checks.database = {
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Environment check
  checks.config = {
    hasApiKey: !!process.env.SHOPIFY_API_KEY,
    hasApiSecret: !!process.env.SHOPIFY_API_SECRET,
    hasAppUrl: !!process.env.SHOPIFY_APP_URL,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
  };

  const statusCode = checks.status === 'healthy' ? 200 : 503;
  return res.status(statusCode).json(checks);
}

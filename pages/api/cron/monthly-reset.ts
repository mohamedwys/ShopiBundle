import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

/**
 * Vercel Cron: Monthly Revenue Reset
 * Schedule: 0 0 1 * * (midnight on the 1st of each month)
 *
 * Resets monthlyBundleRevenue for all shops so plan limits
 * track correctly per calendar month.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Reset all shops' monthly revenue counters
    const result = await prisma.shopSettings.updateMany({
      data: {
        monthlyBundleRevenue: 0,
        revenueLimitWarned: false,
        lastRevenueResetAt: new Date(),
      },
    });

    console.log(`[Cron] Monthly revenue reset: ${result.count} shops updated`);

    return res.status(200).json({
      success: true,
      shopsReset: result.count,
      resetAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron] Monthly revenue reset failed:', error);
    return res.status(500).json({ error: 'Reset failed' });
  }
}

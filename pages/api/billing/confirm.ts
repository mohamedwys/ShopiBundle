/**
 * Billing Confirmation Callback
 *
 * GET /api/billing/confirm - Called by Shopify after merchant approves charge.
 * Activates the Starter plan and redirects back to the app.
 */

import type { NextApiHandler } from 'next';
import { getBillingService } from '@/lib/services/billing.service';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shop, charge_id } = req.query;

  if (!shop || !charge_id) {
    return res.status(400).json({ error: 'Missing shop or charge_id' });
  }

  try {
    const billing = getBillingService();
    await billing.upgradePlan(shop as string, charge_id as string);

    // Redirect back to the app
    const appUrl = process.env.SHOPIFY_APP_URL || 'https://shopi-bundle.vercel.app';
    return res.redirect(302, `${appUrl}/?shop=${shop}&upgraded=true`);
  } catch (error) {
    console.error('Error confirming billing:', error);
    const appUrl = process.env.SHOPIFY_APP_URL || 'https://shopi-bundle.vercel.app';
    return res.redirect(302, `${appUrl}/?shop=${shop}&upgrade_error=true`);
  }
};

export default handler;

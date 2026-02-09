/**
 * GDPR: Shop Data Erasure (Redact)
 *
 * Shopify sends this 48 hours after an app is uninstalled.
 * We must delete ALL data associated with this shop.
 *
 * This is a MANDATORY requirement for Shopify App Store compliance.
 *
 * Shopify Payload:
 * {
 *   "shop_id": 954889,
 *   "shop_domain": "shop.myshopify.com"
 * }
 *
 * Response: 200 OK (Shopify will retry on non-2xx)
 *
 * COMPLETE DATA DELETION MAP:
 * ┌──────────────────────────┬─────────────────────────────────────────────────┐
 * │ Table                    │ Action                                          │
 * ├──────────────────────────┼─────────────────────────────────────────────────┤
 * │ session                  │ DELETE all where shop = X                       │
 * │ active_stores            │ DELETE where shop = X                           │
 * │ oauth_state              │ DELETE all where shop = X                       │
 * │ ShopSettings             │ DELETE where shop = X                           │
 * │ MonthlyRevenue           │ DELETE all where shop = X                       │
 * │ BundleOrder              │ DELETE all where shop = X                       │
 * │ Bundle (cascade)         │ DELETE all where shop = X                       │
 * │  → BundleComponent       │ CASCADE from Bundle                            │
 * │  → BundlePricingRule     │ CASCADE from Bundle                            │
 * │  → BundleDiscount        │ CASCADE from Bundle                            │
 * │  → BundleInventory       │ CASCADE from Bundle                            │
 * │  → BundleAnalytics       │ CASCADE from Bundle                            │
 * │  → BundleEvent           │ CASCADE from Bundle                            │
 * │ auto_bundle_data         │ DELETE where shop = X                           │
 * │ auto_bundle_rules        │ DELETE all where shop = X                       │
 * │ bundle_discount_id       │ DELETE all where shop = X                       │
 * │ ai_fbt_bundles           │ DELETE all where shop = X                       │
 * │ ai_fbt_config            │ DELETE where shop = X                           │
 * │ ai_bundle_events         │ DELETE all where shop = X                       │
 * │ ai_bundle_ab_assignments │ DELETE all where shop = X                       │
 * │ InventorySyncLog         │ DELETE all where shop = X                       │
 * └──────────────────────────┴─────────────────────────────────────────────────┘
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import prisma from '@/utils/prisma';

interface ShopRedactPayload {
  shop_id: number;
  shop_domain: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify HMAC
  const hmacValid = verifyWebhookHmac(req);
  if (!hmacValid) {
    return res.status(401).json({ error: 'HMAC verification failed' });
  }

  let payload: ShopRedactPayload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const shop = payload.shop_domain;

  console.log(`[GDPR] Shop redact request for shop=${shop}`);

  if (!shop) {
    return res.status(200).json({ received: true });
  }

  const results: Record<string, number> = {};

  try {
    // Delete in dependency order: leaf tables first, then parent tables.
    // Bundle cascade handles BundleComponent, BundlePricingRule, BundleDiscount,
    // BundleInventory, BundleAnalytics, BundleEvent automatically.

    // 1. Standalone tables with no foreign key dependencies

    // AI/ML data
    const aiEvents = await prisma.ai_bundle_events.deleteMany({ where: { shop } });
    results.ai_bundle_events = aiEvents.count;

    const aiAbAssignments = await prisma.ai_bundle_ab_assignments.deleteMany({ where: { shop } });
    results.ai_bundle_ab_assignments = aiAbAssignments.count;

    const aiFbtBundles = await prisma.ai_fbt_bundles.deleteMany({ where: { shop } });
    results.ai_fbt_bundles = aiFbtBundles.count;

    // ai_fbt_config has shop as @id so use delete not deleteMany
    try {
      await prisma.ai_fbt_config.delete({ where: { shop } });
      results.ai_fbt_config = 1;
    } catch {
      // Record may not exist
      results.ai_fbt_config = 0;
    }

    // Inventory sync logs
    const syncLogs = await prisma.inventorySyncLog.deleteMany({ where: { shop } });
    results.inventory_sync_logs = syncLogs.count;

    // Bundle orders (not cascade-linked to Bundle)
    const bundleOrders = await prisma.bundleOrder.deleteMany({ where: { shop } });
    results.bundle_orders = bundleOrders.count;

    // Monthly revenue
    const monthlyRevenue = await prisma.monthlyRevenue.deleteMany({ where: { shop } });
    results.monthly_revenue = monthlyRevenue.count;

    // Shop settings (has shop as @unique)
    try {
      await prisma.shopSettings.delete({ where: { shop } });
      results.shop_settings = 1;
    } catch {
      results.shop_settings = 0;
    }

    // 2. Bundle system (cascade handles children)
    const bundles = await prisma.bundle.deleteMany({ where: { shop } });
    results.bundles = bundles.count;

    // 3. Legacy data
    const legacyDiscounts = await prisma.bundle_discount_id.deleteMany({ where: { shop } });
    results.legacy_discount_ids = legacyDiscounts.count;

    // auto_bundle_data has shop as @id
    try {
      await prisma.auto_bundle_data.delete({ where: { shop } });
      results.auto_bundle_data = 1;
    } catch {
      results.auto_bundle_data = 0;
    }

    const autoRules = await prisma.auto_bundle_rules.deleteMany({ where: { shop } });
    results.auto_bundle_rules = autoRules.count;

    // 4. Auth & session data
    const sessions = await prisma.session.deleteMany({ where: { shop } });
    results.sessions = sessions.count;

    const oauthStates = await prisma.oauth_state.deleteMany({ where: { shop } });
    results.oauth_states = oauthStates.count;

    // active_stores has shop as @id
    try {
      await prisma.active_stores.delete({ where: { shop } });
      results.active_stores = 1;
    } catch {
      results.active_stores = 0;
    }

    console.log(
      `[GDPR] Shop redact completed for shop=${shop}: ` + JSON.stringify(results)
    );

    return res.status(200).json({
      received: true,
      shop,
      actions_taken: results,
    });
  } catch (error) {
    console.error(`[GDPR] Error processing shop redact for ${shop}:`, error);
    // Return 200 to prevent infinite retries; log for manual remediation
    return res.status(200).json({
      received: true,
      shop,
      partial_results: results,
      error: 'Internal error during shop redaction. Flagged for manual review.',
    });
  }
}

/**
 * Verify Shopify webhook HMAC signature.
 * Uses timing-safe comparison to prevent timing attacks.
 */
function verifyWebhookHmac(req: NextApiRequest): boolean {
  const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string;
  if (!hmacHeader) return false;

  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    console.error('[GDPR] SHOPIFY_API_SECRET not set');
    return false;
  }

  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  const generatedHmac = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedHmac, 'utf8'),
      Buffer.from(hmacHeader, 'utf8')
    );
  } catch {
    return false;
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};

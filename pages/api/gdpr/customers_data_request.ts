/**
 * GDPR: Customer Data Request
 *
 * Shopify sends this when a customer requests their data under GDPR.
 * We must respond with 200 and provide/compile any customer data we store.
 *
 * Shopify Payload:
 * {
 *   "shop_id": 954889,
 *   "shop_domain": "shop.myshopify.com",
 *   "orders_requested": [299938, 280263, ...],
 *   "customer": {
 *     "id": 191167,
 *     "email": "john@example.com",
 *     "phone": "555-625-1199"
 *   },
 *   "data_request": {
 *     "id": 9999
 *   }
 * }
 *
 * Response: 200 OK (Shopify will retry on non-2xx)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import prisma from '@/utils/prisma';

interface CustomerDataRequestPayload {
  shop_id: number;
  shop_domain: string;
  orders_requested: number[];
  customer: {
    id: number;
    email: string;
    phone?: string;
  };
  data_request: {
    id: number;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify HMAC from raw body
  const hmacValid = verifyWebhookHmac(req);
  if (!hmacValid) {
    return res.status(401).json({ error: 'HMAC verification failed' });
  }

  let payload: CustomerDataRequestPayload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const shop = payload.shop_domain;
  const customerId = payload.customer?.id?.toString();
  const customerEmail = payload.customer?.email;
  const requestId = payload.data_request?.id;

  console.log(`[GDPR] Customer data request #${requestId} for shop=${shop}, customer=${customerId}`);

  if (!shop || !customerId) {
    // Still respond 200 so Shopify doesn't retry; we just have nothing to do
    return res.status(200).json({ received: true });
  }

  try {
    // Collect all customer data we have

    // 1. Bundle orders linked to this customer
    const bundleOrders = await prisma.bundleOrder.findMany({
      where: {
        shop,
        OR: [
          { customerId },
          ...(customerEmail ? [{ customerEmail }] : []),
        ],
      },
      select: {
        id: true,
        shopifyOrderId: true,
        shopifyOrderNumber: true,
        bundleRevenue: true,
        discountAmount: true,
        bundleName: true,
        tierId: true,
        customerId: true,
        customerEmail: true,
        createdAt: true,
      },
    });

    // 2. Bundle events linked to this customer
    const bundleEvents = await prisma.bundleEvent.findMany({
      where: {
        shop,
        customerId,
      },
      select: {
        id: true,
        bundleId: true,
        eventType: true,
        quantity: true,
        revenue: true,
        createdAt: true,
      },
    });

    // 3. AI bundle events linked to this customer
    const aiBundleEvents = await prisma.ai_bundle_events.findMany({
      where: {
        shop,
        customerId,
      },
      select: {
        id: true,
        bundleId: true,
        eventType: true,
        createdAt: true,
      },
    });

    const customerData = {
      request_id: requestId,
      shop,
      customer_id: customerId,
      customer_email: customerEmail,
      data_collected: {
        bundle_orders: bundleOrders,
        bundle_events: bundleEvents,
        ai_bundle_events: aiBundleEvents,
      },
      data_summary: {
        total_bundle_orders: bundleOrders.length,
        total_bundle_events: bundleEvents.length,
        total_ai_bundle_events: aiBundleEvents.length,
      },
    };

    console.log(
      `[GDPR] Customer data request #${requestId} compiled: ` +
      `${bundleOrders.length} orders, ${bundleEvents.length} events, ${aiBundleEvents.length} AI events`
    );

    // Respond 200 with the data summary
    // Shopify expects a 200 response; the actual data is sent back via the
    // data_request endpoint or stored for the merchant to forward to the customer.
    return res.status(200).json(customerData);
  } catch (error) {
    console.error(`[GDPR] Error processing customer data request #${requestId}:`, error);
    // Still return 200 so Shopify doesn't endlessly retry
    // Log the error for investigation
    return res.status(200).json({
      received: true,
      request_id: requestId,
      error: 'Internal error processing request. Data will be compiled manually.',
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

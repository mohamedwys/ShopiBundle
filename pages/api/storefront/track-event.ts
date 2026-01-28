/**
 * Storefront Event Tracking API
 *
 * Records bundle events for analytics:
 * - impressions: Bundle displayed to customer
 * - clicks: Customer clicked on bundle
 * - add_to_cart: Bundle added to cart
 * - purchase: Bundle purchased (handled by webhook)
 */

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { logger } from '@/lib/monitoring/logger';

// Valid event types
const VALID_EVENTS = [
  'bundle_impression',
  'bundle_click',
  'bundle_add_to_cart',
  'variant_selected',
  'bundle_view',
  'bundle_add_error',
];

interface TrackEventBody {
  event: string;
  shop: string;
  bundleId?: string;
  productId?: string;
  variantId?: string;
  quantity?: number;
  sessionId?: string;
  customerId?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body as TrackEventBody;

    // Validate required fields
    if (!body.event) {
      return res.status(400).json({ error: 'Event type required' });
    }

    const shop = body.shop || (req.headers['x-shopify-shop-domain'] as string);
    if (!shop) {
      return res.status(400).json({ error: 'Shop required' });
    }

    // Validate event type
    if (!VALID_EVENTS.includes(body.event)) {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    // Record the event
    await recordEvent(shop, body);

    // Update daily analytics if bundle ID provided
    if (body.bundleId) {
      await updateDailyAnalytics(body.bundleId, body.event, body.quantity || 1);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    logger.error('Event tracking error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Don't fail the request for tracking errors
    return res.status(200).json({ success: true });
  }
}

/**
 * Record event in database
 */
async function recordEvent(shop: string, body: TrackEventBody): Promise<void> {
  // Only record if bundle ID is provided
  if (!body.bundleId) {
    return;
  }

  // Verify bundle exists
  const bundle = await prisma.bundle.findFirst({
    where: {
      shop,
      OR: [
        { id: body.bundleId },
        { slug: body.bundleId },
      ],
    },
    select: { id: true },
  });

  if (!bundle) {
    logger.debug('Event for unknown bundle', { bundleId: body.bundleId });
    return;
  }

  // Map event type to internal format
  const eventType = mapEventType(body.event);

  await prisma.bundleEvent.create({
    data: {
      shop,
      bundleId: bundle.id,
      eventType,
      sessionId: body.sessionId,
      customerId: body.customerId,
      quantity: body.quantity || 1,
      metadata: {
        productId: body.productId,
        variantId: body.variantId,
        originalEvent: body.event,
        timestamp: body.timestamp,
        ...body.metadata,
      },
      source: 'storefront',
    },
  });
}

/**
 * Map frontend event names to internal types
 */
function mapEventType(event: string): string {
  const mapping: Record<string, string> = {
    bundle_impression: 'IMPRESSION',
    bundle_click: 'CLICK',
    bundle_view: 'VIEW',
    bundle_add_to_cart: 'ADD_TO_CART',
    bundle_added_to_cart: 'ADD_TO_CART',
    variant_selected: 'VARIANT_CHANGE',
    bundle_add_error: 'ERROR',
  };

  return mapping[event] || event.toUpperCase();
}

/**
 * Update daily analytics aggregation
 */
async function updateDailyAnalytics(
  bundleId: string,
  event: string,
  quantity: number
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Map event to analytics field
  const updateData: Record<string, { increment: number }> = {};

  switch (event) {
    case 'bundle_impression':
      updateData.impressions = { increment: 1 };
      break;
    case 'bundle_click':
    case 'bundle_view':
      updateData.clicks = { increment: 1 };
      break;
    case 'bundle_add_to_cart':
    case 'bundle_added_to_cart':
      updateData.addToCarts = { increment: quantity };
      break;
  }

  if (Object.keys(updateData).length === 0) {
    return;
  }

  try {
    // Try to find the actual bundle ID if a slug was passed
    const bundle = await prisma.bundle.findFirst({
      where: {
        OR: [
          { id: bundleId },
          { slug: bundleId },
        ],
      },
      select: { id: true },
    });

    if (!bundle) return;

    await prisma.bundleAnalytics.upsert({
      where: {
        bundleId_date: {
          bundleId: bundle.id,
          date: today,
        },
      },
      create: {
        bundleId: bundle.id,
        date: today,
        impressions: event === 'bundle_impression' ? 1 : 0,
        clicks: ['bundle_click', 'bundle_view'].includes(event) ? 1 : 0,
        addToCarts: ['bundle_add_to_cart', 'bundle_added_to_cart'].includes(event) ? quantity : 0,
        orders: 0,
        unitsSold: 0,
        revenue: 0,
        discountAmount: 0,
        averageOrderValue: 0,
      },
      update: updateData,
    });
  } catch (error) {
    // Log but don't fail for analytics errors
    logger.warn('Failed to update analytics', {
      bundleId,
      event,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

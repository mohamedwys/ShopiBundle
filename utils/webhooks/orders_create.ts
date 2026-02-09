/**
 * Orders Create Webhook Handler
 *
 * Called when an order is placed. Checks if the order contains bundle items
 * and tracks revenue for billing/plan limits.
 */

import { getBillingService } from '@/lib/services/billing.service';
import prisma from '@/utils/prisma';

const ordersCreateHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: string
) => {
  try {
    const order = JSON.parse(webhookRequestBody);

    // Check line items for bundle metadata
    const bundleItems = (order.line_items || []).filter((item: any) =>
      item.properties?.some(
        (p: any) => p.name === '_bundle_id' && p.value
      )
    );

    if (bundleItems.length === 0) return;

    // Calculate total bundle revenue from this order
    const bundleRevenue = bundleItems.reduce(
      (sum: number, item: any) =>
        sum + parseFloat(item.price || '0') * (item.quantity || 1),
      0
    );

    // Extract bundle metadata from first item
    const bundleProps = bundleItems[0].properties.reduce(
      (acc: Record<string, string>, p: any) => {
        acc[p.name] = p.value;
        return acc;
      },
      {} as Record<string, string>
    );

    const bundleId = bundleProps['_bundle_id'] || undefined;
    const tierId = bundleProps['_bundle_tier'] || undefined;

    const billing = getBillingService();
    await billing.trackRevenue(
      shop,
      order.id?.toString() || '',
      order.order_number?.toString() || order.name || '',
      bundleRevenue,
      bundleId,
      undefined, // bundleName - could be looked up
      tierId,
      order.customer?.id?.toString(),
      order.customer?.email,
      parseFloat(order.total_price || '0')
    );

    // Also update bundle analytics if we have a bundle ID
    if (bundleId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Try to find the bundle in our DB
      const bundle = await prisma.bundle.findFirst({
        where: {
          shop,
          OR: [
            { id: bundleId },
            { slug: bundleId },
            { name: bundleId },
          ],
        },
      });

      if (bundle) {
        await prisma.bundleAnalytics.upsert({
          where: { bundleId_date: { bundleId: bundle.id, date: today } },
          create: {
            bundleId: bundle.id,
            date: today,
            orders: 1,
            unitsSold: bundleItems.length,
            revenue: bundleRevenue,
          },
          update: {
            orders: { increment: 1 },
            unitsSold: { increment: bundleItems.length },
            revenue: { increment: bundleRevenue },
          },
        });

        // Create bundle event
        await prisma.bundleEvent.create({
          data: {
            shop,
            bundleId: bundle.id,
            eventType: 'purchase',
            orderId: order.id?.toString(),
            customerId: order.customer?.id?.toString(),
            quantity: bundleItems.length,
            revenue: bundleRevenue,
            metadata: {
              orderNumber: order.order_number || order.name,
              tierId,
              totalOrderValue: parseFloat(order.total_price || '0'),
            },
          },
        });
      }
    }

    console.log(
      `[Orders Webhook] Shop: ${shop}, Order: ${order.name}, Bundle Revenue: $${bundleRevenue.toFixed(2)}`
    );
  } catch (error) {
    console.error('[Orders Webhook] Error processing order:', error);
  }
};

export default ordersCreateHandler;

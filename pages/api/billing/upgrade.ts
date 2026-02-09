/**
 * Billing Upgrade API
 *
 * POST /api/billing/upgrade - Create Shopify recurring charge for Starter plan
 * Returns a confirmation URL for the merchant to approve the charge.
 */

import { withShopAuth, sendSuccess, sendError } from '@/lib/middleware/with-shop-auth';
import { PLANS } from '@/lib/services/billing.service';
import clientProvider from '@/utils/clientProvider';

export default withShopAuth(
  async (ctx) => {
    if (ctx.req.method !== 'POST') {
      return sendError(ctx.res, 'Method not allowed', 405);
    }

    const starterPlan = PLANS.STARTER;

    try {
      const { client } = await clientProvider.offline.graphqlClient({
        shop: ctx.shop,
      });

      // Create recurring application charge via Shopify GraphQL
      const mutation = `
        mutation CreateSubscription($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int) {
          appSubscriptionCreate(
            name: $name
            lineItems: $lineItems
            returnUrl: $returnUrl
            trialDays: $trialDays
            test: ${process.env.NODE_ENV !== 'production'}
          ) {
            appSubscription {
              id
              status
            }
            confirmationUrl
            userErrors {
              field
              message
            }
          }
        }
      `;

      const returnUrl = `${process.env.SHOPIFY_APP_URL || 'https://shopi-bundle.vercel.app'}/api/billing/confirm?shop=${ctx.shop}`;

      const response: any = await client.request(mutation, {
        variables: {
          name: starterPlan.name,
          lineItems: [
            {
              plan: {
                appRecurringPricingDetails: {
                  price: {
                    amount: starterPlan.price,
                    currencyCode: 'USD',
                  },
                  interval: 'EVERY_30_DAYS',
                },
              },
            },
          ],
          returnUrl,
          trialDays: starterPlan.trialDays,
        },
      });

      const result = response.data?.appSubscriptionCreate;

      if (result?.userErrors?.length > 0) {
        return sendError(
          ctx.res,
          result.userErrors.map((e: any) => e.message).join(', '),
          400
        );
      }

      return sendSuccess(ctx.res, {
        confirmationUrl: result.confirmationUrl,
        subscriptionId: result.appSubscription?.id,
      });
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      return sendError(ctx.res, 'Failed to create subscription', 500);
    }
  },
  { methods: ['POST'] }
);

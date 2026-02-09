/**
 * Usage Banner Component
 *
 * Shows plan usage status and upgrade CTA across dashboard pages.
 * Implements the "soft upgrade" pattern - never disables bundles,
 * only encourages upgrade when approaching/exceeding limits.
 */

import React from 'react';
import {
  Banner,
  BlockStack,
  InlineStack,
  Text,
  Button,
  ProgressBar,
} from '@shopify/polaris';

interface UsageBannerProps {
  plan: string;
  monthlyRevenue: number;
  revenueLimit: number;
  usagePercent: number;
  daysUntilReset: number;
  isOverLimit: boolean;
  isNearLimit: boolean;
  upgradeMessage: string | null;
  onUpgrade?: () => void;
}

export function UsageBanner({
  plan,
  monthlyRevenue,
  revenueLimit,
  usagePercent,
  daysUntilReset,
  isOverLimit,
  isNearLimit,
  upgradeMessage,
  onUpgrade,
}: UsageBannerProps) {
  // Don't show if not near limit and on free plan
  if (!isNearLimit && !isOverLimit && plan === 'FREE' && usagePercent < 60) {
    return null;
  }

  // Don't show for Starter plan unless over limit
  if (plan === 'STARTER' && !isOverLimit) {
    return null;
  }

  const tone = isOverLimit ? 'info' : isNearLimit ? 'warning' : 'info';

  const title = isOverLimit
    ? `You've generated $${monthlyRevenue.toFixed(0)} in bundle revenue this month!`
    : `$${monthlyRevenue.toFixed(0)} / $${revenueLimit.toFixed(0)} bundle revenue this month`;

  return (
    <Banner
      title={title}
      tone={tone}
      onDismiss={isOverLimit && monthlyRevenue > revenueLimit * 1.5 ? undefined : () => {}}
    >
      <BlockStack gap="300">
        <ProgressBar
          progress={Math.min(usagePercent, 100)}
          tone={isOverLimit ? 'success' : isNearLimit ? 'attention' : 'primary'}
          size="small"
        />

        <InlineStack gap="200" align="space-between" blockAlign="center">
          <Text as="span" variant="bodySm" tone="subdued">
            {usagePercent}% of {plan === 'FREE' ? 'Free' : 'Starter'} plan limit
            {' '}&middot; Resets in {daysUntilReset} days
          </Text>
        </InlineStack>

        {upgradeMessage && plan === 'FREE' && (
          <InlineStack gap="300" align="start" blockAlign="center">
            <Text as="span" variant="bodySm">
              {upgradeMessage}
            </Text>
            {onUpgrade && (
              <Button variant="primary" size="slim" onClick={onUpgrade}>
                Upgrade to Starter - $10/mo
              </Button>
            )}
          </InlineStack>
        )}
      </BlockStack>
    </Banner>
  );
}

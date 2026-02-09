/**
 * Onboarding Banner Component
 *
 * Shows first-time setup checklist for new merchants.
 * Displays progress through the initial setup steps.
 */

import React from 'react';
import {
  Banner,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Icon,
  List,
} from '@shopify/polaris';
import { CheckCircleIcon } from '@shopify/polaris-icons';

interface OnboardingStep {
  label: string;
  completed: boolean;
  action?: string;
  href?: string;
}

interface OnboardingBannerProps {
  steps: OnboardingStep[];
  onDismiss: () => void;
  onAction?: (href: string) => void;
}

export function OnboardingBanner({
  steps,
  onDismiss,
  onAction,
}: OnboardingBannerProps) {
  const completedCount = steps.filter((s) => s.completed).length;
  const allCompleted = completedCount === steps.length;

  if (allCompleted) return null;

  return (
    <Banner
      title={`Get started with ShopiBundle (${completedCount}/${steps.length})`}
      tone="info"
      onDismiss={onDismiss}
    >
      <BlockStack gap="300">
        <Text as="p" variant="bodySm">
          Complete these steps to start increasing your average order value:
        </Text>
        <List>
          {steps.map((step, i) => (
            <List.Item key={i}>
              <InlineStack gap="200" blockAlign="center">
                {step.completed ? (
                  <Icon source={CheckCircleIcon} tone="success" />
                ) : (
                  <span style={{ width: 20, height: 20, display: 'inline-block' }}>
                    {i + 1}.
                  </span>
                )}
                <Text
                  as="span"
                  variant="bodySm"
                  tone={step.completed ? 'subdued' : undefined}
                  textDecorationLine={step.completed ? 'line-through' : undefined}
                >
                  {step.label}
                </Text>
                {!step.completed && step.action && step.href && (
                  <Button
                    size="slim"
                    variant="plain"
                    onClick={() => onAction?.(step.href!)}
                  >
                    {step.action}
                  </Button>
                )}
              </InlineStack>
            </List.Item>
          ))}
        </List>
      </BlockStack>
    </Banner>
  );
}

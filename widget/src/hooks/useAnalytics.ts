/**
 * Analytics Hook
 *
 * Tracks bundle widget interactions for conversion optimization.
 * Fires events to the ShopiBundle analytics endpoint and optional
 * third-party integrations (GA4, Shopify Analytics).
 */

import { useCallback, useRef } from 'react';
import type {
  AnalyticsConfig,
  AnalyticsEvent,
  AnalyticsEventName,
  BundleConfig,
  BundleTier,
  PricingResult,
} from '../types';
import { getSessionId, getDeviceType } from '../utils/formatting';

interface UseAnalyticsReturn {
  trackView: () => void;
  trackTierSelect: (tier: BundleTier, pricing: PricingResult) => void;
  trackAddToCart: (tier: BundleTier, pricing: PricingResult) => void;
  trackAddToCartSuccess: (tier: BundleTier, pricing: PricingResult) => void;
  trackAddToCartFailed: (tier: BundleTier, error: string) => void;
}

export function useAnalytics(config: BundleConfig): UseAnalyticsReturn {
  const sessionId = useRef(getSessionId());
  const viewTracked = useRef(false);

  const sendEvent = useCallback(
    (event: AnalyticsEvent) => {
      if (!config.analytics.enabled) return;

      const endpoint =
        config.analytics.trackingEndpoint || '/apps/proxy/ai/events/track';

      // Fire and forget - don't block UI
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop: (window as any).Shopify?.shop || '',
          bundleId: event.bundleId,
          productId: event.productId || '',
          eventType: mapEventName(event.eventName),
          sessionId: event.sessionId,
          metadata: {
            bundleType: event.bundleType,
            tierId: event.tierId,
            tierLabel: event.tierLabel,
            discountType: event.discountType,
            discountValue: event.discountValue,
            originalPrice: event.originalPrice,
            bundlePrice: event.bundlePrice,
            savingsAmount: event.savingsAmount,
            quantity: event.quantity,
            experimentId: event.experimentId,
            experimentVariant: event.experimentVariant,
            deviceType: event.deviceType,
          },
        }),
      }).catch(() => {
        // Silently fail - analytics should never break the widget
      });

      // Also push to dataLayer for GA4 if available
      const dataLayer = (window as any).dataLayer;
      if (dataLayer) {
        dataLayer.push({
          event: `shopibundle_${event.eventName}`,
          bundle_id: event.bundleId,
          bundle_type: event.bundleType,
          tier_id: event.tierId,
          bundle_price: event.bundlePrice,
          savings_amount: event.savingsAmount,
        });
      }
    },
    [config.analytics]
  );

  const buildEvent = useCallback(
    (
      eventName: AnalyticsEventName,
      tier?: BundleTier,
      pricing?: PricingResult
    ): AnalyticsEvent => ({
      eventName,
      bundleId: config.id,
      bundleType: config.type,
      tierId: tier?.id,
      tierLabel: tier?.label,
      discountType: tier?.discountType,
      discountValue: tier?.discountValue,
      originalPrice: pricing?.originalPrice,
      bundlePrice: pricing?.bundlePrice,
      savingsAmount: pricing?.savingsAmount,
      quantity: tier?.quantity,
      experimentId: config.analytics.experimentId,
      experimentVariant: config.analytics.experimentVariant,
      timestamp: Date.now(),
      sessionId: sessionId.current,
      deviceType: getDeviceType(),
    }),
    [config]
  );

  const trackView = useCallback(() => {
    if (viewTracked.current) return;
    viewTracked.current = true;
    sendEvent(buildEvent('bundle_viewed'));
  }, [buildEvent, sendEvent]);

  const trackTierSelect = useCallback(
    (tier: BundleTier, pricing: PricingResult) => {
      sendEvent(buildEvent('tier_selected', tier, pricing));
    },
    [buildEvent, sendEvent]
  );

  const trackAddToCart = useCallback(
    (tier: BundleTier, pricing: PricingResult) => {
      sendEvent(buildEvent('add_to_cart_clicked', tier, pricing));
    },
    [buildEvent, sendEvent]
  );

  const trackAddToCartSuccess = useCallback(
    (tier: BundleTier, pricing: PricingResult) => {
      sendEvent(buildEvent('add_to_cart_success', tier, pricing));
    },
    [buildEvent, sendEvent]
  );

  const trackAddToCartFailed = useCallback(
    (tier: BundleTier, error: string) => {
      const event = buildEvent('add_to_cart_failed', tier);
      (event as any).error = error;
      sendEvent(event);
    },
    [buildEvent, sendEvent]
  );

  return {
    trackView,
    trackTierSelect,
    trackAddToCart,
    trackAddToCartSuccess,
    trackAddToCartFailed,
  };
}

function mapEventName(name: AnalyticsEventName): string {
  const map: Record<AnalyticsEventName, string> = {
    bundle_viewed: 'impression',
    tier_selected: 'click',
    variant_changed: 'click',
    add_to_cart_clicked: 'add_to_cart',
    add_to_cart_success: 'add_to_cart',
    add_to_cart_failed: 'add_to_cart',
  };
  return map[name] || name;
}

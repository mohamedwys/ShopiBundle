import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  BundleWidgetProps,
  BundleTier,
  CartAddPayload,
  PricingResult,
} from '../types';
import { calculateTierPricing } from '../utils/pricing';
import { formatPrice } from '../utils/formatting';
import { addToCart, handlePostAddToCart } from '../utils/cart';
import { useAnalytics } from '../hooks/useAnalytics';
import { OfferCard } from './OfferCard';
import { ProductCard } from './ProductCard';
import { ProgressBar } from './ProgressBar';
import { SkeletonLoader } from './SkeletonLoader';

type AddToCartState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Main bundle widget component.
 *
 * Renders Rapi-style tiered offer cards with:
 * - Multi-tier selection (1-pack, 2-pack, 3-pack etc.)
 * - Default "Most Popular" tier pre-selected
 * - Strong savings messaging
 * - Product thumbnails for FBT/mix-match bundles
 * - Progress bar toward next savings tier
 * - Responsive, accessible, and conversion-optimized
 */
export function BundleWidget({
  config,
  onAddToCart,
  className,
}: BundleWidgetProps): React.ReactElement {
  const { tiers, products, visual, settings } = config;
  const analytics = useAnalytics(config);

  // Find the default tier or use the first one
  const defaultTier = useMemo(
    () => tiers.find((t) => t.isDefault) || tiers[0],
    [tiers]
  );

  const [selectedTierId, setSelectedTierId] = useState<string>(
    defaultTier?.id || ''
  );
  const [addToCartState, setAddToCartState] = useState<AddToCartState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [variantSelections, setVariantSelections] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    for (const p of products) {
      if (p.variantId) initial[p.productId] = p.variantId;
    }
    return initial;
  });

  const selectedTier = useMemo(
    () => tiers.find((t) => t.id === selectedTierId) || defaultTier,
    [tiers, selectedTierId, defaultTier]
  );

  // Calculate pricing for all tiers
  const tierPricingMap = useMemo(() => {
    const map: Record<string, PricingResult> = {};
    for (const tier of tiers) {
      map[tier.id] = calculateTierPricing(tier, products, config.type);
    }
    return map;
  }, [tiers, products, config.type]);

  const currentPricing = selectedTier
    ? tierPricingMap[selectedTier.id]
    : undefined;

  // Track view on mount
  useEffect(() => {
    analytics.trackView();
  }, [analytics]);

  // Find next tier for progress bar
  const nextTier = useMemo(() => {
    if (!selectedTier) return null;
    const currentIdx = tiers.findIndex((t) => t.id === selectedTier.id);
    return currentIdx < tiers.length - 1 ? tiers[currentIdx + 1] : null;
  }, [tiers, selectedTier]);

  const handleTierSelect = useCallback(
    (tierId: string) => {
      setSelectedTierId(tierId);
      setAddToCartState('idle');
      setErrorMessage('');
      const tier = tiers.find((t) => t.id === tierId);
      if (tier) {
        analytics.trackTierSelect(tier, tierPricingMap[tierId]);
      }
    },
    [tiers, tierPricingMap, analytics]
  );

  const handleVariantChange = useCallback(
    (productId: string, variantId: string) => {
      setVariantSelections((prev) => ({ ...prev, [productId]: variantId }));
    },
    []
  );

  const handleAddToCart = useCallback(async () => {
    if (!selectedTier || !currentPricing) return;

    setAddToCartState('loading');
    setErrorMessage('');
    analytics.trackAddToCart(selectedTier, currentPricing);

    // Build cart payload with correct variant IDs
    const lineItems = currentPricing.lineItems.map((item) => {
      const overrideVariantId = Object.entries(variantSelections).find(
        ([, vid]) => vid
      );
      return {
        ...item,
        // Use variant selection if available
        variantId:
          variantSelections[
            products.find((p) => p.variantId === item.variantId)?.productId || ''
          ] || item.variantId,
        properties: {
          ...item.properties,
          _bundle_id: config.id,
        },
      };
    });

    const payload: CartAddPayload = {
      items: lineItems.map((item) => ({
        ...item,
        // Shopify expects numeric IDs without gid:// prefix
        variantId: stripGid(item.variantId),
      })),
    };

    try {
      if (onAddToCart) {
        await onAddToCart(payload);
      } else {
        await addToCart(payload);
      }
      setAddToCartState('success');
      analytics.trackAddToCartSuccess(selectedTier, currentPricing);

      // Handle post-add behavior
      setTimeout(() => {
        handlePostAddToCart(settings.addToCartBehavior);
      }, 600);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to add to cart';
      setErrorMessage(msg);
      setAddToCartState('error');
      analytics.trackAddToCartFailed(selectedTier, msg);

      // Reset error state after 3 seconds
      setTimeout(() => {
        setAddToCartState('idle');
        setErrorMessage('');
      }, 3000);
    }
  }, [
    selectedTier,
    currentPricing,
    variantSelections,
    products,
    config.id,
    settings.addToCartBehavior,
    onAddToCart,
    analytics,
  ]);

  if (!tiers.length || !products.length) return <></>;

  const showProducts =
    (config.type === 'fbt' ||
      config.type === 'mix-match' ||
      config.type === 'fixed' ||
      config.type === 'free-gift') &&
    visual.showProductImages;

  const buttonText = getButtonText(addToCartState, currentPricing, settings.currency);

  return (
    <div
      className={`sb-widget sb-widget--${visual.layout} sb-widget--${visual.colorScheme} ${className || ''}`}
      role="group"
      aria-label={config.title}
    >
      {/* Title */}
      <div className="sb-widget__header">
        <h3 className="sb-widget__title">{config.title}</h3>
        {config.subtitle && (
          <p className="sb-widget__subtitle">{config.subtitle}</p>
        )}
      </div>

      {/* Product thumbnails for FBT/mix-match */}
      {showProducts && (
        <div className="sb-widget__products">
          {products.map((product, i) => (
            <React.Fragment key={product.productId}>
              {i > 0 && <span className="sb-widget__plus" aria-hidden="true">+</span>}
              <ProductCard
                product={product}
                size={visual.imageSize}
                showPrice={config.type !== 'volume'}
                onVariantChange={
                  settings.allowVariantSelection ? handleVariantChange : undefined
                }
              />
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Offer tier cards */}
      <div className="sb-widget__offers" role="radiogroup" aria-label="Select bundle option">
        {tiers.map((tier) => {
          const tierPricing = tierPricingMap[tier.id];
          const isDisabled =
            !products.every((p) => p.available) &&
            settings.outOfStockBehavior === 'disable';

          return (
            <OfferCard
              key={tier.id}
              tier={tier}
              products={products}
              selected={tier.id === selectedTierId}
              disabled={isDisabled}
              currency={settings.currency}
              moneyFormat={settings.moneyFormat}
              locale={settings.locale}
              visual={visual}
              pricing={tierPricing}
              onSelect={handleTierSelect}
            />
          );
        })}
      </div>

      {/* Progress bar to next tier */}
      {visual.showProgressBar && nextTier && selectedTier && (
        <ProgressBar
          current={selectedTier.quantity}
          target={nextTier.quantity}
          label={`Add ${nextTier.quantity - selectedTier.quantity} more for ${nextTier.badge || 'extra savings'}!`}
          color={visual.accentColor}
        />
      )}

      {/* Total & Add to Cart */}
      <div className="sb-widget__footer">
        {currentPricing && (
          <div className="sb-widget__total">
            <span className="sb-widget__total-label">Total:</span>
            <div className="sb-widget__total-prices">
              {currentPricing.savingsAmount > 0 && (
                <span className="sb-widget__total-original">
                  {formatPrice(currentPricing.originalPrice, settings.moneyFormat)}
                </span>
              )}
              <span className="sb-widget__total-price">
                {formatPrice(currentPricing.bundlePrice, settings.moneyFormat)}
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          className={`sb-widget__cta sb-widget__cta--${addToCartState}`}
          onClick={handleAddToCart}
          disabled={addToCartState === 'loading' || addToCartState === 'success'}
          aria-busy={addToCartState === 'loading'}
        >
          {addToCartState === 'loading' && (
            <span className="sb-spinner" aria-hidden="true" />
          )}
          {buttonText}
        </button>

        {errorMessage && (
          <p className="sb-widget__error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}

function getButtonText(
  state: AddToCartState,
  pricing: PricingResult | undefined,
  currency: string
): string {
  switch (state) {
    case 'loading':
      return 'Adding...';
    case 'success':
      return 'Added to Cart!';
    case 'error':
      return 'Try Again';
    default:
      if (pricing && pricing.savingsAmount > 0) {
        return `Add to Cart — Save $${pricing.savingsAmount.toFixed(2)}`;
      }
      return 'Add to Cart';
  }
}

function stripGid(id: string): string {
  if (id.startsWith('gid://')) {
    const parts = id.split('/');
    return parts[parts.length - 1];
  }
  return id;
}

import React, { useCallback } from 'react';
import type { OfferCardProps } from '../types';
import { formatPrice, formatPerUnitText } from '../utils/formatting';
import { SavingsBadge } from './SavingsBadge';

/**
 * Individual offer/tier card (e.g., "1-pack", "2-pack Most Popular", "3-pack Best Value").
 * Rapi-style: strong visual hierarchy, badge, savings emphasis, one-click select.
 */
export function OfferCard({
  tier,
  selected,
  disabled,
  moneyFormat,
  locale,
  visual,
  pricing,
  onSelect,
}: OfferCardProps): React.ReactElement {
  const handleSelect = useCallback(() => {
    if (!disabled) onSelect(tier.id);
  }, [tier.id, disabled, onSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault();
        onSelect(tier.id);
      }
    },
    [tier.id, disabled, onSelect]
  );

  const hasSavings = pricing.savingsAmount > 0;
  const badgeText = tier.badge || (tier.isDefault ? 'Most Popular' : '');
  const badgeColor = tier.badgeColor || (tier.isDefault ? '#ff6b35' : '#4CAF50');

  return (
    <div
      role="radio"
      aria-checked={selected}
      aria-label={`${tier.label}: ${formatPrice(pricing.bundlePrice, moneyFormat)}${hasSavings ? `, save ${formatPrice(pricing.savingsAmount, moneyFormat)}` : ''}`}
      tabIndex={0}
      className={[
        'sb-offer',
        selected && 'sb-offer--selected',
        disabled && 'sb-offer--disabled',
        tier.isDefault && 'sb-offer--default',
        hasSavings && 'sb-offer--has-savings',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      style={
        selected && visual.primaryColor
          ? ({ '--sb-primary': visual.primaryColor } as React.CSSProperties)
          : undefined
      }
    >
      {/* Badge */}
      {badgeText && (
        <div
          className={`sb-offer__badge sb-offer__badge--${visual.badgeStyle}`}
          style={{ backgroundColor: badgeColor }}
        >
          {badgeText}
        </div>
      )}

      {/* Radio indicator */}
      <div className="sb-offer__radio">
        <div className="sb-offer__radio-dot" />
      </div>

      {/* Content */}
      <div className="sb-offer__content">
        <div className="sb-offer__header">
          <span className="sb-offer__label">{tier.label}</span>
          {tier.subtitle && (
            <span className="sb-offer__subtitle">{tier.subtitle}</span>
          )}
        </div>

        <div className="sb-offer__pricing">
          {/* Bundle price */}
          <span className="sb-offer__price">
            {formatPrice(pricing.bundlePrice, moneyFormat)}
          </span>

          {/* Compare-at price */}
          {visual.showCompareAtPrice && hasSavings && (
            <span className="sb-offer__compare-price">
              {formatPrice(pricing.originalPrice, moneyFormat)}
            </span>
          )}

          {/* Per-unit price */}
          {visual.showPerUnitPrice && tier.quantity > 1 && (
            <span className="sb-offer__per-unit">
              {formatPerUnitText(pricing.perUnitPrice, moneyFormat)}
            </span>
          )}
        </div>

        {/* Savings */}
        {hasSavings && (visual.showSavingsAmount || visual.showSavingsPercent) && (
          <div className="sb-offer__savings">
            <SavingsBadge
              savingsAmount={pricing.savingsAmount}
              savingsPercent={pricing.savingsPercent}
              currency=""
              moneyFormat={moneyFormat}
              locale={locale}
              style={visual.badgeStyle}
            />
          </div>
        )}

        {/* Free items indicator */}
        {pricing.freeItemsCount > 0 && (
          <div className="sb-offer__free-tag">
            +{pricing.freeItemsCount} FREE
          </div>
        )}
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div className="sb-offer__check" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="currentColor" />
            <path
              d="M6 10l3 3 5-6"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

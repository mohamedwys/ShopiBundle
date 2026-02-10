import React, { useCallback } from 'react';
import type { ProductSelectorProps } from '../types';
import { formatPrice } from '../utils/formatting';

/**
 * Interactive product selector for MIX_MATCH and BUILD_YOUR_OWN bundles.
 * Renders a grid of selectable products with optional quantity controls.
 */
export function ProductSelector({
  products,
  selectedProducts,
  minSelect,
  maxSelect,
  onToggle,
  onQuantityChange,
  currency,
  moneyFormat,
  showPrice,
}: ProductSelectorProps): React.ReactElement {
  const selectedCount = Array.from(selectedProducts.values()).reduce((sum, qty) => sum + qty, 0);
  const canSelectMore = selectedCount < maxSelect;

  const handleToggle = useCallback(
    (productId: string) => {
      const isSelected = selectedProducts.has(productId);
      if (isSelected) {
        onToggle(productId, false);
      } else if (canSelectMore) {
        onToggle(productId, true);
      }
    },
    [selectedProducts, canSelectMore, onToggle]
  );

  return (
    <div className="sb-selector" role="group" aria-label="Select products for your bundle">
      <div className="sb-selector__header">
        <span className="sb-selector__count">
          {selectedCount} of {maxSelect} selected
          {minSelect > 0 && ` (min ${minSelect})`}
        </span>
        {!canSelectMore && (
          <span className="sb-selector__limit">Maximum reached</span>
        )}
      </div>

      <div className="sb-selector__grid">
        {products.map((product) => {
          const isSelected = selectedProducts.has(product.productId);
          const quantity = selectedProducts.get(product.productId) || 0;
          const isDisabled = !product.available || (!isSelected && !canSelectMore);

          return (
            <div
              key={product.productId}
              className={`sb-selector__item ${isSelected ? 'sb-selector__item--selected' : ''} ${isDisabled ? 'sb-selector__item--disabled' : ''}`}
              role="checkbox"
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              onClick={() => !isDisabled && handleToggle(product.productId)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                  e.preventDefault();
                  handleToggle(product.productId);
                }
              }}
            >
              {product.imageUrl && (
                <img
                  className="sb-selector__image"
                  src={product.imageUrl}
                  alt={product.imageAlt || product.title}
                  loading="lazy"
                  width="80"
                  height="80"
                />
              )}
              <div className="sb-selector__info">
                <span className="sb-selector__title">{product.title}</span>
                {showPrice && (
                  <span className="sb-selector__price">
                    {formatPrice(product.price, moneyFormat)}
                  </span>
                )}
                {!product.available && (
                  <span className="sb-selector__oos">Out of stock</span>
                )}
              </div>

              {isSelected && (
                <div className="sb-selector__check" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {isSelected && quantity > 0 && (
                <div className="sb-selector__qty" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="sb-selector__qty-btn"
                    onClick={() => onQuantityChange(product.productId, Math.max(1, quantity - 1))}
                    aria-label={`Decrease quantity for ${product.title}`}
                  >
                    -
                  </button>
                  <span className="sb-selector__qty-value">{quantity}</span>
                  <button
                    type="button"
                    className="sb-selector__qty-btn"
                    onClick={() => {
                      if (selectedCount - quantity + (quantity + 1) <= maxSelect) {
                        onQuantityChange(product.productId, quantity + 1);
                      }
                    }}
                    disabled={selectedCount >= maxSelect}
                    aria-label={`Increase quantity for ${product.title}`}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

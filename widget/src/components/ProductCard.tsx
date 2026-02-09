import React, { useState, useCallback } from 'react';
import type { ProductCardProps } from '../types';
import { VariantSelector } from './VariantSelector';

/**
 * Product card displayed within a bundle.
 * Shows product image, title, price, and optional variant selector.
 */
export function ProductCard({
  product,
  size,
  showPrice,
  onVariantChange,
}: ProductCardProps): React.ReactElement {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variantId || product.variants?.[0]?.id
  );

  const handleVariantChange = useCallback(
    (variantId: string) => {
      setSelectedVariantId(variantId);
      onVariantChange?.(product.productId, variantId);
    },
    [product.productId, onVariantChange]
  );

  const isOutOfStock = !product.available;
  const imgSize = size === 'small' ? 80 : size === 'medium' ? 120 : 180;

  return (
    <div
      className={`sb-product sb-product--${size} ${isOutOfStock ? 'sb-product--oos' : ''}`}
    >
      {product.imageUrl && (
        <div className="sb-product__image-wrap">
          <img
            className="sb-product__image"
            src={product.imageUrl}
            alt={product.imageAlt || product.title}
            width={imgSize}
            height={imgSize}
            loading="lazy"
          />
          {isOutOfStock && (
            <span className="sb-product__oos-overlay">Sold out</span>
          )}
        </div>
      )}
      <div className="sb-product__info">
        <p className="sb-product__title">{product.title}</p>
        {showPrice && (
          <p className="sb-product__price">
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="sb-product__compare-price">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
            <span>${product.price.toFixed(2)}</span>
          </p>
        )}
        {product.quantity > 1 && (
          <span className="sb-product__qty">×{product.quantity}</span>
        )}
      </div>
      {onVariantChange && product.variants && product.variants.length > 1 && (
        <VariantSelector
          variants={product.variants}
          selectedVariantId={selectedVariantId}
          onSelect={handleVariantChange}
          layout="swatches"
        />
      )}
    </div>
  );
}

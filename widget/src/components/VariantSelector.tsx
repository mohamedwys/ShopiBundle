import React, { useCallback } from 'react';
import type { VariantSelectorProps, ProductVariant } from '../types';

/**
 * Variant selector supporting dropdown and swatch layouts.
 * Used for mix-and-match bundles where customers choose variants per product.
 */
export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
  layout = 'dropdown',
}: VariantSelectorProps): React.ReactElement | null {
  if (!variants || variants.length <= 1) return null;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSelect(e.target.value);
    },
    [onSelect]
  );

  const handleSwatchClick = useCallback(
    (variantId: string) => {
      onSelect(variantId);
    },
    [onSelect]
  );

  const handleSwatchKeyDown = useCallback(
    (e: React.KeyboardEvent, variantId: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(variantId);
      }
    },
    [onSelect]
  );

  // Group options by name for swatch display
  const optionGroups = getOptionGroups(variants);

  if (layout === 'swatches' && optionGroups.length > 0) {
    return (
      <div className="sb-variant-selector sb-variant-selector--swatches">
        {optionGroups.map((group) => (
          <div key={group.name} className="sb-variant-group">
            <span className="sb-variant-group__label">{group.name}</span>
            <div className="sb-variant-group__options" role="radiogroup" aria-label={group.name}>
              {group.values.map((value) => {
                const variant = variants.find((v) =>
                  v.options.some(
                    (o) => o.name === group.name && o.value === value
                  )
                );
                const isSelected = variant?.id === selectedVariantId;
                const isAvailable = variant?.available !== false;

                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${group.name}: ${value}`}
                    className={[
                      'sb-swatch',
                      isSelected && 'sb-swatch--selected',
                      !isAvailable && 'sb-swatch--unavailable',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => variant && handleSwatchClick(variant.id)}
                    onKeyDown={(e) =>
                      variant && handleSwatchKeyDown(e, variant.id)
                    }
                    disabled={!isAvailable}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Dropdown fallback
  return (
    <div className="sb-variant-selector sb-variant-selector--dropdown">
      <select
        className="sb-variant-select"
        value={selectedVariantId || ''}
        onChange={handleChange}
        aria-label="Select variant"
      >
        {variants.map((variant) => (
          <option
            key={variant.id}
            value={variant.id}
            disabled={!variant.available}
          >
            {variant.title}
            {!variant.available ? ' (Sold out)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}

function getOptionGroups(
  variants: ProductVariant[]
): Array<{ name: string; values: string[] }> {
  const groups: Map<string, Set<string>> = new Map();

  for (const variant of variants) {
    for (const option of variant.options) {
      if (!groups.has(option.name)) {
        groups.set(option.name, new Set());
      }
      groups.get(option.name)!.add(option.value);
    }
  }

  return Array.from(groups.entries()).map(([name, values]) => ({
    name,
    values: Array.from(values),
  }));
}

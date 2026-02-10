import React, { useCallback } from 'react';
import type { QuantitySelectorProps } from '../types';

/**
 * Reusable quantity selector with +/- buttons.
 * Used for bundle-level quantity selection.
 */
export function QuantitySelector({
  value,
  min,
  max,
  onChange,
  disabled = false,
  size = 'medium',
}: QuantitySelectorProps): React.ReactElement {
  const handleDecrement = useCallback(() => {
    if (value > min) onChange(value - 1);
  }, [value, min, onChange]);

  const handleIncrement = useCallback(() => {
    if (value < max) onChange(value + 1);
  }, [value, max, onChange]);

  return (
    <div className={`sb-qty sb-qty--${size}`} role="group" aria-label="Quantity selector">
      <button
        type="button"
        className="sb-qty__btn sb-qty__btn--minus"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <span className="sb-qty__value" aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button
        type="button"
        className="sb-qty__btn sb-qty__btn--plus"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

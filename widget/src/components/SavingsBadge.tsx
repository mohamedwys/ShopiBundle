import React from 'react';
import type { SavingsBadgeProps } from '../types';
import { formatPrice, formatSavingsPercent } from '../utils/formatting';

/**
 * Savings badge that shows discount amount and/or percentage.
 * Supports pill, ribbon, and banner styles.
 */
export function SavingsBadge({
  savingsAmount,
  savingsPercent,
  moneyFormat,
  style = 'pill',
}: SavingsBadgeProps): React.ReactElement | null {
  if (savingsAmount <= 0) return null;

  const amountText = formatPrice(savingsAmount, moneyFormat);
  const percentText = formatSavingsPercent(savingsPercent);

  return (
    <span
      className={`sb-savings-badge sb-savings-badge--${style}`}
      aria-label={`Save ${amountText} (${percentText})`}
    >
      <span className="sb-savings-badge__percent">{percentText}</span>
      <span className="sb-savings-badge__amount">Save {amountText}</span>
    </span>
  );
}

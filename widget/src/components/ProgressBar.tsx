import React from 'react';
import type { ProgressBarProps } from '../types';

/**
 * Progress bar showing how close the customer is to the next savings tier.
 * Creates urgency and encourages upselling.
 */
export function ProgressBar({
  current,
  target,
  label,
  color,
}: ProgressBarProps): React.ReactElement | null {
  if (target <= 0) return null;

  const percent = Math.min(100, Math.round((current / target) * 100));
  const remaining = target - current;

  return (
    <div className="sb-progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="sb-progress__label">{label}</div>
      <div className="sb-progress__track">
        <div
          className="sb-progress__fill"
          style={{
            width: `${percent}%`,
            backgroundColor: color || undefined,
          }}
        />
      </div>
      {remaining > 0 && (
        <div className="sb-progress__hint">
          Add {remaining} more to unlock!
        </div>
      )}
    </div>
  );
}

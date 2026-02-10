import React from 'react';
import type { EmptyStateProps } from '../types';

/**
 * Empty state shown when no bundle data is available.
 * Replaces the current `<></>` (fragment) returns in BundleWidget and WidgetRoot.
 */
export function EmptyState({ title, description, icon = 'bundle' }: EmptyStateProps): React.ReactElement {
  const icons: Record<string, React.ReactElement> = {
    bundle: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="8" y="16" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 22H40" stroke="currentColor" strokeWidth="2"/>
        <path d="M20 16V40M28 16V40" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 8L24 16L32 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    search: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="22" cy="22" r="12" stroke="currentColor" strokeWidth="2"/>
        <path d="M31 31L40 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    error: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2"/>
        <path d="M24 16V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="34" r="1.5" fill="currentColor"/>
      </svg>
    ),
  };

  return (
    <div className="sb-empty" role="status">
      <div className="sb-empty__icon">{icons[icon]}</div>
      <p className="sb-empty__title">{title}</p>
      {description && <p className="sb-empty__desc">{description}</p>}
    </div>
  );
}

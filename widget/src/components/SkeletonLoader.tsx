import React from 'react';

/**
 * Skeleton loader shown while bundle data is loading.
 * Prevents layout shift by reserving space.
 */
export function SkeletonLoader(): React.ReactElement {
  return (
    <div className="sb-skeleton" role="status" aria-label="Loading bundle offers">
      <div className="sb-skeleton__title" />
      <div className="sb-skeleton__cards">
        {[0, 1, 2].map((i) => (
          <div key={i} className="sb-skeleton__card">
            <div className="sb-skeleton__badge" />
            <div className="sb-skeleton__line sb-skeleton__line--short" />
            <div className="sb-skeleton__line sb-skeleton__line--medium" />
            <div className="sb-skeleton__line sb-skeleton__line--long" />
            <div className="sb-skeleton__btn" />
          </div>
        ))}
      </div>
      <span className="sb-sr-only">Loading...</span>
    </div>
  );
}

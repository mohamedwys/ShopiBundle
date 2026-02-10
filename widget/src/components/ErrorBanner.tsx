import React from 'react';
import type { ErrorBannerProps } from '../types';

/**
 * Dismissible error banner for non-fatal errors.
 * Replaces inline error messages in BundleWidget.
 */
export function ErrorBanner({ message, onDismiss, retryAction }: ErrorBannerProps): React.ReactElement {
  return (
    <div className="sb-error" role="alert">
      <div className="sb-error__content">
        <svg className="sb-error__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 4.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>
        </svg>
        <span className="sb-error__message">{message}</span>
      </div>
      <div className="sb-error__actions">
        {retryAction && (
          <button type="button" className="sb-error__retry" onClick={retryAction}>
            Retry
          </button>
        )}
        {onDismiss && (
          <button type="button" className="sb-error__dismiss" onClick={onDismiss} aria-label="Dismiss error">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

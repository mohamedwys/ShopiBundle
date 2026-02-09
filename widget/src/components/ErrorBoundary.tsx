import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for the bundle widget.
 * Catches React rendering errors and shows a fallback or nothing,
 * ensuring the storefront page is never broken by widget errors.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ShopiBundle] Widget error:', error, errorInfo);

    // Report to analytics endpoint
    try {
      const shop = (window as any).Shopify?.shop || '';
      if (shop) {
        fetch('/apps/proxy/ai/events/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shop,
            bundleId: 'widget-error',
            productId: '',
            eventType: 'error',
            metadata: {
              message: error.message,
              stack: error.stack?.substring(0, 500),
              componentStack: errorInfo.componentStack?.substring(0, 500),
            },
          }),
        }).catch(() => {});
      }
    } catch {
      // Silently fail - error reporting should never cause more errors
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Return fallback or nothing - never break the storefront
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

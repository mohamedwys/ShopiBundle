/**
 * ShopiBundle React Widget - Entry Point
 *
 * Self-mounting widget that renders into a container element.
 * Fetches bundle configuration from the ShopiBundle proxy API
 * and renders the appropriate bundle widget.
 *
 * Usage in Liquid template:
 *   <div id="shopibundle-widget"
 *        data-bundle-handle="my-bundle"
 *        data-product-id="{{ product.id }}"
 *        data-shop="{{ shop.permanent_domain }}"
 *        data-money-format="{{ shop.money_format | json }}"
 *        data-locale="{{ request.locale.iso_code }}">
 *   </div>
 *   <script src="{{ 'bundle-widget.js' | asset_url }}" defer></script>
 */

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import type { BundleConfig, WidgetMountConfig } from './types';
import { BundleWidget } from './components/BundleWidget';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EmptyState } from './components/EmptyState';

// CSS is loaded as text by esbuild and injected into a <style> tag
import cssText from './styles/bundle-widget.css';

// Inject CSS once
let cssInjected = false;
function injectCSS(): void {
  if (cssInjected || typeof document === 'undefined') return;
  cssInjected = true;
  const style = document.createElement('style');
  style.setAttribute('data-shopibundle', '');
  style.textContent = cssText;
  document.head.appendChild(style);
}
injectCSS();

/**
 * Root component that handles data fetching and renders the widget.
 */
function WidgetRoot({ mountConfig }: { mountConfig: WidgetMountConfig }): React.ReactElement {
  const [config, setConfig] = useState<BundleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBundleConfig(mountConfig)
      .then((cfg) => {
        setConfig(cfg);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('[ShopiBundle] Failed to load bundle:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [mountConfig]);

  if (loading) return <SkeletonLoader />;
  if (error) return <EmptyState title="Unable to load bundle" description={error} icon="error" />;
  if (!config) return <></>;

  return <BundleWidget config={config} />;
}

/**
 * Fetch bundle configuration from proxy route
 */
async function fetchBundleConfig(mount: WidgetMountConfig): Promise<BundleConfig> {
  const params = new URLSearchParams();

  if (mount.bundleHandle) params.set('handle', mount.bundleHandle);
  if (mount.productId) params.set('product_id', mount.productId);
  params.set('shop', mount.shopDomain);
  if (mount.locale) params.set('locale', mount.locale);
  if (mount.currency) params.set('currency', mount.currency);

  const proxyPath = mount.proxyPath || '/apps/proxy';
  const response = await fetch(
    `${proxyPath}/bundle-widget?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!data.success || !data.config) {
    throw new Error(data.error || 'No bundle config returned');
  }

  // Apply money format from mount config
  if (mount.moneyFormat && data.config.settings) {
    data.config.settings.moneyFormat = mount.moneyFormat;
  }
  if (mount.locale && data.config.settings) {
    data.config.settings.locale = mount.locale;
  }
  if (mount.currency && data.config.settings) {
    data.config.settings.currency = mount.currency;
  }

  // Apply A/B test overrides
  if (mount.abTest && data.config) {
    if (mount.abTest.defaultTierId) {
      for (const tier of data.config.tiers) {
        tier.isDefault = tier.id === mount.abTest.defaultTierId;
      }
    }
    if (mount.abTest.colorScheme) {
      data.config.visual.colorScheme = mount.abTest.colorScheme;
    }
    if (mount.abTest.layoutVariant) {
      data.config.analytics.experimentVariant = mount.abTest.variant;
      data.config.analytics.experimentId = mount.abTest.experimentId;
    }
  }

  return data.config as BundleConfig;
}

/**
 * Read mount configuration from a container element's data attributes
 */
function readMountConfig(container: HTMLElement): WidgetMountConfig {
  return {
    containerId: container.id,
    bundleHandle: container.dataset.bundleHandle || undefined,
    productId: container.dataset.productId || undefined,
    shopDomain:
      container.dataset.shop ||
      (window as any).Shopify?.shop ||
      '',
    proxyPath: container.dataset.proxyPath || '/apps/proxy',
    locale:
      container.dataset.locale ||
      document.documentElement.lang ||
      'en',
    currency: container.dataset.currency || undefined,
    moneyFormat: container.dataset.moneyFormat || '${{amount}}',
  };
}

/**
 * Mount the widget into all matching containers
 */
function mountWidgets(): void {
  const containers = document.querySelectorAll<HTMLElement>(
    '[data-shopibundle-widget], #shopibundle-widget'
  );

  containers.forEach((container) => {
    // Skip if already mounted
    if (container.dataset.mounted === 'true') return;
    container.dataset.mounted = 'true';

    const mountConfig = readMountConfig(container);

    // Don't mount if no shop domain
    if (!mountConfig.shopDomain) {
      console.warn('[ShopiBundle] No shop domain found, skipping widget mount');
      return;
    }

    // Don't mount if no bundle handle and no product ID
    if (!mountConfig.bundleHandle && !mountConfig.productId) {
      console.warn('[ShopiBundle] No bundle handle or product ID found');
      return;
    }

    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <WidgetRoot mountConfig={mountConfig} />
        </ErrorBoundary>
      </React.StrictMode>
    );
  });
}

// Auto-mount when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountWidgets);
} else {
  mountWidgets();
}

// Observe DOM for dynamically-added widget containers (AJAX section loading)
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver((mutations) => {
    let shouldMount = false;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          if (
            node.hasAttribute('data-shopibundle-widget') ||
            node.querySelector?.('[data-shopibundle-widget]')
          ) {
            shouldMount = true;
          }
        }
      });
    });
    if (shouldMount) mountWidgets();
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });
}

// Export for manual mounting
(window as any).ShopiBundle = {
  mount: mountWidgets,
  BundleWidget,
  SkeletonLoader,
};

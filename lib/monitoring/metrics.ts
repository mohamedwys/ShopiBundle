/**
 * Application Metrics Collection
 *
 * Tracks key performance and business metrics for monitoring.
 * Designed for integration with monitoring services (Datadog, etc.)
 */

import { logger } from './logger';

export interface MetricTags {
  shop?: string;
  bundleType?: string;
  bundleId?: string;
  endpoint?: string;
  status?: string;
  [key: string]: string | undefined;
}

export interface MetricEntry {
  name: string;
  value: number;
  type: 'counter' | 'gauge' | 'histogram' | 'timing';
  tags: MetricTags;
  timestamp: number;
}

// In-memory storage for development
// In production, this would send to Datadog/Prometheus/etc.
const metricsBuffer: MetricEntry[] = [];
const MAX_BUFFER_SIZE = 1000;

/**
 * Record a counter metric (incrementing value)
 */
export function incrementCounter(
  name: string,
  value: number = 1,
  tags: MetricTags = {}
): void {
  recordMetric(name, value, 'counter', tags);
}

/**
 * Record a gauge metric (point-in-time value)
 */
export function recordGauge(
  name: string,
  value: number,
  tags: MetricTags = {}
): void {
  recordMetric(name, value, 'gauge', tags);
}

/**
 * Record a histogram metric (distribution of values)
 */
export function recordHistogram(
  name: string,
  value: number,
  tags: MetricTags = {}
): void {
  recordMetric(name, value, 'histogram', tags);
}

/**
 * Record a timing metric (duration in milliseconds)
 */
export function recordTiming(
  name: string,
  durationMs: number,
  tags: MetricTags = {}
): void {
  recordMetric(name, durationMs, 'timing', tags);
}

/**
 * Time an async operation and record the duration
 */
export async function timeAsync<T>(
  name: string,
  fn: () => Promise<T>,
  tags: MetricTags = {}
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    recordTiming(name, duration, { ...tags, status: 'success' });
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    recordTiming(name, duration, { ...tags, status: 'error' });
    throw error;
  }
}

/**
 * Create a timer that can be stopped manually
 */
export function startTimer(name: string, tags: MetricTags = {}): () => void {
  const start = performance.now();
  return (additionalTags: MetricTags = {}) => {
    const duration = performance.now() - start;
    recordTiming(name, duration, { ...tags, ...additionalTags });
  };
}

function recordMetric(
  name: string,
  value: number,
  type: MetricEntry['type'],
  tags: MetricTags
): void {
  const entry: MetricEntry = {
    name: `shopibundle.${name}`,
    value,
    type,
    tags: cleanTags(tags),
    timestamp: Date.now(),
  };

  // Add to buffer
  metricsBuffer.push(entry);

  // Trim buffer if too large
  if (metricsBuffer.length > MAX_BUFFER_SIZE) {
    metricsBuffer.splice(0, metricsBuffer.length - MAX_BUFFER_SIZE);
  }

  // Log in development
  if (process.env.NODE_ENV !== 'production' && process.env.LOG_METRICS === 'true') {
    logger.debug(`Metric: ${entry.name}=${entry.value}`, entry.tags as any);
  }

  // Send to external service in production
  if (process.env.NODE_ENV === 'production') {
    sendToMetricsService(entry);
  }
}

function cleanTags(tags: MetricTags): MetricTags {
  const cleaned: MetricTags = {};
  for (const [key, value] of Object.entries(tags)) {
    if (value !== undefined && value !== null) {
      cleaned[key] = String(value);
    }
  }
  return cleaned;
}

function sendToMetricsService(entry: MetricEntry): void {
  // Integration point for Datadog, Prometheus, etc.
  // This is a placeholder for actual implementation

  // Example: Datadog StatsD
  // if (process.env.DD_AGENT_HOST) {
  //   statsd.gauge(entry.name, entry.value, entry.tags);
  // }
}

/**
 * Get buffered metrics (for debugging/testing)
 */
export function getMetricsBuffer(): readonly MetricEntry[] {
  return [...metricsBuffer];
}

/**
 * Clear metrics buffer
 */
export function clearMetricsBuffer(): void {
  metricsBuffer.length = 0;
}

// ============================================
// Pre-defined Metrics
// ============================================

export const BundleMetrics = {
  /** Bundle created */
  created: (tags: MetricTags) => incrementCounter('bundle.created', 1, tags),

  /** Bundle published */
  published: (tags: MetricTags) => incrementCounter('bundle.published', 1, tags),

  /** Bundle deleted */
  deleted: (tags: MetricTags) => incrementCounter('bundle.deleted', 1, tags),

  /** Bundle viewed (impression) */
  impression: (tags: MetricTags) => incrementCounter('bundle.impression', 1, tags),

  /** Bundle clicked */
  click: (tags: MetricTags) => incrementCounter('bundle.click', 1, tags),

  /** Bundle added to cart */
  addToCart: (tags: MetricTags) => incrementCounter('bundle.add_to_cart', 1, tags),

  /** Bundle purchased */
  purchase: (tags: MetricTags & { revenue?: number }) => {
    incrementCounter('bundle.purchase', 1, tags);
    if (tags.revenue) {
      recordHistogram('bundle.revenue', tags.revenue, tags);
    }
  },

  /** Active bundles count */
  activeBundles: (count: number, shop: string) =>
    recordGauge('bundle.active_count', count, { shop }),
};

export const APIMetrics = {
  /** API request */
  request: (endpoint: string, method: string, statusCode: number, durationMs: number) =>
    recordTiming('api.request', durationMs, {
      endpoint,
      method,
      status: String(statusCode),
    }),

  /** API error */
  error: (endpoint: string, errorType: string) =>
    incrementCounter('api.error', 1, { endpoint, errorType }),

  /** Rate limit hit */
  rateLimited: (shop: string) =>
    incrementCounter('api.rate_limited', 1, { shop }),
};

export const ShopifyMetrics = {
  /** Shopify API call */
  apiCall: (operation: string, durationMs: number, success: boolean) =>
    recordTiming('shopify.api_call', durationMs, {
      operation,
      status: success ? 'success' : 'error',
    }),

  /** Webhook received */
  webhookReceived: (topic: string, shop: string) =>
    incrementCounter('shopify.webhook', 1, { topic, shop }),

  /** Webhook processing time */
  webhookProcessed: (topic: string, durationMs: number, success: boolean) =>
    recordTiming('shopify.webhook_process', durationMs, {
      topic,
      status: success ? 'success' : 'error',
    }),
};

export const InventoryMetrics = {
  /** Inventory sync triggered */
  syncTriggered: (bundleId: string, trigger: string) =>
    incrementCounter('inventory.sync_triggered', 1, { bundleId, trigger }),

  /** Inventory sync completed */
  syncCompleted: (bundleId: string, durationMs: number, success: boolean) =>
    recordTiming('inventory.sync_duration', durationMs, {
      bundleId,
      status: success ? 'success' : 'error',
    }),

  /** Low stock alert */
  lowStock: (bundleId: string, shop: string) =>
    incrementCounter('inventory.low_stock', 1, { bundleId, shop }),
};

export const PricingMetrics = {
  /** Price calculation */
  calculated: (bundleType: string, durationMs: number) =>
    recordTiming('pricing.calculation', durationMs, { bundleType }),

  /** Discount applied */
  discountApplied: (ruleType: string, amount: number) => {
    incrementCounter('pricing.discount_applied', 1, { ruleType });
    recordHistogram('pricing.discount_amount', amount, { ruleType });
  },
};

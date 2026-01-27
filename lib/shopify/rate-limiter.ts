/**
 * Shopify API Rate Limiter
 *
 * Implements token bucket algorithm to stay within Shopify's rate limits.
 * Shopify uses a leaky bucket with 40 requests capacity, refilling at 2/second.
 *
 * @see https://shopify.dev/docs/api/usage/rate-limits
 */

export interface RateLimiterConfig {
  /** Maximum requests per second (default: 2) */
  maxRequestsPerSecond: number;
  /** Bucket size / max burst capacity (default: 40) */
  bucketSize: number;
  /** Buffer percentage to stay below limit (default: 0.2 = 20%) */
  bufferPercent: number;
  /** Enable logging (default: false) */
  debug: boolean;
}

export interface RateLimitStatus {
  availableTokens: number;
  maxTokens: number;
  isThrottled: boolean;
  waitTimeMs: number;
  utilizationPercent: number;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  maxRequestsPerSecond: 2,
  bucketSize: 40,
  bufferPercent: 0.2,
  debug: false,
};

export class ShopifyRateLimiter {
  private config: RateLimiterConfig;
  private tokens: number;
  private lastRefill: number;
  private effectiveBucketSize: number;
  private queue: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
    timestamp: number;
  }> = [];
  private isProcessingQueue = false;

  constructor(config: Partial<RateLimiterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.effectiveBucketSize = Math.floor(
      this.config.bucketSize * (1 - this.config.bufferPercent)
    );
    this.tokens = this.effectiveBucketSize;
    this.lastRefill = Date.now();
  }

  /**
   * Refill tokens based on time elapsed
   */
  private refillTokens(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = (elapsed / 1000) * this.config.maxRequestsPerSecond;

    this.tokens = Math.min(this.effectiveBucketSize, this.tokens + tokensToAdd);
    this.lastRefill = now;

    if (this.config.debug) {
      console.log(
        `[RateLimiter] Refilled ${tokensToAdd.toFixed(2)} tokens. ` +
          `Available: ${this.tokens.toFixed(2)}/${this.effectiveBucketSize}`
      );
    }
  }

  /**
   * Get current rate limit status
   */
  getStatus(): RateLimitStatus {
    this.refillTokens();

    return {
      availableTokens: Math.floor(this.tokens),
      maxTokens: this.effectiveBucketSize,
      isThrottled: this.tokens < 1,
      waitTimeMs: this.tokens < 1 ? Math.ceil((1 - this.tokens) / this.config.maxRequestsPerSecond * 1000) : 0,
      utilizationPercent: Math.round(
        ((this.effectiveBucketSize - this.tokens) / this.effectiveBucketSize) * 100
      ),
    };
  }

  /**
   * Acquire a token to make a request
   * Returns immediately if token available, otherwise waits
   */
  async acquire(): Promise<void> {
    this.refillTokens();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      if (this.config.debug) {
        console.log(
          `[RateLimiter] Token acquired. Remaining: ${this.tokens.toFixed(2)}`
        );
      }
      return;
    }

    // Need to wait for a token
    const waitTime = Math.ceil((1 - this.tokens) / this.config.maxRequestsPerSecond * 1000);

    if (this.config.debug) {
      console.log(`[RateLimiter] Throttled. Waiting ${waitTime}ms for token`);
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Rate limiter timeout'));
      }, 30000); // 30 second max wait

      this.queue.push({
        resolve: () => {
          clearTimeout(timeout);
          resolve();
        },
        reject,
        timestamp: Date.now(),
      });

      this.processQueue();
    });
  }

  /**
   * Process queued requests
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (this.queue.length > 0) {
      this.refillTokens();

      if (this.tokens >= 1) {
        const item = this.queue.shift();
        if (item) {
          this.tokens -= 1;
          item.resolve();
        }
      } else {
        // Wait for token to become available
        const waitTime = Math.ceil((1 - this.tokens) / this.config.maxRequestsPerSecond * 1000);
        await this.sleep(waitTime);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Wrap a function with rate limiting
   */
  wrap<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      await this.acquire();
      return fn(...args);
    }) as T;
  }

  /**
   * Execute multiple requests with rate limiting
   */
  async batch<T>(
    requests: Array<() => Promise<T>>,
    options: { concurrency?: number; onProgress?: (completed: number, total: number) => void } = {}
  ): Promise<T[]> {
    const { concurrency = 4, onProgress } = options;
    const results: T[] = [];
    let completed = 0;

    const executeWithLimit = async (fn: () => Promise<T>, index: number): Promise<void> => {
      await this.acquire();
      results[index] = await fn();
      completed++;
      onProgress?.(completed, requests.length);
    };

    // Process in batches respecting concurrency
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      await Promise.all(batch.map((fn, j) => executeWithLimit(fn, i + j)));
    }

    return results;
  }

  /**
   * Update rate limiter based on Shopify response headers
   */
  updateFromHeaders(headers: Headers | Record<string, string>): void {
    const getHeader = (name: string): string | null => {
      if (headers instanceof Headers) {
        return headers.get(name);
      }
      return headers[name] || headers[name.toLowerCase()] || null;
    };

    // X-Shopify-Shop-Api-Call-Limit: 32/40
    const callLimit = getHeader('X-Shopify-Shop-Api-Call-Limit');
    if (callLimit) {
      const [used, max] = callLimit.split('/').map(Number);
      if (!isNaN(used) && !isNaN(max)) {
        // Sync our token count with Shopify's actual state
        const available = max - used;
        const effectiveAvailable = Math.floor(available * (1 - this.config.bufferPercent));
        this.tokens = Math.min(this.effectiveBucketSize, effectiveAvailable);

        if (this.config.debug) {
          console.log(
            `[RateLimiter] Updated from headers. Shopify: ${used}/${max}, ` +
              `Effective tokens: ${this.tokens}`
          );
        }
      }
    }

    // Check for retry-after header (429 response)
    const retryAfter = getHeader('Retry-After');
    if (retryAfter) {
      const waitSeconds = parseFloat(retryAfter);
      if (!isNaN(waitSeconds)) {
        this.tokens = 0;
        if (this.config.debug) {
          console.log(`[RateLimiter] Retry-After detected. Waiting ${waitSeconds}s`);
        }
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance for the app
let defaultRateLimiter: ShopifyRateLimiter | null = null;

export function getShopifyRateLimiter(
  config?: Partial<RateLimiterConfig>
): ShopifyRateLimiter {
  if (!defaultRateLimiter) {
    defaultRateLimiter = new ShopifyRateLimiter(config);
  }
  return defaultRateLimiter;
}

/**
 * Rate-limited fetch wrapper for Shopify API
 */
export async function shopifyFetch(
  url: string,
  options: RequestInit = {},
  rateLimiter?: ShopifyRateLimiter
): Promise<Response> {
  const limiter = rateLimiter || getShopifyRateLimiter();

  await limiter.acquire();

  const response = await fetch(url, options);

  // Update rate limiter from response headers
  limiter.updateFromHeaders(response.headers);

  // Handle rate limit exceeded
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    const waitTime = retryAfter ? parseFloat(retryAfter) * 1000 : 1000;

    console.warn(`[ShopifyFetch] Rate limited. Retrying after ${waitTime}ms`);

    await new Promise((resolve) => setTimeout(resolve, waitTime));
    return shopifyFetch(url, options, limiter);
  }

  return response;
}

/**
 * Structured Logger for ShopiBundle
 *
 * Provides consistent logging across the application with:
 * - Structured JSON output for production
 * - Pretty output for development
 * - Context tracking (shop, bundleId, requestId)
 * - Performance timing
 * - Error tracking integration ready
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  shop?: string;
  bundleId?: string;
  requestId?: string;
  userId?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface LoggerConfig {
  /** Minimum log level to output */
  minLevel: LogLevel;
  /** Output as JSON (for production) */
  jsonOutput: boolean;
  /** Include stack traces */
  includeStackTrace: boolean;
  /** Service name for log aggregation */
  serviceName: string;
  /** Environment (development, staging, production) */
  environment: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: (process.env.LOG_LEVEL as LogLevel) || 'info',
  jsonOutput: process.env.NODE_ENV === 'production',
  includeStackTrace: process.env.NODE_ENV !== 'production',
  serviceName: 'shopibundle',
  environment: process.env.NODE_ENV || 'development',
};

class Logger {
  private config: LoggerConfig;
  private defaultContext: LogContext = {};

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Set default context that will be included in all logs
   */
  setDefaultContext(context: LogContext): void {
    this.defaultContext = { ...this.defaultContext, ...context };
  }

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): Logger {
    const childLogger = new Logger(this.config);
    childLogger.defaultContext = { ...this.defaultContext, ...context };
    return childLogger;
  }

  /**
   * Log at debug level
   */
  debug(message: string, context?: LogContext, metadata?: Record<string, unknown>): void {
    this.log('debug', message, context, metadata);
  }

  /**
   * Log at info level
   */
  info(message: string, context?: LogContext, metadata?: Record<string, unknown>): void {
    this.log('info', message, context, metadata);
  }

  /**
   * Log at warn level
   */
  warn(message: string, context?: LogContext, metadata?: Record<string, unknown>): void {
    this.log('warn', message, context, metadata);
  }

  /**
   * Log at error level
   */
  error(
    message: string,
    error?: Error | unknown,
    context?: LogContext,
    metadata?: Record<string, unknown>
  ): void {
    const errorInfo = this.formatError(error);
    this.log('error', message, context, { ...metadata, error: errorInfo });
  }

  /**
   * Time an async operation
   */
  async time<T>(
    label: string,
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.info(`${label} completed`, context, { duration: Math.round(duration) });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`${label} failed`, error, context, { duration: Math.round(duration) });
      throw error;
    }
  }

  /**
   * Create a timer for manual timing
   */
  startTimer(label: string, context?: LogContext): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.info(`${label} completed`, context, { duration: Math.round(duration) });
    };
  }

  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    metadata?: Record<string, unknown>
  ): void {
    if (LOG_LEVELS[level] < LOG_LEVELS[this.config.minLevel]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...this.defaultContext, ...context },
      metadata,
    };

    if (this.config.jsonOutput) {
      this.outputJson(entry);
    } else {
      this.outputPretty(entry);
    }

    // Send to error tracking service if error level
    if (level === 'error' && metadata?.error) {
      this.sendToErrorTracking(entry);
    }
  }

  private formatError(error: unknown): { name: string; message: string; stack?: string } | undefined {
    if (!error) return undefined;

    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: this.config.includeStackTrace ? error.stack : undefined,
      };
    }

    return {
      name: 'UnknownError',
      message: String(error),
    };
  }

  private outputJson(entry: LogEntry): void {
    const output = JSON.stringify({
      ...entry,
      service: this.config.serviceName,
      environment: this.config.environment,
    });

    switch (entry.level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }

  private outputPretty(entry: LogEntry): void {
    const colors = {
      debug: '\x1b[36m', // cyan
      info: '\x1b[32m',  // green
      warn: '\x1b[33m',  // yellow
      error: '\x1b[31m', // red
      reset: '\x1b[0m',
    };

    const timestamp = entry.timestamp.split('T')[1].split('.')[0];
    const levelStr = entry.level.toUpperCase().padEnd(5);
    const color = colors[entry.level];

    let output = `${color}[${timestamp}] ${levelStr}${colors.reset} ${entry.message}`;

    if (entry.context && Object.keys(entry.context).length > 0) {
      const contextStr = Object.entries(entry.context)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${v}`)
        .join(' ');
      if (contextStr) {
        output += ` \x1b[90m(${contextStr})\x1b[0m`;
      }
    }

    if (entry.metadata?.duration !== undefined) {
      output += ` \x1b[90m[${entry.metadata.duration}ms]\x1b[0m`;
    }

    switch (entry.level) {
      case 'error':
        console.error(output);
        if (entry.metadata?.error) {
          const err = entry.metadata.error as { stack?: string };
          if (err.stack) {
            console.error(`\x1b[31m${err.stack}\x1b[0m`);
          }
        }
        break;
      case 'warn':
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }

  private sendToErrorTracking(entry: LogEntry): void {
    // Integration point for Sentry or other error tracking
    // This will be implemented when Sentry is added
    if (process.env.SENTRY_DSN && typeof window !== 'undefined') {
      // Client-side Sentry
      // Sentry.captureException(entry.metadata?.error);
    }
  }
}

// Singleton instance
export const logger = new Logger();

// Export class for creating custom instances
export { Logger };

/**
 * Create a request-scoped logger
 */
export function createRequestLogger(requestId: string, shop?: string): Logger {
  return logger.child({ requestId, shop });
}

/**
 * Create a bundle-scoped logger
 */
export function createBundleLogger(bundleId: string, shop: string): Logger {
  return logger.child({ bundleId, shop });
}

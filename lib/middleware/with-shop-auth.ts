/**
 * Shop Authentication Middleware for V2 API Routes
 *
 * Extracts and validates shop from session token.
 * Provides typed request context to handlers.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import shopify from '@/utils/shopify';
import { logger, createRequestLogger } from '@/lib/monitoring/logger';
import { APIMetrics } from '@/lib/monitoring/metrics';
import { isFeatureEnabled } from '@/config/feature-flags';

export interface AuthenticatedRequest extends NextApiRequest {
  shop: string;
  requestId: string;
}

export interface ApiContext {
  shop: string;
  requestId: string;
  req: NextApiRequest;
  res: NextApiResponse;
}

type ApiHandler = (ctx: ApiContext) => Promise<void>;

interface MiddlewareOptions {
  requiredFeatureFlag?: string;
  methods?: string[];
}

/**
 * Wrap an API handler with authentication and standard error handling
 */
export function withShopAuth(
  handler: ApiHandler,
  options: MiddlewareOptions = {}
): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
  const { requiredFeatureFlag, methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] } = options;

  return async (req: NextApiRequest, res: NextApiResponse) => {
    const requestId = generateRequestId();
    const startTime = performance.now();
    const log = createRequestLogger(requestId);

    try {
      // Check HTTP method
      if (!methods.includes(req.method || '')) {
        return res.status(405).json({
          success: false,
          error: 'Method not allowed',
        });
      }

      // Check feature flag if required
      if (requiredFeatureFlag && !isFeatureEnabled(requiredFeatureFlag as any)) {
        return res.status(404).json({
          success: false,
          error: 'Feature not available',
        });
      }

      // Extract shop from authorization token
      const shop = await extractShopFromToken(req);

      if (!shop) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Could not authenticate request. Please ensure you are logged in.',
        });
      }

      log.setDefaultContext({ shop });
      log.debug('API request started', { method: req.method, url: req.url });

      // Create context and call handler
      const ctx: ApiContext = {
        shop,
        requestId,
        req,
        res,
      };

      await handler(ctx);

      // Track success metrics
      const duration = performance.now() - startTime;
      APIMetrics.request(
        req.url || 'unknown',
        req.method || 'unknown',
        res.statusCode,
        duration
      );
    } catch (error: any) {
      const duration = performance.now() - startTime;

      // Log error
      log.error('API request failed', error, {
        method: req.method,
        url: req.url,
      });

      // Track error metrics
      APIMetrics.error(req.url || 'unknown', error?.name || 'UnknownError');
      APIMetrics.request(
        req.url || 'unknown',
        req.method || 'unknown',
        500,
        duration
      );

      // Handle specific error types
      if (error?.message?.includes('session') || error?.message?.includes('No offline session')) {
        return res.status(401).json({
          success: false,
          error: 'Session expired',
          message: 'Please reinstall the app to refresh your session.',
        });
      }

      if (error?.networkStatusCode === 401 || error?.message?.includes('Unauthorized')) {
        return res.status(401).json({
          success: false,
          error: 'Invalid access token',
          message: 'Please reinstall the app to generate a new token.',
        });
      }

      // Validation errors
      if (error?.name === 'ValidationError' || error?.message?.startsWith('Validation')) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.message,
        });
      }

      // Not found errors
      if (error?.message?.includes('not found') || error?.message?.includes('Not found')) {
        return res.status(404).json({
          success: false,
          error: 'Not found',
          message: error.message,
        });
      }

      // Generic error
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
        requestId,
      });
    }
  };
}

/**
 * Extract shop domain from session token in Authorization header
 */
async function extractShopFromToken(req: NextApiRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = await shopify.session.decodeSessionToken(token);
    return payload.dest.replace('https://', '');
  } catch (error) {
    logger.warn('Failed to decode session token', { error });
    return null;
  }
}

/**
 * Generate unique request ID for tracing
 */
function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parse and validate request body as JSON
 */
export function parseBody<T>(req: NextApiRequest): T {
  if (typeof req.body === 'object') {
    return req.body as T;
  }
  try {
    return JSON.parse(req.body) as T;
  } catch {
    throw new Error('Invalid JSON body');
  }
}

/**
 * Send success response
 */
export function sendSuccess<T>(res: NextApiResponse, data: T, status: number = 200): void {
  res.status(status).json({
    success: true,
    data,
  });
}

/**
 * Send error response
 */
export function sendError(
  res: NextApiResponse,
  message: string,
  status: number = 400,
  details?: unknown
): void {
  res.status(status).json({
    success: false,
    error: message,
    details,
  });
}

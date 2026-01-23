import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // CRITICAL: Set headers for OAuth cookies to work in embedded context
  // Shopify embedded apps run in iframes and need cross-origin cookie support

  // Allow credentials for cross-origin requests (needed for cookies in iframes)
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  // Set proper cache control for auth routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/api/:path*',
  ],
};

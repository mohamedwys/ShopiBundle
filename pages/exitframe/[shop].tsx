import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * ExitFrame Page
 *
 * This page handles re-authentication redirects when a session is invalid.
 * It can receive either:
 * - /exitframe/[shop] - shop as path parameter
 * - /exitframe?redirectUri=... - explicit redirect URI
 */
export default function ExitFrame() {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const { redirectUri, shop: queryShop } = router.query;

    // Get shop from path (e.g., /exitframe/myshop.myshopify.com)
    // The path might be /exitframe/[shop] which Next.js parses as router.query.shop
    let shop = queryShop;

    // Handle case where shop comes from path segment
    if (!shop && router.asPath) {
      const match = router.asPath.match(/\/exitframe\/([^?]+)/);
      if (match) {
        shop = match[1];
      }
    }

    let targetUrl: string | null = null;

    if (redirectUri && typeof redirectUri === 'string') {
      // Use explicit redirectUri if provided
      targetUrl = decodeURIComponent(redirectUri);
    } else if (shop && typeof shop === 'string') {
      // Build OAuth URL from shop parameter
      const cleanShop = shop.replace(/\/$/, ''); // Remove trailing slash
      targetUrl = `/api/auth?shop=${encodeURIComponent(cleanShop)}`;
    }

    if (targetUrl) {
      setRedirectUrl(targetUrl);
      console.log('ExitFrame: Redirecting to', targetUrl);

      // Redirect after a brief delay to ensure the page renders
      setTimeout(() => {
        if (window.top === window.self) {
          // Not in an iframe
          window.location.href = targetUrl!;
        } else {
          // In an iframe - need to break out
          window.open(targetUrl!, '_top');
        }
      }, 100);
    } else {
      console.error('ExitFrame: No shop or redirectUri provided');
      console.log('Query params:', router.query);
      console.log('Path:', router.asPath);
    }
  }, [router.isReady, router.query, router.asPath]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Session Expired</h2>
        <p>Your session has expired. Redirecting to re-authenticate...</p>
        {redirectUrl ? (
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            If you are not redirected automatically, click the button below.
          </p>
        ) : (
          <p style={{ color: '#dc2626' }}>
            Error: Could not determine redirect URL.
          </p>
        )}
        <button
          onClick={() => {
            if (redirectUrl) {
              window.open(redirectUrl, '_top');
            } else {
              // Fallback: try to extract shop from current URL
              const urlParams = new URLSearchParams(window.location.search);
              const shop = urlParams.get('shop') ||
                window.location.pathname.split('/').pop();
              if (shop && shop !== 'exitframe') {
                window.open(`/api/auth?shop=${encodeURIComponent(shop)}`, '_top');
              }
            }
          }}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            backgroundColor: '#5469d4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Re-authenticate App
        </button>
      </div>
    </div>
  );
}

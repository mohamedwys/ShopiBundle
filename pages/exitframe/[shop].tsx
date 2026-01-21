import { Spinner } from "@shopify/polaris";
import { useEffect } from "react";
import { useRouter } from "next/router";

const ExitFrameWithShop = () => {
  const router = useRouter();

  useEffect(() => {
    const { shop, host, redirectUri } = router.query;

    if (!shop || typeof shop !== 'string') {
      console.error('No shop provided to exitframe');
      return;
    }

    console.log('ExitFrame: Breaking out of iframe for shop:', shop);
    console.log('Redirecting to reinstall/reauthorize the app');

    // Construct the redirect URL to start OAuth flow
    const targetUrl = redirectUri
      ? decodeURIComponent(redirectUri as string)
      : `/api?shop=${shop}${host ? `&host=${host}` : ''}`;

    const fullUrl = window.location.origin + targetUrl;

    // Break out of iframe using multiple methods for better compatibility
    if (window.top && window.top !== window.self) {
      // Method 1: Shopify App Bridge message
      window.parent.postMessage(
        JSON.stringify({
          message: "Shopify.API.remoteRedirect",
          data: { location: fullUrl }
        }),
        `https://${shop}`
      );

      // Method 2: Direct top navigation (fallback)
      setTimeout(() => {
        if (window.top) {
          window.top.location.href = fullUrl;
        }
      }, 500);
    } else {
      // Not in iframe, direct redirect
      window.location.href = fullUrl;
    }
  }, [router.query]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <Spinner size="large" />
      <p>Redirecting to reauthorize the app...</p>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        Your access token may have expired. Redirecting to reinstall.
      </p>
    </div>
  );
};

export default ExitFrameWithShop;

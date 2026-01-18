import { Layout, Page, Spinner, BlockStack } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function AppBridgeProvider({ children }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for Next.js router to be fully ready before checking query params
    if (!router.isReady) {
      console.log('Router not ready yet, waiting...');
      return;
    }

    const host = router.query?.host;
    const shop = router.query?.shop;
    const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;

    // Debug logging
    console.log('AppBridgeProvider init (router ready):', { host, shop, apiKey: apiKey ? 'set' : 'missing' });

    if (!apiKey) {
      setError('NEXT_PUBLIC_SHOPIFY_API_KEY environment variable is missing');
      return;
    }

    // If no host parameter, handle missing host scenario
    if (!host && shop) {
      // Check if we've already attempted redirect to prevent infinite loop
      const redirectAttempts = parseInt(sessionStorage.getItem('authRedirectAttempts') || '0');

      if (redirectAttempts < 2) {
        console.log(`Missing host parameter, redirecting to auth (attempt ${redirectAttempts + 1})`);
        sessionStorage.setItem('authRedirectAttempts', String(redirectAttempts + 1));

        // Redirect to Shopify admin to reload the app with proper host parameter
        const shopifyAdminUrl = `https://${shop}/admin/apps/${apiKey}`;
        window.top.location.href = shopifyAdminUrl;
        return;
      } else {
        // After 2 failed attempts, show error instead of looping
        console.error('Failed to get host parameter after multiple attempts');
        sessionStorage.removeItem('authRedirectAttempts');
        setError(
          `Unable to load app properly. The 'host' parameter is missing. ` +
          `Please reinstall the app or contact support. Shop: ${shop}`
        );
        return;
      }
    }

    // If neither host nor shop, show error
    if (!host && !shop) {
      setError('Missing required query parameters. Please access this app through Shopify admin.');
      return;
    }

    // Clear redirect attempts counter on successful load
    if (host && shop) {
      sessionStorage.removeItem('authRedirectAttempts');
    }

    // Initialize shopify global with the app bridge
    if (window.shopify) {
      setIsReady(true);
    } else {
      // Wait for the script to load (max 5 seconds)
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds

      const checkShopify = setInterval(() => {
        attempts++;

        if (window.shopify) {
          clearInterval(checkShopify);
          setIsReady(true);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkShopify);
          setError('App Bridge failed to load. Please refresh the page.');
        }
      }, 100);

      return () => clearInterval(checkShopify);
    }
  }, [router.isReady, router.query]);

  if (error) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <BlockStack align="center" inlineAlign="center">
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ color: '#bf0711', fontWeight: 'bold', marginBottom: '10px' }}>
                  App Initialization Error
                </p>
                <p>{error}</p>
                <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  Check browser console for details.
                </p>
              </div>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (!isReady) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <BlockStack align="center">
              <Spinner size="large" />
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return <>{children}</>;
}

export default AppBridgeProvider;
import { Layout, Page, Spinner, BlockStack, Button, Text, Card } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function AppBridgeProvider({ children }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [shop, setShop] = useState(null);

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

    // If no host parameter but we have shop, show error (don't auto-redirect to avoid loops)
    if (!host && shop) {
      console.error('Missing host parameter - app must be accessed through Shopify admin');
      setShop(shop);
      setError('missing_host');
      return;
    }

    // If neither host nor shop, show error
    if (!host && !shop) {
      setError('Missing required query parameters. Please access this app through Shopify admin.');
      return;
    }

    // Clear any stored shop value on successful load
    if (host && shop) {
      setShop(null);
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

  // Special handling for missing_host error
  if (error === 'missing_host' && shop) {
    const handleReauth = () => {
      sessionStorage.clear();
      const authUrl = `/api/auth?shop=${shop}`;
      if (window !== window.top) {
        window.top.location.href = authUrl;
      } else {
        window.location.href = authUrl;
      }
    };

    const handleShopifyAdmin = () => {
      sessionStorage.clear();
      window.top.location.href = `https://${shop}/admin/apps`;
    };

    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">
                  Missing Host Parameter
                </Text>
                <Text as="p">
                  This app is missing the required 'host' parameter, which means it wasn't loaded through Shopify Admin correctly.
                </Text>
                <Text as="p" tone="subdued">
                  Shop: <strong>{shop}</strong>
                </Text>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">
                    Try these solutions:
                  </Text>
                  <Text as="p">
                    1. Access the app through <strong>Shopify Admin → Apps → ShopiBundle</strong>
                  </Text>
                  <Text as="p">
                    2. Or click one of the buttons below to fix the issue:
                  </Text>
                </BlockStack>
                <BlockStack gap="200">
                  <Button variant="primary" onClick={handleReauth} fullWidth>
                    Restart OAuth Authorization
                  </Button>
                  <Button onClick={handleShopifyAdmin} fullWidth>
                    Go to Shopify Admin Apps
                  </Button>
                  <Button
                    onClick={() => { sessionStorage.clear(); window.location.reload(); }}
                    fullWidth
                  >
                    Clear Cache & Reload
                  </Button>
                </BlockStack>
                <Text as="p" variant="bodyMd" tone="subdued">
                  If the problem persists, try accessing the app in a private/incognito browser window.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  // Handle other errors
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
                <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
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
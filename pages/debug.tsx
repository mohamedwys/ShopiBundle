import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Page, Layout, Card, BlockStack, Text, Button, Banner } from "@shopify/polaris";

export default function DebugPage() {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    const info = {
      // Router info
      routerReady: router.isReady,
      pathname: router.pathname,
      asPath: router.asPath,

      // Query parameters
      host: router.query?.host || 'MISSING',
      shop: router.query?.shop || 'MISSING',
      embedded: router.query?.embedded || 'MISSING',

      // Environment
      apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY ? 'SET' : 'MISSING',

      // Browser info
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'NONE',

      // URL info
      fullUrl: window.location.href,
      origin: window.location.origin,
      search: window.location.search,

      // Session storage
      redirectAttempts: sessionStorage.getItem('authRedirectAttempts') || '0',

      // iframe detection
      isInIframe: window !== window.top,

      // App Bridge
      shopifyExists: typeof window.shopify !== 'undefined',
    };

    setDebugInfo(info);
  }, [router.isReady, router.query]);

  const handleReinstall = () => {
    const shop = router.query?.shop || prompt('Enter your shop domain (e.g., mystore.myshopify.com)');
    if (shop) {
      window.top.location.href = `/api?shop=${shop}`;
    }
  };

  const handleClearStorage = () => {
    sessionStorage.clear();
    localStorage.clear();
    alert('Storage cleared! Refresh the page.');
  };

  if (!debugInfo) {
    return (
      <Page title="Loading Debug Info...">
        <Layout>
          <Layout.Section>
            <Card>
              <Text as="p">Loading diagnostic information...</Text>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const hasIssues =
    debugInfo.host === 'MISSING' ||
    debugInfo.shop === 'MISSING' ||
    debugInfo.apiKey === 'MISSING' ||
    !debugInfo.shopifyExists;

  return (
    <Page title="ShopiBundle - Debug Information">
      <Layout>
        <Layout.Section>
          {hasIssues && (
            <Banner
              title="Configuration Issues Detected"
              status="critical"
            >
              <p>
                The app is missing required parameters or configuration.
                See details below.
              </p>
            </Banner>
          )}
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Query Parameters
              </Text>
              <div>
                <Text as="p" fontWeight="bold">Shop:</Text>
                <Text as="p" tone={debugInfo.shop === 'MISSING' ? 'critical' : 'success'}>
                  {debugInfo.shop}
                </Text>
              </div>
              <div>
                <Text as="p" fontWeight="bold">Host:</Text>
                <Text as="p" tone={debugInfo.host === 'MISSING' ? 'critical' : 'success'}>
                  {debugInfo.host}
                </Text>
              </div>
              <div>
                <Text as="p" fontWeight="bold">Embedded:</Text>
                <Text as="p">{debugInfo.embedded}</Text>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Environment Variables
              </Text>
              <div>
                <Text as="p" fontWeight="bold">NEXT_PUBLIC_SHOPIFY_API_KEY:</Text>
                <Text as="p" tone={debugInfo.apiKey === 'MISSING' ? 'critical' : 'success'}>
                  {debugInfo.apiKey}
                </Text>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                App State
              </Text>
              <div>
                <Text as="p" fontWeight="bold">Router Ready:</Text>
                <Text as="p">{debugInfo.routerReady ? 'Yes' : 'No'}</Text>
              </div>
              <div>
                <Text as="p" fontWeight="bold">In iframe:</Text>
                <Text as="p">{debugInfo.isInIframe ? 'Yes' : 'No'}</Text>
              </div>
              <div>
                <Text as="p" fontWeight="bold">Shopify App Bridge Loaded:</Text>
                <Text as="p" tone={!debugInfo.shopifyExists ? 'critical' : 'success'}>
                  {debugInfo.shopifyExists ? 'Yes' : 'No'}
                </Text>
              </div>
              <div>
                <Text as="p" fontWeight="bold">Redirect Attempts:</Text>
                <Text as="p">{debugInfo.redirectAttempts}</Text>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                URL Information
              </Text>
              <div>
                <Text as="p" fontWeight="bold">Full URL:</Text>
                <Text as="p" breakWord>{debugInfo.fullUrl}</Text>
              </div>
              <div>
                <Text as="p" fontWeight="bold">Pathname:</Text>
                <Text as="p">{debugInfo.pathname}</Text>
              </div>
              <div>
                <Text as="p" fontWeight="bold">Query String:</Text>
                <Text as="p">{debugInfo.search || 'NONE'}</Text>
              </div>
              <div>
                <Text as="p" fontWeight="bold">Referrer:</Text>
                <Text as="p" breakWord>{debugInfo.referrer}</Text>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Troubleshooting Actions
              </Text>
              <BlockStack gap="200">
                <Button onClick={handleReinstall} variant="primary">
                  Restart OAuth Flow
                </Button>
                <Button onClick={handleClearStorage}>
                  Clear Browser Storage
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Common Issues & Solutions
              </Text>

              {debugInfo.host === 'MISSING' && (
                <Banner status="warning">
                  <Text as="p" fontWeight="bold">Missing Host Parameter</Text>
                  <p>
                    The 'host' parameter is required for embedded apps. This usually
                    means the app is being accessed directly instead of through
                    Shopify admin.
                  </p>
                  <p><strong>Solution:</strong> Access the app through Shopify Admin → Apps → ShopiBundle</p>
                </Banner>
              )}

              {debugInfo.shop === 'MISSING' && (
                <Banner status="critical">
                  <Text as="p" fontWeight="bold">Missing Shop Parameter</Text>
                  <p>The shop domain is required to identify your store.</p>
                  <p><strong>Solution:</strong> Click "Restart OAuth Flow" above</p>
                </Banner>
              )}

              {debugInfo.apiKey === 'MISSING' && (
                <Banner status="critical">
                  <Text as="p" fontWeight="bold">Missing API Key</Text>
                  <p>NEXT_PUBLIC_SHOPIFY_API_KEY environment variable is not set.</p>
                  <p><strong>Solution:</strong> Add the environment variable in Vercel and redeploy</p>
                </Banner>
              )}

              {!debugInfo.shopifyExists && (
                <Banner status="warning">
                  <Text as="p" fontWeight="bold">App Bridge Not Loaded</Text>
                  <p>The Shopify App Bridge script failed to load.</p>
                  <p><strong>Solution:</strong> Check network connection and disable ad blockers</p>
                </Banner>
              )}

              {!debugInfo.isInIframe && debugInfo.host !== 'MISSING' && (
                <Banner status="info">
                  <Text as="p" fontWeight="bold">Not In iframe</Text>
                  <p>The app should be loaded inside Shopify admin iframe.</p>
                  <p><strong>Solution:</strong> This is normal for initial OAuth flow</p>
                </Banner>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text as="p" variant="bodyMd" tone="subdued">
                Debug information generated at: {new Date().toISOString()}
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                To access this page: /debug
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

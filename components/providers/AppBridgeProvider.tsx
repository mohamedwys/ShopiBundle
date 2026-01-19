// components/providers/AppBridgeProvider.tsx
import { Page, Layout, Spinner, Card, Text, BlockStack, Button } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AppBridgeProvider({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [shop, setShop] = useState<string | null>(null);
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const hostParam = router.query.host?.toString() || null;
    const shopParam = router.query.shop?.toString() || null;
    const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;

    setShop(shopParam);
    setHost(hostParam);

    if (!apiKey) {
      console.error("Missing NEXT_PUBLIC_SHOPIFY_API_KEY environment variable");
      return;
    }

    if (hostParam && shopParam) {
      setReady(true);
      return;
    }

    // If host is missing but shop exists, redirect to OAuth
    if (!hostParam && shopParam) {
      const authUrl = `/api/auth?shop=${shopParam}`;
      if (window !== window.top) {
        window.top.location.href = authUrl;
      } else {
        window.location.href = authUrl;
      }
    }
  }, [router.isReady, router.query]);

  if (!ready) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <BlockStack align="center">
              <Spinner size="large" />
              {(!shop || !host) && (
                <Card>
                  <BlockStack gap="200">
                    <Text as="p" variant="bodyMd" alignment="center">
                      Waiting for Shopify Admin parameters...
                    </Text>
                    <Text as="p" variant="bodyMd" alignment="center">
                      Make sure you opened this app from the Shopify Admin dashboard.
                    </Text>
                  </BlockStack>
                </Card>
              )}
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return <>{children}</>;
}

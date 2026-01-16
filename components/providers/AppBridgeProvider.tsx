import { Layout, Page, Spinner, BlockStack } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function AppBridgeProvider({ children }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const host = router.query?.host;
    const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;

    if (host && apiKey) {
      // Initialize shopify global with the app bridge
      if (window.shopify) {
        setIsReady(true);
      } else {
        // Wait for the script to load
        const checkShopify = setInterval(() => {
          if (window.shopify) {
            clearInterval(checkShopify);
            setIsReady(true);
          }
        }, 100);

        return () => clearInterval(checkShopify);
      }
    }
  }, [router.query]);

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
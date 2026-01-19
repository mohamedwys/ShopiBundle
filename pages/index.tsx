import { Page, Layout, Card, Text, Button, Spinner, BlockStack, InlineStack } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useAppBridge } from "@/components/providers/AppBridgeProvider";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import { useRouter } from "next/router";

interface Bundle {
  id: string;
  name: string;
  discount: string;
}

interface BundlesApiResponse {
  shop: string;
  bundles: any;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { app } = useAppBridge();
  const router = useRouter();
  const shop = router.query.shop as string;

  const fetchBundles = async () => {
    setLoading(true);
    setError(null);
    
    if (!app || !shop) {
      setError("App not initialized properly");
      setLoading(false);
      return;
    }

    try {
      // Get session token from App Bridge
      const token = await getSessionToken(app);
      
      const response = await fetch("/api/getBundles", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          after: true, 
          cursor: null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        
        // If it's an auth error, provide clear instructions
        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expired. Please reinstall the app from your Shopify admin.");
        }
        
        throw new Error(errorData.error || errorData.message || "Failed to load bundles");
      }

      const data: BundlesApiResponse = await response.json();
      
      console.log('Bundles data:', data);
      
      // Extract bundles from the response
      const bundlesData = Array.isArray(data.bundles?.edges) 
        ? data.bundles.edges.map((edge: any) => ({
            id: edge.node.id,
            name: edge.node.fields.find((f: any) => f.key === "name")?.value || "Unnamed Bundle",
            discount: edge.node.fields.find((f: any) => f.key === "discount")?.value || "0%",
          }))
        : [];
      setBundles(bundlesData);
    } catch (err: any) {
      console.error("Error fetching bundles:", err);
      setError(err?.message || "Failed to load bundles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (app && shop) {
      fetchBundles();
    }
  }, [app, shop]);

  if (loading) {
    return (
      <Page title="Bundles">
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spinner size="large" />
                <Text as="p" variant="bodyMd">Loading bundles...</Text>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Bundles">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Error
                </Text>
                <Text as="p" variant="bodyMd">
                  {error}
                </Text>
                <InlineStack align="start" gap="200">
                  <Button onClick={fetchBundles}>Retry</Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Bundles">
      <Layout>
        <Layout.Section>
          {bundles.length === 0 ? (
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  No Bundles Found
                </Text>
                <Text as="p" variant="bodyMd">
                  You haven't created any bundles yet.
                </Text>
              </BlockStack>
            </Card>
          ) : (
            <BlockStack gap="400">
              {bundles.map((bundle) => (
                <Card key={bundle.id}>
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">
                      {bundle.name}
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Discount: {bundle.discount}
                    </Text>
                  </BlockStack>
                </Card>
              ))}
            </BlockStack>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
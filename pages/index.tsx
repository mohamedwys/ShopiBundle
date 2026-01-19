import { Page, Layout, Card, Text, Button, Spinner, BlockStack, InlineStack } from "@shopify/polaris";
import { useEffect, useState } from "react";

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

  const fetchBundles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/getBundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ after: null, cursor: null }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || errorData.message || "Failed to load bundles");
      }

      const data: BundlesApiResponse = await response.json();
      
      // Extract bundles from the response (adjust based on your actual data structure)
      const bundlesData = Array.isArray(data.bundles) ? data.bundles : [];
      setBundles(bundlesData);
    } catch (err: any) {
      console.error("Error fetching bundles:", err);
      setError(err?.message || "Failed to load bundles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  if (loading) {
    return (
      <Page title="Bundles">
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spinner size="large" />
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
                <InlineStack align="start">
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

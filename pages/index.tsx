import { Page, Layout, Card, Text, Button, Spinner, BlockStack, InlineStack } from "@shopify/polaris";
import { useEffect, useState } from "react";

interface Bundle {
  id: string;
  name: string;
  discount: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchBundles = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/getBundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ after: null, cursor: null }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data: Bundle[] = await response.json();
      setBundles(data);
    } catch (err: any) {
      console.error("Error fetching bundles:", err);
      setError(err.message || "Failed to load bundles");
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
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spinner size="large" />
            </div>
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
              <BlockStack>
                <Text as="p" variant="headingMd">
                  Error
                </Text>
                <Text as="p" variant="bodyMd">
                  {error}
                </Text>
                <Button onClick={fetchBundles}>Retry</Button>
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
        {bundles.map((bundle) => (
          <Layout.Section key={bundle.id}>
            <Card>
              <BlockStack>
                <Text as="p" variant="headingMd">
                  {bundle.name}
                </Text>
                <Text as="p" variant="bodyMd">
                  Discount: {bundle.discount}
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        ))}
      </Layout>
    </Page>
  );
}

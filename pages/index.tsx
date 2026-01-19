import { Page, Layout, Card, Spinner, Text, Button } from "@shopify/polaris";
import { useEffect, useState } from "react";

interface Bundle {
  id: string;
  name: string;
  discount: string;
  minPrice: string;
  maxPrice: string;
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

      if (response.status === 403) {
        setError(
          "No active session found. Please reload the app from Shopify Admin."
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      const bundlesData = typeof data === "string" ? JSON.parse(data) : data;

      setBundles(bundlesData);
    } catch (err) {
      console.error("Error fetching bundles:", err);
      setError("Failed to fetch bundles. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  if (loading) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "20px",
                }}
              >
                <Spinner size="large" />
                <Text as="p" variant="bodyMd">
                  Loading bundles...
                </Text>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ padding: "20px" }}>
                <Text as="p" variant="headingMd">
                  {error}
                </Text>
                <div style={{ marginTop: "10px" }}>
                  <Button onClick={fetchBundles} variant="primary">
                    Retry
                  </Button>
                </div>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Bundles">
      <Layout>
        {bundles.length === 0 ? (
          <Layout.Section>
            <Card>
              <div style={{ padding: "20px" }}>
                <Text as="p">No bundles found. Create your first bundle!</Text>
              </div>
            </Card>
          </Layout.Section>
        ) : (
          bundles.map((bundle) => (
            <Layout.Section key={bundle.id}>
              <Card>
                <div style={{ padding: "20px" }}>
                  <Text as="p" variant="headingMd">
                    {bundle.name}
                  </Text>
                  <Text as="p">Discount: {bundle.discount}</Text>
                  <Text as="p">
                    Price range: {bundle.minPrice} – {bundle.maxPrice}
                  </Text>
                </div>
              </Card>
            </Layout.Section>
          ))
        )}
      </Layout>
    </Page>
  );
}

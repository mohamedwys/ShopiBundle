import { Page, Layout, Card, Text, Button, Spinner, BlockStack, InlineStack } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useAppBridge } from "@/components/providers/AppBridgeProvider";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import { Redirect } from "@shopify/app-bridge/actions";

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
  const { app, error: appBridgeError, isReady } = useAppBridge();

  const handleAuthError = () => {
    const shop = new URLSearchParams(window.location.search).get('shop');
    if (shop) {
      // Redirect to auth
      window.location.href = `/api?shop=${shop}`;
    } else if (app) {
      // Try using App Bridge redirect
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.REMOTE, {
        url: `/api?shop=${shop}`,
        newContext: false,
      });
    }
  };

  const fetchBundles = async () => {
    setLoading(true);
    setError(null);

    if (!app) {
      setError("App Bridge not initialized. Please wait or reinstall the app.");
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching session token from App Bridge...');
      // Get session token from App Bridge
      const token = await getSessionToken(app);
      console.log('✓ Session token obtained');

      console.log('Fetching bundles from API...');
      const response = await fetch("/api/getBundles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ after: true, cursor: null }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error('API error:', errorData);

        // If it's an auth error, redirect to auth
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication error - redirecting to auth flow');
          handleAuthError();
          return;
        }

        throw new Error(errorData.error || errorData.message || "Failed to load bundles");
      }

      const data: BundlesApiResponse = await response.json();
      console.log('✓ Bundles fetched successfully:', data);

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
    // Wait for App Bridge to be ready
    if (!isReady) {
      return;
    }

    // If there's an App Bridge error, show it
    if (appBridgeError) {
      setError(appBridgeError);
      setLoading(false);
      return;
    }

    // If App Bridge is ready and no error, try fetching bundles
    if (app) {
      fetchBundles();
    } else {
      // App Bridge should have initialized by now
      setError("App Bridge failed to initialize. Please check the browser console for details.");
      setLoading(false);
    }
  }, [app, appBridgeError, isReady]);

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
                <InlineStack align="start" gap="200">
                  <Button onClick={fetchBundles}>Retry</Button>
                  <Button onClick={handleAuthError}>Reinstall App</Button>
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
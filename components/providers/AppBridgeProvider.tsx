import { Page, Layout, Spinner } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface AppBridgeProviderProps {
  children: React.ReactNode;
}

const AppBridgeProvider: React.FC<AppBridgeProviderProps> = ({ children }) => {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const host = router.query.host as string;
    const shop = router.query.shop as string;
    const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;

    if (!apiKey) {
      setError("Missing NEXT_PUBLIC_SHOPIFY_API_KEY");
      return;
    }

    if (!host || !shop) {
      setError("Missing 'host' or 'shop' query parameter. Access via Shopify Admin.");
      return;
    }

    // Initialize App Bridge script loaded on page
    if ((window as any).shopify) {
      setReady(true);
    } else {
      const interval = setInterval(() => {
        if ((window as any).shopify) {
          clearInterval(interval);
          setReady(true);
        }
      }, 100);
      setTimeout(() => clearInterval(interval), 5000); // stop after 5s
    }
  }, [router.isReady, router.query]);

  if (error) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <div style={{ padding: 20 }}>
              <h2 style={{ color: "#bf0711" }}>App Initialization Error</h2>
              <p>{error}</p>
              <button
                style={{ marginTop: 10 }}
                onClick={() => router.reload()}
              >
                Reload App
              </button>
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (!ready) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 50,
              }}
            >
              <Spinner size="large" />
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return <>{children}</>;
};

export default AppBridgeProvider;

import { Page, Layout, Button } from "@shopify/polaris";
import { useAppBridge } from "@/components/providers/AppBridgeProvider";
import { Redirect } from "@shopify/app-bridge/actions";
import ProductsTable from "@/components/ProductsTable";
import AnalyticsTable from "@/components/AnalyticsTable";
import { useI18n } from "@shopify/react-i18n";

export default function HomePage() {
  const { app, error: appBridgeError, isReady } = useAppBridge();
  const [i18n] = useI18n();

  // Create redirect action when app is ready
  const handleRedirect = (path: string) => {
    if (app) {
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, path);
    }
  };

  // If App Bridge isn't ready yet, show a loading state
  if (!isReady) {
    return (
      <Page title={i18n.translate("index.title")}>
        <Layout>
          <Layout.Section>
            {/* Loading state - components will show their own loading states */}
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  // If there's an App Bridge error, show it
  if (appBridgeError) {
    return (
      <Page title={i18n.translate("index.title")}>
        <Layout>
          <Layout.Section>
            <p>Error initializing app: {appBridgeError}</p>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page
      title={i18n.translate("index.title")}
      secondaryActions={
        <Button
          onClick={() => handleRedirect("/auto_bundle")}
        >
          {i18n.translate("buttons.auto_bundle")}
        </Button>
      }
      primaryAction={{
        content: i18n.translate("buttons.create_bundle"),
        onAction: () => handleRedirect("/create_bundle"),
      }}
    >
      <Layout>
        <Layout.Section>
          <ProductsTable />
          <AnalyticsTable />
        </Layout.Section>
      </Layout>
    </Page>
  );
}

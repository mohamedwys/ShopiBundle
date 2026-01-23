import { Page, Layout, BlockStack } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useRouter } from "next/router";
import AIFBTConfig from "@/components/AIFBTConfig";
import AIBundlesTable from "@/components/AIBundlesTable";
import AIBundleAnalytics from "@/components/AIBundleAnalytics";
import { useState, useCallback } from "react";

export default function AIBundlesPage() {
  const app = useAppBridge();
  const router = useRouter();
  const shop = (router.query?.shop as string) || "";
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerate = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <Page
      title="AI-Powered Bundles"
      subtitle="Frequently Bought Together recommendations powered by machine learning"
      backAction={{ content: "Home", url: "/" }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <AIFBTConfig shop={shop} onGenerate={handleGenerate} />
            <AIBundlesTable shop={shop} key={refreshKey} />
            <AIBundleAnalytics shop={shop} />
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

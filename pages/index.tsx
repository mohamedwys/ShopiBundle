import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useRouter } from "next/router";
import { Button, Layout, Page, BlockStack } from "@shopify/polaris";
import ProductsTable from "@/components/ProductsTable";
import AnalyticsTable from "@/components/AnalyticsTable";
import { useI18n } from "@shopify/react-i18n";

const HomePage = () => {
  const router = useRouter();
  const [i18n] = useI18n();

  return (
    <Page
      title={i18n.translate("index.title")}
      secondaryActions={
        <Button
          onClick={() => {
            router.push("/auto_bundle");
          }}
        >
          {i18n.translate("buttons.auto_bundle")}
        </Button>
      }
      primaryAction={{
        content: `${i18n.translate("buttons.create_bundle")}`,
        onAction: () => {
          router.push("/create_bundle");
        },
      }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <ProductsTable />
            <AnalyticsTable />
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

//On first install, check if the store is installed and redirect accordingly
export async function getServerSideProps(context) {
  return await isShopAvailable(context);
}

export default HomePage;
import { Layout, Card, Page, BlockStack, Text, Button } from "@shopify/polaris";
import { useRouter } from "next/router";

const DebugIndex = () => {
  const router = useRouter();
  return (
    <Page
      title="Debug Cards"
      subtitle="Interact and explore the current installation"
      backAction={{ content: "Home", onAction: () => router.push("/") }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Webhooks
                </Text>
                <Text as="p">
                  Explore registered webhooks and endpoints.
                </Text>
              </BlockStack>
              <div style={{ paddingBottom: "1rem" }}>
                <Button
                  onClick={() => {
                    router.push("/debug/activeWebhooks");
                  }}
                >
                  Explore
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Data Fetching
                </Text>
                <Text as="p">
                  Run GET and POST requests to your server along with GraphQL
                  queries.
                </Text>
              </BlockStack>
              <div style={{ paddingBottom: "1rem" }}>
                <Button
                  onClick={() => {
                    router.push("/debug/getData");
                  }}
                >
                  Explore
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Billing API
                </Text>
                <Text as="p">
                  Subscribe merchant to a plan and explore existing plans.
                </Text>
              </BlockStack>
              <div style={{ paddingBottom: "1rem" }}>
                <Button
                  onClick={() => {
                    router.push("/debug/billing");
                  }}
                >
                  Cha-Ching
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Dev Notes
                </Text>
                <Text as="p">
                  Notes for devs on expectations.
                </Text>
              </BlockStack>
              <div style={{ paddingBottom: "1rem" }}>
                <Button
                  onClick={() => {
                    router.push("/debug/devNotes");
                  }}
                >
                  Let's go
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default DebugIndex;
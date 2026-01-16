import useFetch from "@/components/hooks/useFetch";
import { DataTable, Card, Page, BlockStack, Text } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ActiveWebhooks = () => {
  const router = useRouter();
  const fetch = useFetch();

  const [rows, setRows] = useState([
    ["Loading", "I haven't implemented swr or react query yet."],
  ]);

  //MARK:- Replace this amazing fetch + state implementation with `swr` or `react-query`.
  async function fetchWebhooks() {
    const res = await fetch("/api/apps/debug/activeWebhooks");
    const data = await res.json();
    let rowData = [];
    Object.entries(data.body.data.webhookSubscriptions.edges).map(
      ([key, value]: [any, any]) => {
        const topic = value.node.topic;
        const callbackUrl = value.node.endpoint.callbackUrl;
        rowData.push([topic, callbackUrl]);
      }
    );
    setRows(rowData);
  }

  useEffect(() => {
    fetchWebhooks();
  }, []);

  return (
    <Page
      title="Webhooks"
      backAction={{ content: "Home", onAction: () => router.push("/debug") }}
    >
      <BlockStack gap="400">
        <Card padding="0">
          <DataTable
            columnContentTypes={["text", "text"]}
            headings={["Topic", "Callback Url"]}
            rows={rows}
          />
        </Card>

        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              Webhook URLs
            </Text>
            <Text as="p">
              Webhooks are registered when the app is installed, or when tokens
              are refetched by going through the authentication process. If your
              Callback URL isn't the same as your current URL (happens usually
              during dev when using ngrok), you need to go through the auth
              process again.
            </Text>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
};

export default ActiveWebhooks;
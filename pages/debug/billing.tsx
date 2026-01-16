import useFetch from "@/components/hooks/useFetch";
import { DataTable, Layout, Card, Page, BlockStack, Text } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BillingAPI = () => {
  const router = useRouter();
  const [responseData, setResponseData] = useState("");
  const fetch = useFetch();

  async function fetchContent() {
    setResponseData("loading...");
    const res = await fetch("/api/apps/debug/createNewSubscription");
    const data = await res.json();
    if (data.error) {
      setResponseData(data.error);
    } else if (data.confirmationUrl) {
      setResponseData("Redirecting");
      const { confirmationUrl } = data;
      // Use window.open or window.location for external redirect
      window.open(confirmationUrl, '_top');
    }
  }

  return (
    <Page
      title="Billing API"
      backAction={{ content: "Home", onAction: () => router.push("/debug") }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="p">
                Subscribe your merchant to a test $10.25 plan and redirect to your
                home page.
              </Text>

              {responseData && <Text as="p">{responseData}</Text>}

              <div>
                <button
                  onClick={() => {
                    fetchContent();
                  }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#008060",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Subscribe merchant
                </button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <ActiveSubscriptions />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

const ActiveSubscriptions = () => {
  const fetch = useFetch();
  const [rows, setRows] = useState([]);

  async function getActiveSubscriptions() {
    const res = await fetch("/api/apps/debug/getActiveSubscriptions");
    const data = await res.json();

    //MARK:- Replace this yet another amazing implementation with swr or react-query
    let rowsData = [];
    const activeSubscriptions =
      data.body.data.appInstallation.activeSubscriptions;

    if (activeSubscriptions.length === 0) {
      rowsData.push(["No Plan", "N/A", "N/A", "USD 0.00"]);
    } else {
      console.log("Rendering Data");
      Object.entries(activeSubscriptions).map(([key, value]: [any, any]) => {
        const { name, status, test } = value;
        const { amount, currencyCode } =
          value.lineItems[0].plan.pricingDetails.price;
        rowsData.push([name, status, `${test}`, `${currencyCode} ${amount}`]);
      });
    }
    setRows(rowsData);
  }
  
  useEffect(() => {
    getActiveSubscriptions();
  }, []);

  return (
    <Card>
      <BlockStack gap="400">
        <div style={{ padding: "1rem 1rem 0" }}>
          <Text as="h2" variant="headingMd">
            Active Subscriptions
          </Text>
        </div>
        <DataTable
          columnContentTypes={["text", "text", "text", "text"]}
          headings={["Plan Name", "Status", "Test", "Amount"]}
          rows={rows}
        />
      </BlockStack>
    </Card>
  );
};

export default BillingAPI;
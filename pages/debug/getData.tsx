import useFetch from "@/components/hooks/useFetch";
import { Layout, Card, Link, Page, BlockStack, Text, Button } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const GetData = () => {
  const router = useRouter();
  const [responseData, setResponseData] = useState("");
  const [responseDataPost, setResponseDataPost] = useState("");
  const [responseDataGQL, setResponseDataGQL] = useState("");
  const fetch = useFetch();

  async function fetchContent() {
    setResponseData("loading...");
    const res = await fetch("/api/apps"); //fetch instance of useFetch()
    const { text } = await res.json();
    setResponseData(text);
  }
  
  async function fetchContentPost() {
    setResponseDataPost("loading...");
    const postBody = JSON.stringify({ content: "Body of POST request" });
    const res = await fetch("/api/apps", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: postBody,
    }); //fetch instance of useFetch()

    const { content } = await res.json();
    setResponseDataPost(content);
  }

  async function fetchContentGQL() {
    setResponseDataGQL("loading...");
    const res = await fetch("/api/apps/debug/gql"); //fetch instance of useFetch()
    const response = await res.json();
    setResponseDataGQL(response.body.data.shop.name);
  }

  useEffect(() => {
    fetchContent();
    fetchContentPost();
    fetchContentGQL();
  }, []);

  return (
    <Page
      title="Data Fetching"
      backAction={{ content: "Home", onAction: () => router.push("/debug") }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="p">
                GET <code>"/apps/api"</code>: {responseData}
              </Text>
              <div style={{ paddingBottom: "1rem" }}>
                <Button
                  onClick={() => {
                    fetchContent();
                  }}
                >
                  Refetch
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
        
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="p">
                POST <code>"/apps/api" </code>: {responseDataPost}
              </Text>
              <div style={{ paddingBottom: "1rem" }}>
                <Button
                  onClick={() => {
                    fetchContentPost();
                  }}
                >
                  Refetch
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
        
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="p">
                GET <code>"/apps/api/debug/gql"</code>: {responseDataGQL}
              </Text>
              <div style={{ paddingBottom: "1rem" }}>
                <Button
                  onClick={() => {
                    fetchContentGQL();
                  }}
                >
                  Refetch
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <div style={{ padding: "1rem 1rem 0" }}>
                <Text as="h2" variant="headingMd">
                  Developer Notes
                </Text>
              </div>

              <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                <Text as="h3" variant="headingSm">
                  Making Requests
                </Text>
                <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                  <li>
                    Create a new route in <code>pages/api/apps</code> and export it
                    with{" "}
                    <code>
                      export default withMiddleware("verifyRequest")(function-name)
                    </code>
                    .
                  </li>
                  <li>
                    Create a new instance of <code>useFetch()</code> and use that to
                    make a request to <code>/api/apps/your-route/goes-here/</code>
                  </li>
                  <li>
                    [Optional] Use a library like{" "}
                    <Link
                      url="https://tanstack.com/query/latest"
                      external
                    >
                      <code>@tanstack/react-query</code>
                    </Link>{" "}
                    or{" "}
                    <Link
                      url="https://swr.vercel.app"
                      external
                    >
                      <code>swr</code>
                    </Link>{" "}
                    for client side data fetching state management.
                  </li>
                </ul>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default GetData;
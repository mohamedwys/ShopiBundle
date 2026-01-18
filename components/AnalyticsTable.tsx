import { useState, useEffect } from "react";
import useFetch from "./hooks/useFetch";
import { DataTable, Card, Spinner, BlockStack, Text } from "@shopify/polaris";
import { useI18n } from "@shopify/react-i18n";

export default function AnalyticsTable() {
  const fetch = useFetch();
  const [i18n] = useI18n();

  const [gettingData, setGettingData] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [rows, setRows] = useState([]);

  async function getData() {
    setGettingData(true);
    try {
      const response = await fetch("/api/getAnalyticsData", {
        method: "POST",
      });

      // Check if fetch returned null (reauthorization needed)
      if (!response) {
        console.log('Fetch returned null, redirecting to auth');
        setGettingData(false);
        return;
      }

      let data = JSON.parse(await response.json());

      let sales = 0;
      setRows(
        data.map((bundleData) => {
          sales += bundleData.sales;
          return [
            bundleData.bundleName,
            new Date(bundleData.createdAt).toDateString(),
            bundleData.summary,
            bundleData.sales,
          ];
        })
      );
      setTotalSales(sales);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setGettingData(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // when getting data showing spinner
  if (gettingData) {
    return (
      <div
        style={{
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }

  // if there is no data after loading then return none
  if (rows.length === 0) {
    return null;
  }

  return (
    <BlockStack gap="400">
      <Card>
        <BlockStack gap="200">
          <Text as="h2" variant="headingMd">
            {i18n.translate("index.analytics.total_sales")}
          </Text>
          <Text as="h1" variant="heading2xl">
            {totalSales}
          </Text>
        </BlockStack>
      </Card>
      <Card padding="0">
        <DataTable
          columnContentTypes={["text", "text", "text", "numeric"]}
          headings={[
            `${i18n.translate("index.analytics.table.name")}`,
            `${i18n.translate("index.analytics.table.created")}`,
            `${i18n.translate("index.analytics.table.summary")}`,
            `${i18n.translate("index.analytics.table.sales")}`,
          ]}
          rows={rows}
        />
      </Card>
    </BlockStack>
  );
}
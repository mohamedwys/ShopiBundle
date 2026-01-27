import {
  Card,
  DataTable,
  Spinner,
  TextField,
  Button,
  BlockStack,
  InlineStack,
  Text,
  Grid,
  Box,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import useFetch from "@/components/hooks/useFetch";

export default function EnhancedAnalyticsTable() {
  const fetch = useFetch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function loadAnalytics() {
    setLoading(true);
    try {
      const response = await fetch("/api/getEnhancedAnalytics", {
        method: "POST",
        body: JSON.stringify({
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      });

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "10rem",
        }}
      >
        <Spinner size="large" />
      </div>
    );
  }

  const rows = data.bundles.map((bundle: any) => [
    bundle.bundleName,
    new Date(bundle.createdAt).toLocaleDateString(),
    bundle.summary,
    bundle.sales.toString(),
    `$${bundle.revenue}`,
    `$${bundle.averageOrderValue}`,
    `${bundle.conversionRate}%`,
  ]);

  return (
    <BlockStack gap="400">
      {/* Summary Cards */}
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm" fontWeight="medium">
                Total Revenue
              </Text>
              <Text as="p" variant="headingLg" fontWeight="bold">
                ${data.summary.totalRevenue}
              </Text>
            </BlockStack>
          </Card>
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm" fontWeight="medium">
                Total Orders
              </Text>
              <Text as="p" variant="headingLg" fontWeight="bold">
                {data.summary.totalOrders}
              </Text>
            </BlockStack>
          </Card>
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm" fontWeight="medium">
                Avg Order Value
              </Text>
              <Text as="p" variant="headingLg" fontWeight="bold">
                ${data.summary.averageOrderValue}
              </Text>
            </BlockStack>
          </Card>
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm" fontWeight="medium">
                Active Bundles
              </Text>
              <Text as="p" variant="headingLg" fontWeight="bold">
                {data.summary.totalBundles}
              </Text>
            </BlockStack>
          </Card>
        </Grid.Cell>
      </Grid>

      {/* Date Filter */}
      <Card>
        <BlockStack gap="400">
          <Text as="h3" variant="headingMd" fontWeight="semibold">
            Filter by Date Range
          </Text>
          <InlineStack gap="400" wrap={false}>
            <Box width="200px">
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={setStartDate}
                autoComplete="off"
              />
            </Box>
            <Box width="200px">
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={setEndDate}
                autoComplete="off"
              />
            </Box>
            <Button onClick={loadAnalytics}>Apply Filter</Button>
            <Button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setTimeout(loadAnalytics, 100);
              }}
            >
              Clear
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>

      {/* Detailed Table */}
      <Card>
        <BlockStack gap="400">
          <Text as="h3" variant="headingMd" fontWeight="semibold">
            Bundle Performance Details
          </Text>
          <DataTable
            columnContentTypes={[
              "text",
              "text",
              "text",
              "numeric",
              "numeric",
              "numeric",
              "numeric",
            ]}
            headings={[
              "Bundle Name",
              "Created",
              "Description",
              "Sales",
              "Revenue",
              "Avg Order Value",
              "Conversion Rate",
            ]}
            rows={rows}
            footerContent={`Showing ${data.bundles.length} bundle(s)`}
          />
        </BlockStack>
      </Card>

      {/* Export Options */}
      <Card>
        <InlineStack gap="200">
          <Button
            onClick={() => {
              // Export as CSV
              const csv = [
                ["Bundle Name", "Created", "Description", "Sales", "Revenue", "Avg Order Value", "Conversion Rate"],
                ...rows,
              ]
                .map((row) => row.join(","))
                .join("\n");

              const blob = new Blob([csv], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `bundle-analytics-${new Date().toISOString()}.csv`;
              a.click();
            }}
          >
            Export CSV
          </Button>
          <Button
            onClick={() => {
              // Export as JSON
              const json = JSON.stringify(data, null, 2);
              const blob = new Blob([json], { type: "application/json" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `bundle-analytics-${new Date().toISOString()}.json`;
              a.click();
            }}
          >
            Export JSON
          </Button>
        </InlineStack>
      </Card>
    </BlockStack>
  );
}

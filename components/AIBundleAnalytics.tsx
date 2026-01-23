import { useState, useCallback, useEffect } from "react";
import {
  Card,
  IndexTable,
  Text,
  Badge,
  Box,
  BlockStack,
} from "@shopify/polaris";
import type { IndexTableHeading } from "@shopify/polaris";
import useFetch from "@/hooks/useFetch";

interface VariantAnalytics {
  variantGroupId: string;
  impressions: number;
  clicks: number;
  addToCarts: number;
  purchases: number;
  ctr: number;
  conversionRate: number;
}

interface AIBundleAnalyticsProps {
  shop: string;
  productId?: string;
}

export default function AIBundleAnalytics({ shop, productId }: AIBundleAnalyticsProps) {
  const fetch = useFetch();
  const [analytics, setAnalytics] = useState<VariantAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ shop });
      if (productId) params.append("productId", productId);

      const response = await fetch(`/api/ai/ab/analytics?${params.toString()}`);
      const data = await response.json();
      setAnalytics(data.analytics || []);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [shop, productId, fetch]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const resourceName = {
    singular: "variant",
    plural: "variants",
  };

  const headings: IndexTableHeading[] = [
    { title: "Variant ID" },
    { title: "Impressions" },
    { title: "Clicks" },
    { title: "Add to Cart" },
    { title: "Purchases" },
    { title: "CTR" },
    { title: "Conversion" },
  ];

  const rowMarkup = analytics.map((variant, index) => (
    <IndexTable.Row id={variant.variantGroupId} key={variant.variantGroupId} position={index}>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span" fontWeight="semibold">
          {variant.variantGroupId}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {variant.impressions}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {variant.clicks}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {variant.addToCarts}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {variant.purchases}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={variant.ctr > 0.1 ? "success" : "attention"}>
          {(variant.ctr * 100).toFixed(2)}%
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={variant.conversionRate > 0.05 ? "success" : "attention"}>
          {(variant.conversionRate * 100).toFixed(2)}%
        </Badge>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Card padding="0">
      <BlockStack gap="400">
        <Box padding="400">
          <Text variant="headingMd" as="h2">
            A/B Test Analytics
          </Text>
        </Box>
        <IndexTable
          resourceName={resourceName}
          itemCount={analytics.length}
          headings={headings}
          selectable={false}
          loading={loading}
        >
          {rowMarkup}
        </IndexTable>
      </BlockStack>
    </Card>
  );
}

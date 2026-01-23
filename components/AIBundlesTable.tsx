import { useState, useCallback, useEffect } from "react";
import {
  IndexTable,
  Card,
  Badge,
  Button,
  ButtonGroup,
  Text,
  Box,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";
import type { IndexTableHeading } from "@shopify/polaris";
import useFetch from "@/hooks/useFetch";

interface AIBundle {
  id: string;
  productId: string;
  bundledProductIds: string[];
  confidenceScore: number;
  support: number;
  lift: number;
  generatedAt: string;
  isActive: boolean;
  isManualOverride: boolean;
  variantGroupId: string | null;
}

interface AIBundlesTableProps {
  shop: string;
  productId?: string;
}

export default function AIBundlesTable({ shop, productId }: AIBundlesTableProps) {
  const fetch = useFetch();
  const [bundles, setBundles] = useState<AIBundle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBundles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ shop });
      if (productId) params.append("productId", productId);

      const response = await fetch(`/api/ai/fbt/list?${params.toString()}`);
      const data = await response.json();
      setBundles(data.bundles || []);
    } catch (error) {
      console.error("Failed to load AI bundles:", error);
    } finally {
      setLoading(false);
    }
  }, [shop, productId, fetch]);

  useEffect(() => {
    loadBundles();
  }, [loadBundles]);

  const handleAction = useCallback(
    async (bundleId: string, action: string) => {
      try {
        await fetch("/api/ai/fbt/override", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bundleId, action, shop }),
        });
        await loadBundles();
      } catch (error) {
        console.error("Failed to perform action:", error);
      }
    },
    [shop, fetch, loadBundles]
  );

  const resourceName = {
    singular: "AI bundle",
    plural: "AI bundles",
  };

  const headings: IndexTableHeading[] = [
    { title: "Product ID" },
    { title: "Bundled Products" },
    { title: "Confidence" },
    { title: "Support" },
    { title: "Lift" },
    { title: "Status" },
    { title: "Actions" },
  ];

  const rowMarkup = bundles.map((bundle, index) => (
    <IndexTable.Row id={bundle.id} key={bundle.id} position={index}>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span" fontWeight="semibold">
          {bundle.productId}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {bundle.bundledProductIds.length} products
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={bundle.confidenceScore > 0.5 ? "success" : "attention"}>
          {(bundle.confidenceScore * 100).toFixed(1)}%
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {(bundle.support * 100).toFixed(2)}%
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {bundle.lift.toFixed(2)}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="200">
          <Badge tone={bundle.isActive ? "success" : "critical"}>
            {bundle.isActive ? "Active" : "Inactive"}
          </Badge>
          {bundle.isManualOverride && (
            <Badge tone="info">Locked</Badge>
          )}
        </InlineStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          {!bundle.isActive && (
            <Button
              size="slim"
              onClick={() => handleAction(bundle.id, "accept")}
            >
              Accept
            </Button>
          )}
          {bundle.isActive && (
            <Button
              size="slim"
              tone="critical"
              onClick={() => handleAction(bundle.id, "reject")}
            >
              Reject
            </Button>
          )}
          {!bundle.isManualOverride && (
            <Button
              size="slim"
              onClick={() => handleAction(bundle.id, "lock")}
            >
              Lock
            </Button>
          )}
          {bundle.isManualOverride && (
            <Button
              size="slim"
              onClick={() => handleAction(bundle.id, "unlock")}
            >
              Unlock
            </Button>
          )}
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Card padding="0">
      <IndexTable
        resourceName={resourceName}
        itemCount={bundles.length}
        headings={headings}
        selectable={false}
        loading={loading}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}

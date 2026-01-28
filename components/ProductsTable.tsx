import {
  IndexTable,
  Card,
  useIndexResourceState,
  Text,
  Pagination,
  Button,
  BlockStack,
  InlineStack,
  Spinner,
  Badge,
  EmptyState,
  Banner,
  ButtonGroup,
} from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useI18n } from "@shopify/react-i18n";
import { useAppBridge } from "./providers/AppBridgeProvider";
import { useBundleAPI } from "./hooks/useBundleAPI";
import { Bundle, BundleStatus, ListBundlesParams } from "@/types/v2-api.types";

// Status badge color mapping
const STATUS_BADGE_TONE: Record<BundleStatus, 'success' | 'info' | 'warning' | 'critical' | undefined> = {
  DRAFT: undefined,
  ACTIVE: 'success',
  SCHEDULED: 'info',
  PAUSED: 'warning',
  ARCHIVED: 'critical',
};

export default function ProductsTable() {
  const router = useRouter();
  const [i18n] = useI18n();
  const { isReady, error: appBridgeError } = useAppBridge();

  // Use V2 Bundle API hook
  const {
    loading,
    error,
    listBundles,
    deleteBundle: deleteBundleAPI,
    publishBundle: publishBundleAPI,
    unpublishBundle: unpublishBundleAPI,
    clearError,
  } = useBundleAPI();

  // Local state
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BundleStatus | undefined>(undefined);

  // Fetch bundles
  const fetchBundles = useCallback(async (page: number = 1, status?: BundleStatus) => {
    const params: ListBundlesParams = {
      page,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    if (status) {
      params.status = status;
    }

    const response = await listBundles(params);

    if (response?.success) {
      setBundles(response.data.bundles);
      setCurrentPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.totalPages);
      setHasNextPage(response.data.pagination.hasNext);
      setHasPreviousPage(response.data.pagination.hasPrev);
    }
  }, [listBundles]);

  // Delete selected bundles
  const handleDelete = async () => {
    if (selectedResources.length === 0) return;

    setDeleting(true);

    // Delete bundles one by one
    for (const id of selectedResources) {
      await deleteBundleAPI(id);
    }

    // Refresh the list
    await fetchBundles(currentPage, statusFilter);
    setDeleting(false);
  };

  // Publish a bundle
  const handlePublish = async (bundleId: string) => {
    setPublishing(bundleId);
    const result = await publishBundleAPI(bundleId);
    if (result) {
      // Update bundle in local state
      setBundles(prev => prev.map(b =>
        b.id === bundleId ? { ...b, status: 'ACTIVE' as BundleStatus, publishedAt: new Date().toISOString() } : b
      ));
    }
    setPublishing(null);
  };

  // Unpublish a bundle
  const handleUnpublish = async (bundleId: string) => {
    setPublishing(bundleId);
    const result = await unpublishBundleAPI(bundleId);
    if (result) {
      // Update bundle in local state
      setBundles(prev => prev.map(b =>
        b.id === bundleId ? { ...b, status: 'PAUSED' as BundleStatus } : b
      ));
    }
    setPublishing(null);
  };

  // Initial fetch when App Bridge is ready
  useEffect(() => {
    if (isReady && !appBridgeError) {
      fetchBundles(1, statusFilter);
    }
  }, [isReady, appBridgeError, fetchBundles, statusFilter]);

  const resourceName = {
    singular: i18n.translate("index.title"),
    plural: i18n.translate("index.title"),
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(bundles as any);

  // Navigate to edit page
  const navigateToEdit = (id: string) => {
    router.push(`/edit_bundle?id=${encodeURIComponent(id)}`);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Show loading while App Bridge initializes
  if (!isReady) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spinner size="large" />
        </div>
      </Card>
    );
  }

  // Show error if App Bridge failed
  if (appBridgeError) {
    return (
      <Card>
        <div style={{ padding: '20px' }}>
          <Text as="p" tone="critical">
            Error initializing app: {appBridgeError}
          </Text>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!loading && bundles.length === 0) {
    return (
      <Card>
        <EmptyState
          heading="Create your first bundle"
          action={{
            content: 'Create bundle',
            onAction: () => router.push('/create_bundle'),
          }}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>Bundle products together to offer discounts and increase sales.</p>
        </EmptyState>
      </Card>
    );
  }

  // Table row markup
  const rowMarkup = bundles.map((bundle, index) => (
    <IndexTable.Row
      id={bundle.id}
      key={bundle.id}
      selected={selectedResources.includes(bundle.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {bundle.name}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={STATUS_BADGE_TONE[bundle.status]}>
          {bundle.status}
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" numeric>
          {bundle.savingsPercentage}%
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <BlockStack gap="100">
          <Text as="span" tone="subdued">
            <s>{formatPrice(bundle.originalPrice)}</s>
          </Text>
          <Text as="span" fontWeight="semibold">
            {formatPrice(bundle.discountedPrice)}
          </Text>
        </BlockStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {bundle.components.length} items
      </IndexTable.Cell>
      <IndexTable.Cell>
        {new Date(bundle.createdAt).toLocaleDateString()}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          {bundle.status === 'DRAFT' || bundle.status === 'PAUSED' ? (
            <Button
              size="slim"
              onClick={() => handlePublish(bundle.id)}
              loading={publishing === bundle.id}
            >
              Publish
            </Button>
          ) : bundle.status === 'ACTIVE' ? (
            <Button
              size="slim"
              tone="critical"
              onClick={() => handleUnpublish(bundle.id)}
              loading={publishing === bundle.id}
            >
              Unpublish
            </Button>
          ) : null}
          <Button
            size="slim"
            onClick={() => navigateToEdit(bundle.id)}
            variant="plain"
          >
            Edit
          </Button>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <BlockStack gap="400">
      {error && (
        <Banner tone="critical" onDismiss={clearError}>
          {error}
        </Banner>
      )}

      <Card padding="0">
        <IndexTable
          resourceName={resourceName}
          itemCount={bundles.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          loading={loading}
          headings={[
            { title: 'Name' },
            { title: 'Status' },
            { title: 'Discount' },
            { title: 'Price' },
            { title: 'Products' },
            { title: 'Created' },
            { title: 'Actions' },
          ]}
          lastColumnSticky
        >
          {rowMarkup}
        </IndexTable>
      </Card>

      <InlineStack gap="400" align="space-between">
        <InlineStack gap="400" align="start">
          <Pagination
            hasPrevious={hasPreviousPage}
            onPrevious={() => fetchBundles(currentPage - 1, statusFilter)}
            hasNext={hasNextPage}
            onNext={() => fetchBundles(currentPage + 1, statusFilter)}
          />
          <Text as="span" tone="subdued">
            Page {currentPage} of {totalPages}
          </Text>
        </InlineStack>

        {selectedResources.length > 0 && (
          <Button onClick={handleDelete} tone="critical" loading={deleting}>
            Delete {selectedResources.length} selected
          </Button>
        )}
      </InlineStack>
    </BlockStack>
  );
}

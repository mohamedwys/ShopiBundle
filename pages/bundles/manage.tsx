/**
 * Enhanced Bundle Management Page - Phase 2
 *
 * Features:
 * - Create/Edit bundles with multiple discount types
 * - Add/remove/reorder products as components
 * - Set bundle pricing (fixed, percentage, amount off)
 * - Enable/disable bundles
 * - View inventory status
 */

import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useRouter } from "next/router";
import { ResourcePicker } from "@shopify/app-bridge/actions";
import { Product } from "@shopify/app-bridge/actions/ResourcePicker";
import { useAppBridge } from "@/components/providers/AppBridgeProvider";
import {
  Banner,
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  Text,
  TextField,
  Toast,
  Frame,
  BlockStack,
  InlineStack,
  Select,
  Badge,
  DataTable,
  Modal,
  Spinner,
  Divider,
  Box,
  Icon,
  Tooltip,
  ProgressBar,
} from "@shopify/polaris";
import {
  DeleteIcon,
  DragHandleIcon,
  PlusIcon,
  RefreshIcon,
} from "@shopify/polaris-icons";
import { useCallback, useState, useEffect } from "react";
import React from "react";
import { useBundleAPI } from "@/components/hooks/useBundleAPI";
import { useI18n } from "@shopify/react-i18n";
import { Bundle, CreateBundleInput, UpdateBundleInput, BundleStatus } from "@/types/v2-api.types";

// Discount type options
const DISCOUNT_TYPE_OPTIONS = [
  { label: "Percentage Off", value: "PERCENTAGE" },
  { label: "Fixed Amount Off", value: "FIXED_AMOUNT" },
  { label: "Fixed Bundle Price", value: "FIXED_PRICE" },
];

// Status badge color mapping
const STATUS_BADGE_TONE: Record<BundleStatus, 'success' | 'info' | 'warning' | 'critical' | undefined> = {
  DRAFT: undefined,
  ACTIVE: 'success',
  SCHEDULED: 'info',
  PAUSED: 'warning',
  ARCHIVED: 'critical',
};

// Inventory tracking options
const INVENTORY_TRACKING_OPTIONS = [
  { label: "Track by Component Inventory", value: "COMPONENT_BASED" },
  { label: "Track Bundle-Specific Inventory", value: "BUNDLE_SPECIFIC" },
  { label: "Don't Track Inventory", value: "UNLIMITED" },
];

interface BundleComponent {
  id?: string;
  shopifyProductId: string;
  shopifyVariantId?: string;
  title: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  inventory?: number;
}

const BundleManagePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = !!id;
  const [i18n] = useI18n();
  const { app } = useAppBridge();

  // API hook
  const {
    getBundle,
    createBundle,
    updateBundle,
    publishBundle,
    unpublishBundle,
    deleteBundle,
    loading: apiLoading,
    error: apiError,
    clearError,
  } = useBundleAPI();

  // Form state
  const [bundleName, setBundleName] = useState("");
  const [bundleTitle, setBundleTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("10");
  const [components, setComponents] = useState<BundleComponent[]>([]);
  const [inventoryTracking, setInventoryTracking] = useState("COMPONENT_BASED");
  const [bundleQuantity, setBundleQuantity] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");

  // Bundle state (for edit mode)
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  // UI state
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Toast state
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);

  const showToast = useCallback((message: string, isError = false) => {
    setToastMessage(message);
    setToastError(isError);
    setToastActive(true);
  }, []);

  // Load bundle data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadBundle(id as string);
    }
  }, [id, isEditMode]);

  async function loadBundle(bundleId: string) {
    setInitialLoading(true);
    try {
      const bundleData = await getBundle(bundleId);
      if (bundleData) {
        setBundle(bundleData);
        setBundleName(bundleData.name);
        setBundleTitle(bundleData.title);
        setDescription(bundleData.description || "");

        // Extract discount info from bundle
        setDiscountType("PERCENTAGE"); // Default, could be enhanced
        setDiscountValue(String(bundleData.savingsPercentage || 0));

        // Map components
        setComponents(
          bundleData.components.map((c) => ({
            id: c.id,
            shopifyProductId: c.shopifyProductId,
            shopifyVariantId: c.shopifyVariantId || undefined,
            title: c.cachedTitle || "Unknown Product",
            price: c.cachedPrice || 0,
            imageUrl: c.cachedImageUrl || undefined,
            quantity: c.quantity,
          }))
        );
      } else {
        showToast("Bundle not found", true);
        router.push("/");
      }
    } catch (e) {
      showToast("Failed to load bundle", true);
      router.push("/");
    } finally {
      setInitialLoading(false);
    }
  }

  // Calculate pricing
  const calculatePricing = useCallback(() => {
    const originalPrice = components.reduce(
      (sum, c) => sum + c.price * c.quantity,
      0
    );

    let discountAmount = 0;
    let finalPrice = originalPrice;

    const value = parseFloat(discountValue) || 0;

    switch (discountType) {
      case "PERCENTAGE":
        discountAmount = originalPrice * (value / 100);
        finalPrice = originalPrice - discountAmount;
        break;
      case "FIXED_AMOUNT":
        discountAmount = Math.min(value, originalPrice);
        finalPrice = originalPrice - discountAmount;
        break;
      case "FIXED_PRICE":
        finalPrice = value;
        discountAmount = originalPrice - value;
        break;
    }

    return {
      originalPrice,
      finalPrice: Math.max(0, finalPrice),
      savings: Math.max(0, discountAmount),
      savingsPercentage:
        originalPrice > 0
          ? Math.round((discountAmount / originalPrice) * 100)
          : 0,
    };
  }, [components, discountType, discountValue]);

  const pricing = calculatePricing();

  // Open product picker
  const openProductPicker = useCallback(() => {
    if (!app) {
      showToast("App Bridge not ready. Please refresh.", true);
      return;
    }

    try {
      const picker = ResourcePicker.create(app, {
        resourceType: ResourcePicker.ResourceType.Product,
        options: {
          selectMultiple: true,
          showVariants: true,
        },
      });

      picker.subscribe(ResourcePicker.Action.SELECT, (selectPayload) => {
        const selection = selectPayload.selection as Product[];
        if (selection && selection.length > 0) {
          const newComponents = selection.map((product) => ({
            shopifyProductId: product.id,
            shopifyVariantId: product.variants?.[0]?.id,
            title: product.title,
            price: parseFloat(product.variants?.[0]?.price || "0"),
            imageUrl: product.images?.[0]?.originalSrc,
            quantity: 1,
          }));

          setComponents((prev) => [...prev, ...newComponents]);
        }
      });

      picker.dispatch(ResourcePicker.Action.OPEN);
    } catch (err) {
      showToast("Failed to open product picker", true);
    }
  }, [app, showToast]);

  // Remove component
  const removeComponent = useCallback((index: number) => {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Update component quantity
  const updateQuantity = useCallback((index: number, quantity: number) => {
    setComponents((prev) =>
      prev.map((c, i) => (i === index ? { ...c, quantity: Math.max(1, quantity) } : c))
    );
  }, []);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Validate form
  const validateForm = (): string | null => {
    if (!bundleName.trim()) return "Bundle name is required";
    if (!bundleTitle.trim()) return "Bundle title is required";
    if (components.length < 2) return "Please add at least 2 products";

    const value = parseFloat(discountValue);
    if (isNaN(value) || value < 0) return "Invalid discount value";

    if (discountType === "PERCENTAGE" && value > 100) {
      return "Percentage discount cannot exceed 100%";
    }

    if (discountType === "FIXED_PRICE" && value > pricing.originalPrice) {
      return "Fixed price cannot be higher than original price";
    }

    return null;
  };

  // Save bundle
  async function handleSave() {
    const validationError = validateForm();
    if (validationError) {
      showToast(validationError, true);
      return;
    }

    setSaving(true);

    try {
      // For now, we use percentage discount in the API
      // The full discount type support would require API updates
      const discountPercent =
        discountType === "PERCENTAGE"
          ? parseFloat(discountValue)
          : pricing.savingsPercentage;

      if (isEditMode && id) {
        const input: UpdateBundleInput = {
          name: bundleName.trim(),
          title: bundleTitle.trim(),
          description: description.trim() || undefined,
          discountPercent,
        };

        const result = await updateBundle(id as string, input);
        if (result) {
          setBundle(result);
          showToast("Bundle updated successfully");
        } else {
          showToast(apiError || "Failed to update bundle", true);
        }
      } else {
        const input: CreateBundleInput = {
          name: bundleName.trim(),
          title: bundleTitle.trim(),
          description: description.trim() || undefined,
          discountPercent,
          components: components.map((c) => ({
            shopifyProductId: c.shopifyProductId,
            shopifyVariantId: c.shopifyVariantId,
            quantity: c.quantity,
          })),
        };

        const result = await createBundle(input);
        if (result) {
          showToast("Bundle created successfully");
          router.push(`/bundles/manage?id=${result.id}`);
        } else {
          showToast(apiError || "Failed to create bundle", true);
        }
      }
    } catch (e) {
      showToast("An error occurred", true);
    } finally {
      setSaving(false);
    }
  }

  // Publish/Unpublish
  async function handlePublishToggle() {
    if (!id || !bundle) return;

    setPublishing(true);

    try {
      if (bundle.status === "ACTIVE") {
        const result = await unpublishBundle(id as string);
        if (result) {
          setBundle(result);
          showToast("Bundle unpublished");
        } else {
          showToast(apiError || "Failed to unpublish", true);
        }
      } else {
        const result = await publishBundle(id as string);
        if (result) {
          setBundle(result);
          showToast("Bundle published successfully");
        } else {
          showToast(apiError || "Failed to publish", true);
        }
      }
    } catch (e) {
      showToast("An error occurred", true);
    } finally {
      setPublishing(false);
    }
  }

  // Delete bundle
  async function handleDelete() {
    if (!id) return;

    setDeleting(true);

    try {
      const success = await deleteBundle(id as string);
      if (success) {
        showToast("Bundle deleted");
        router.push("/");
      } else {
        showToast(apiError || "Failed to delete bundle", true);
      }
    } catch (e) {
      showToast("An error occurred", true);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  // Build component table rows
  const componentTableRows = components.map((component, index) => [
    <InlineStack key={`name-${index}`} gap="200" wrap={false} blockAlign="center">
      {component.imageUrl && (
        <img
          src={component.imageUrl}
          alt={component.title}
          style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
        />
      )}
      <Text as="span" variant="bodyMd">
        {component.title}
      </Text>
    </InlineStack>,
    formatPrice(component.price),
    <TextField
      key={`qty-${index}`}
      label=""
      labelHidden
      type="number"
      value={String(component.quantity)}
      onChange={(value) => updateQuantity(index, parseInt(value) || 1)}
      min={1}
      autoComplete="off"
    />,
    formatPrice(component.price * component.quantity),
    <Button
      key={`remove-${index}`}
      icon={DeleteIcon}
      tone="critical"
      onClick={() => removeComponent(index)}
      accessibilityLabel="Remove product"
    />,
  ]);

  // Loading spinner
  if (initialLoading) {
    return (
      <Frame>
        <Page>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
            }}
          >
            <Spinner size="large" />
          </div>
        </Page>
      </Frame>
    );
  }

  return (
    <Frame>
      <Page
        title={isEditMode ? "Edit Bundle" : "Create Bundle"}
        titleMetadata={
          bundle && (
            <Badge tone={STATUS_BADGE_TONE[bundle.status]}>
              {bundle.status}
            </Badge>
          )
        }
        backAction={{ onAction: () => router.push("/") }}
        primaryAction={
          isEditMode && bundle
            ? {
                content: bundle.status === "ACTIVE" ? "Unpublish" : "Publish",
                onAction: handlePublishToggle,
                loading: publishing,
                destructive: bundle.status === "ACTIVE",
              }
            : undefined
        }
        secondaryActions={
          isEditMode
            ? [
                {
                  content: "Delete Bundle",
                  destructive: true,
                  onAction: () => setShowDeleteModal(true),
                },
              ]
            : undefined
        }
      >
        <Layout>
          {/* Main Form */}
          <Layout.Section>
            <Form onSubmit={handleSave}>
              <FormLayout>
                {apiError && (
                  <Banner tone="critical" onDismiss={clearError}>
                    {apiError}
                  </Banner>
                )}

                {/* Basic Info Card */}
                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">
                      Bundle Information
                    </Text>

                    <TextField
                      label="Internal Name"
                      value={bundleName}
                      onChange={setBundleName}
                      helpText="Used for internal reference (not shown to customers)"
                      autoComplete="off"
                    />

                    <TextField
                      label="Display Title"
                      value={bundleTitle}
                      onChange={setBundleTitle}
                      helpText="Shown to customers on the storefront"
                      autoComplete="off"
                    />

                    <TextField
                      label="Description"
                      value={description}
                      onChange={setDescription}
                      helpText="Describe the bundle value proposition"
                      multiline={3}
                      autoComplete="off"
                    />
                  </BlockStack>
                </Card>

                {/* Products Card */}
                <Card>
                  <BlockStack gap="400">
                    <InlineStack align="space-between">
                      <Text as="h2" variant="headingMd">
                        Bundle Products
                      </Text>
                      <Button icon={PlusIcon} onClick={openProductPicker}>
                        Add Products
                      </Button>
                    </InlineStack>

                    {components.length === 0 ? (
                      <Banner tone="warning">
                        Add at least 2 products to create a bundle.
                      </Banner>
                    ) : components.length === 1 ? (
                      <Banner tone="warning">
                        Add at least 1 more product. Bundles require 2+ products.
                      </Banner>
                    ) : (
                      <DataTable
                        columnContentTypes={["text", "numeric", "numeric", "numeric", "text"]}
                        headings={["Product", "Unit Price", "Quantity", "Line Total", ""]}
                        rows={componentTableRows}
                        footerContent={`${components.length} products in bundle`}
                      />
                    )}
                  </BlockStack>
                </Card>

                {/* Pricing Card */}
                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">
                      Bundle Pricing
                    </Text>

                    <InlineStack gap="400" wrap={false}>
                      <Box minWidth="200px">
                        <Select
                          label="Discount Type"
                          options={DISCOUNT_TYPE_OPTIONS}
                          value={discountType}
                          onChange={setDiscountType}
                        />
                      </Box>

                      <Box minWidth="150px">
                        <TextField
                          label={
                            discountType === "PERCENTAGE"
                              ? "Discount Percentage"
                              : discountType === "FIXED_AMOUNT"
                              ? "Amount Off"
                              : "Bundle Price"
                          }
                          value={discountValue}
                          onChange={setDiscountValue}
                          type="number"
                          prefix={discountType !== "PERCENTAGE" ? "$" : undefined}
                          suffix={discountType === "PERCENTAGE" ? "%" : undefined}
                          autoComplete="off"
                        />
                      </Box>
                    </InlineStack>

                    <Divider />

                    {/* Pricing Summary */}
                    <InlineStack gap="800" align="start">
                      <BlockStack gap="100">
                        <Text as="span" tone="subdued">
                          Original Price
                        </Text>
                        <Text as="span" variant="headingLg">
                          {formatPrice(pricing.originalPrice)}
                        </Text>
                      </BlockStack>

                      <BlockStack gap="100">
                        <Text as="span" tone="subdued">
                          Bundle Price
                        </Text>
                        <Text as="span" variant="headingLg" tone="success">
                          {formatPrice(pricing.finalPrice)}
                        </Text>
                      </BlockStack>

                      <BlockStack gap="100">
                        <Text as="span" tone="subdued">
                          Customer Saves
                        </Text>
                        <Text as="span" variant="headingLg" tone="success">
                          {formatPrice(pricing.savings)} ({pricing.savingsPercentage}%)
                        </Text>
                      </BlockStack>
                    </InlineStack>
                  </BlockStack>
                </Card>

                {/* Inventory Card */}
                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">
                      Inventory Settings
                    </Text>

                    <Select
                      label="Inventory Tracking"
                      options={INVENTORY_TRACKING_OPTIONS}
                      value={inventoryTracking}
                      onChange={setInventoryTracking}
                      helpText={
                        inventoryTracking === "COMPONENT_BASED"
                          ? "Bundle availability = minimum of all component inventories"
                          : inventoryTracking === "BUNDLE_SPECIFIC"
                          ? "Track bundle inventory independently from components"
                          : "Bundle is always available (no inventory tracking)"
                      }
                    />

                    {inventoryTracking === "BUNDLE_SPECIFIC" && (
                      <TextField
                        label="Bundle Inventory Quantity"
                        value={bundleQuantity}
                        onChange={setBundleQuantity}
                        type="number"
                        helpText="Number of bundles available for sale"
                        autoComplete="off"
                      />
                    )}

                    <TextField
                      label="Low Stock Threshold"
                      value={lowStockThreshold}
                      onChange={setLowStockThreshold}
                      type="number"
                      helpText="Show low stock warning when inventory falls below this number"
                      autoComplete="off"
                    />

                    {bundle?.inventory && (
                      <>
                        <Divider />
                        <BlockStack gap="200">
                          <InlineStack gap="200" align="space-between">
                            <Text as="span">Current Availability</Text>
                            <Badge
                              tone={
                                bundle.inventory.isOutOfStock
                                  ? "critical"
                                  : bundle.inventory.isLowStock
                                  ? "warning"
                                  : "success"
                              }
                            >
                              {bundle.inventory.isOutOfStock
                                ? "Out of Stock"
                                : bundle.inventory.isLowStock
                                ? "Low Stock"
                                : "In Stock"}
                            </Badge>
                          </InlineStack>
                          <Text as="span" variant="headingMd">
                            {bundle.inventory.available} bundles available
                          </Text>
                          {bundle.inventory.lastSynced && (
                            <Text as="span" tone="subdued">
                              Last synced: {new Date(bundle.inventory.lastSynced).toLocaleString()}
                            </Text>
                          )}
                        </BlockStack>
                      </>
                    )}
                  </BlockStack>
                </Card>

                {/* Save Button */}
                <InlineStack gap="400">
                  <Button
                    variant="primary"
                    size="large"
                    submit
                    loading={saving}
                    disabled={components.length < 2}
                  >
                    {isEditMode ? "Save Changes" : "Create Bundle"}
                  </Button>
                  <Button size="large" onClick={() => router.push("/")}>
                    Cancel
                  </Button>
                </InlineStack>
              </FormLayout>
            </Form>
          </Layout.Section>

          {/* Sidebar */}
          <Layout.Section variant="oneThird">
            {/* Preview Card */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Bundle Preview
                </Text>

                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                  }}
                >
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingLg">
                      {bundleTitle || "Bundle Title"}
                    </Text>

                    {components.slice(0, 3).map((c, i) => (
                      <InlineStack key={i} gap="200" align="space-between">
                        <Text as="span" tone="subdued">
                          {c.quantity}x {c.title}
                        </Text>
                        <Text as="span">{formatPrice(c.price * c.quantity)}</Text>
                      </InlineStack>
                    ))}

                    {components.length > 3 && (
                      <Text as="span" tone="subdued">
                        +{components.length - 3} more products
                      </Text>
                    )}

                    <Divider />

                    <InlineStack gap="200" align="space-between">
                      <Text as="span" tone="subdued">
                        <s>{formatPrice(pricing.originalPrice)}</s>
                      </Text>
                      <Text as="span" variant="headingMd" tone="success">
                        {formatPrice(pricing.finalPrice)}
                      </Text>
                    </InlineStack>

                    <Badge tone="success">
                      Save {formatPrice(pricing.savings)} ({pricing.savingsPercentage}% off)
                    </Badge>
                  </BlockStack>
                </div>
              </BlockStack>
            </Card>

            {/* Tips Card */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Bundle Tips
                </Text>
                <BlockStack gap="200">
                  <Text as="p" tone="subdued">
                    - Bundles with 10-20% discounts typically perform best
                  </Text>
                  <Text as="p" tone="subdued">
                    - Include complementary products that customers often buy together
                  </Text>
                  <Text as="p" tone="subdued">
                    - Use clear, benefit-focused titles like "Complete Starter Kit"
                  </Text>
                  <Text as="p" tone="subdued">
                    - Keep bundles between 2-5 products for best conversion
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Delete Confirmation Modal */}
        <Modal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Bundle?"
          primaryAction={{
            content: "Delete",
            destructive: true,
            loading: deleting,
            onAction: handleDelete,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => setShowDeleteModal(false),
            },
          ]}
        >
          <Modal.Section>
            <Text as="p">
              Are you sure you want to delete this bundle? This action cannot be undone.
              {bundle?.status === "ACTIVE" && (
                <Text as="span" tone="critical">
                  {" "}
                  This bundle is currently active and will be removed from your store.
                </Text>
              )}
            </Text>
          </Modal.Section>
        </Modal>

        {/* Toast */}
        {toastActive && (
          <Toast
            content={toastMessage}
            error={toastError}
            onDismiss={() => setToastActive(false)}
            duration={3000}
          />
        )}
      </Page>
    </Frame>
  );
};

export async function getServerSideProps(context: any) {
  return await isShopAvailable(context);
}

export default BundleManagePage;

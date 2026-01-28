import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useRouter } from "next/router";
import { Product } from "@shopify/app-bridge/actions/ResourcePicker";
import SelectedProductsTable from "@/components/SelectedProductsTable";

import {
  Banner,
  Button,
  Form,
  FormLayout,
  Layout,
  Card,
  Page,
  Text,
  TextField,
  Toast,
  Frame,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import React from "react";
import { useBundleAPI } from "@/components/hooks/useBundleAPI";
import { useI18n } from "@shopify/react-i18n";
import { CreateBundleInput } from "@/types/v2-api.types";

const CreateBundlePage = () => {
  const router = useRouter();
  const [i18n] = useI18n();

  // Use V2 Bundle API hook
  const { createBundle, loading, error, clearError } = useBundleAPI();

  const [bundleName, setBundleName] = useState(
    `${i18n.translate("create_bundle.default_values.bundle_name")}`
  );
  const [bundleTitle, setBundleTitle] = useState(
    `${i18n.translate("create_bundle.default_values.bundle_title")}`
  );
  const [description, setDescription] = useState(
    `${i18n.translate("create_bundle.default_values.description")}`
  );
  const [discount, setDiscount] = useState("10");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // success/error toast messages
  const [successToastActive, setSuccessToastActive] = useState(false);
  const [errorToastActive, setErrorToastActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleSuccessToastActive = useCallback(
    () => setSuccessToastActive((active) => !active),
    []
  );
  const toggleErrorToastActive = useCallback(
    () => setErrorToastActive((active) => !active),
    []
  );

  // Open Shopify product picker
  const openProductPicker = async () => {
    if (window.shopify) {
      try {
        const selection = await (window.shopify.resourcePicker({
          type: 'product',
          multiple: true,
          action: 'select',
          filter: {
            variants: true,
          },
        }) as Promise<Product[]>);

        if (selection && selection.length > 0) {
          setSelectedProducts(selection);
        }
      } catch (error) {
        console.error('Product picker error:', error);
      }
    }
  };

  // Submit Form: Create new Bundle using V2 API
  async function handleSubmit() {
    // Validate inputs
    if (!bundleName.trim()) {
      setErrorMessage("Bundle name is required");
      toggleErrorToastActive();
      return;
    }

    if (!bundleTitle.trim()) {
      setErrorMessage("Bundle title is required");
      toggleErrorToastActive();
      return;
    }

    if (selectedProducts.length < 2) {
      setErrorMessage("Please select at least 2 products");
      toggleErrorToastActive();
      return;
    }

    const discountPercent = parseFloat(discount);
    if (isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
      setErrorMessage("Discount must be between 0 and 100");
      toggleErrorToastActive();
      return;
    }

    // Prepare V2 API input
    const input: CreateBundleInput = {
      name: bundleName.trim(),
      title: bundleTitle.trim(),
      description: description.trim() || undefined,
      discountPercent,
      components: selectedProducts.map((product) => ({
        shopifyProductId: product.id,
        quantity: 1,
      })),
    };

    const result = await createBundle(input);

    if (result) {
      // Success - reset form
      setBundleName(
        `${i18n.translate("create_bundle.default_values.bundle_name")}`
      );
      setBundleTitle(
        `${i18n.translate("create_bundle.default_values.bundle_title")}`
      );
      setDescription(
        `${i18n.translate("create_bundle.default_values.description")}`
      );
      setDiscount("10");
      setSelectedProducts([]);
      toggleSuccessToastActive();

      // Redirect to home after a short delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      // Error - show message
      setErrorMessage(error || "Failed to create bundle");
      toggleErrorToastActive();
    }
  }

  const successToast = successToastActive ? (
    <Toast
      content={i18n.translate("create_bundle.toasts.success")}
      onDismiss={toggleSuccessToastActive}
      duration={3000}
    />
  ) : null;

  const errorToast = errorToastActive ? (
    <Toast
      content={errorMessage || i18n.translate("create_bundle.toasts.error")}
      onDismiss={() => {
        toggleErrorToastActive();
        clearError();
      }}
      duration={3000}
      error
    />
  ) : null;

  return (
    <Frame>
      <Page
        title="Create Bundle"
        backAction={{
          onAction: () => router.push("/"),
        }}
      >
        <Layout>
          <Layout.Section>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <Card>
                  <BlockStack gap="400">
                    <TextField
                      value={bundleName}
                      onChange={(value) => {
                        setBundleName(value);
                      }}
                      label={i18n.translate("create_bundle.bundle_name.label")}
                      helpText={i18n.translate(
                        "create_bundle.bundle_name.help_text"
                      )}
                      type="text"
                      autoComplete="off"
                    />

                    <TextField
                      value={bundleTitle}
                      onChange={(value) => {
                        setBundleTitle(value);
                      }}
                      label={i18n.translate("create_bundle.bundle_title.label")}
                      helpText={i18n.translate(
                        "create_bundle.bundle_title.help_text"
                      )}
                      type="text"
                      autoComplete="off"
                    />

                    <TextField
                      value={description}
                      onChange={(value) => {
                        setDescription(value);
                      }}
                      label={i18n.translate("create_bundle.description.label")}
                      helpText={i18n.translate(
                        "create_bundle.description.help_text"
                      )}
                      type="text"
                      autoComplete="off"
                      multiline={3}
                    />

                    <TextField
                      value={discount}
                      onChange={(value) => {
                        setDiscount(value);
                      }}
                      label={i18n.translate("create_bundle.discount.label")}
                      helpText={i18n.translate(
                        "create_bundle.discount.help_text"
                      )}
                      type="number"
                      suffix="%"
                      autoComplete="off"
                      max={100}
                      min={0}
                    />
                  </BlockStack>
                </Card>

                <Card>
                  <BlockStack gap="400">
                    <BlockStack gap="200">
                      <Text as="h2" variant="headingMd">
                        {i18n.translate("create_bundle.products.title")}
                      </Text>
                      <Text as="p" tone="subdued">
                        {i18n.translate("create_bundle.products.help_text")}
                      </Text>
                    </BlockStack>

                    {selectedProducts.length === 0 ? (
                      <Banner tone="warning">
                        <Text as="p">
                          {i18n.translate("create_bundle.products.warning")}
                        </Text>
                      </Banner>
                    ) : selectedProducts.length === 1 ? (
                      <Banner tone="warning">
                        <Text as="p">
                          Please select at least 2 products for a bundle.
                        </Text>
                      </Banner>
                    ) : (
                      <SelectedProductsTable products={selectedProducts} />
                    )}

                    <Button variant="primary" onClick={openProductPicker}>
                      {i18n.translate("create_bundle.products.select")}
                    </Button>
                  </BlockStack>
                </Card>

                <InlineStack gap="400" align="start">
                  <Button
                    size="large"
                    variant="primary"
                    submit
                    disabled={selectedProducts.length < 2}
                    loading={loading}
                  >
                    {i18n.translate("buttons.save_bundle")}
                  </Button>
                  <Button
                    size="large"
                    onClick={() => router.push("/")}
                  >
                    Cancel
                  </Button>
                </InlineStack>
              </FormLayout>
            </Form>
          </Layout.Section>
        </Layout>
        {successToast}
        {errorToast}
      </Page>
    </Frame>
  );
};

//On first install, check if the store is installed and redirect accordingly
export async function getServerSideProps(context) {
  return await isShopAvailable(context);
}

export default CreateBundlePage;

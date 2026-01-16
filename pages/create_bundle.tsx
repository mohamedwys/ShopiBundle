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
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import React from "react";
import useFetch from "@/components/hooks/useFetch";
import { BundleData } from "@/utils/shopifyQueries/createBundle";
import { useI18n } from "@shopify/react-i18n";

const CreateBundlePage = () => {
  const router = useRouter();
  const fetch = useFetch();

  const [i18n] = useI18n();

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
  const [resourcePicker, setResourcePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // success/error toast messages
  const [successToastActive, setSuccessToastActive] = useState(false);
  const [errorToastActive, setErrorToastActive] = useState(false);

  const toggleSuccessToastActive = useCallback(
    () => setSuccessToastActive((active) => !active),
    []
  );
  const toggleErrorToastActive = useCallback(
    () => setErrorToastActive((active) => !active),
    []
  );

  // Open Shopify product picker
  const openProductPicker = () => {
    if (window.shopify) {
      window.shopify.resourcePicker({
        type: 'product',
        multiple: true,
        action: 'select',
        filter: {
          variants: true,
        },
      }).then((selection) => {
        if (selection && selection.length > 0) {
          setSelectedProducts(selection as Product[]);
        }
      }).catch((error) => {
        console.error('Product picker error:', error);
      });
    }
  };

  // Submit Form: Create new Bundle
  async function handleSubmit() {
    setLoading(true);
    const data: BundleData = {
      bundleName: bundleName,
      bundleTitle: bundleTitle,
      description: description,
      discount: discount,
      products: selectedProducts.map((products) => {
        return products.id;
      }),
    };

    let response = await fetch("/api/createBundle", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
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
      toggleSuccessToastActive();
    } else {
      toggleErrorToastActive();
    }
    setSelectedProducts([]);
    setLoading(false);
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
      content={i18n.translate("create_bundle.toasts.error")}
      onDismiss={toggleErrorToastActive}
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
                    ) : (
                      <SelectedProductsTable products={selectedProducts} />
                    )}

                    <Button variant="primary" onClick={openProductPicker}>
                      {i18n.translate("create_bundle.products.select")}
                    </Button>
                  </BlockStack>
                </Card>

                <div
                  style={{ display: "flex", gap: "1rem", paddingBottom: "1rem" }}
                >
                  <Button
                    size="large"
                    variant="primary"
                    submit
                    disabled={selectedProducts.length === 0}
                    loading={loading}
                  >
                    {i18n.translate("buttons.save_bundle")}
                  </Button>
                </div>
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
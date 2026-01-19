import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { Product } from "@shopify/app-bridge/actions/ResourcePicker";
import {
  Button,
  DataTable,
  Form,
  FormLayout,
  Layout,
  Card,
  Page,
  Spinner,
  TextField,
  Toast,
  Frame,
  BlockStack,
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import React from "react";
import useFetch from "@/components/hooks/useFetch";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { EditedBundleData } from "@/utils/shopifyQueries/editBundle";
import { useI18n } from "@shopify/react-i18n";

export type Fieldvalues = {
  bundle_name?: string;
  bundle_title?: string;
  created_at?: string;
  description?: string;
  discount?: string;
  products?: string;
};

export type GetBundleData = {
  id: string;
  fields: Array<{
    key: string;
    value: string;
  }>;
};

export type ProductData = {
  id: string;
  name: string;
  price: string;
};

export type GetProductData = {
  id: string;
  priceRangeV2: {
    maxVariantPrice: {
      amount: string;
    };
  };
  title: string;
};

const EditBundlePage: NextPage = () => {
  const router = useRouter();
  const id = router.query?.id;
  const fetch = useFetch();

  const [i18n] = useI18n();

  const [bundleName, setBundleName] = useState("");
  const [bundleTitle, setBundleTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("10");
  const [products, setProducts] = useState<ProductData[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [gettingBundle, setGettingBundle] = useState(false);
  const [productsChanged, setProductsChanged] = useState(false);

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

  // Getting Bundle data
  async function getBundle(id) {
    try {
      setGettingBundle(true);
      let data: GetBundleData = await fetch("/api/getBundle", {
        method: "POST",
        body: JSON.stringify({
          id: id,
        }),
      }).then(async (res) => JSON.parse(await res.json()));

      let values: Fieldvalues = {};
      for (let field of data.fields) {
        values[field.key] = field.value;
      }
      setBundleName(values.bundle_name);
      setBundleTitle(values.bundle_title);
      setDescription(values.description);
      setDiscount(values.discount);
      let productsData: ProductData[] = [];
      // Getting products data
      const products = JSON.parse(values.products);

      for (let productId of products) {
        let data: GetProductData = await fetch("/api/getProduct", {
          method: "POST",
          body: JSON.stringify({
            id: productId,
          }),
        }).then(async (res) => JSON.parse(await res.json()));

        productsData.push({
          id: data.id,
          name: data.title,
          price: data.priceRangeV2.maxVariantPrice.amount,
        });
      }

      setProducts(productsData);
      setRows(
        productsData.map((product) => {
          return [product.name, product.price];
        })
      );
      setGettingBundle(false);
    } catch (e) {
      router.push("/");
    }
  }

  useEffect(() => {
    if (id) {
      getBundle(id);
    }
  }, [id]);

  // Open product picker to change products
  async function handleChangeProducts() {
    const selectedProducts = await (window.shopify.resourcePicker({
      type: "product",
      multiple: true,
      action: "select",
      filter: {
        variants: true,
      },
    }) as Promise<Product[]>);

    if (selectedProducts && selectedProducts.length > 0) {
      const newProducts: ProductData[] = [];
      const newRows: string[][] = [];

      for (const product of selectedProducts) {
        let data: GetProductData = await fetch("/api/getProduct", {
          method: "POST",
          body: JSON.stringify({
            id: product.id,
          }),
        }).then(async (res) => JSON.parse(await res.json()));

        newProducts.push({
          id: data.id,
          name: data.title,
          price: data.priceRangeV2.maxVariantPrice.amount,
        });

        newRows.push([data.title, data.priceRangeV2.maxVariantPrice.amount]);
      }

      setProducts(newProducts);
      setRows(newRows);
      setProductsChanged(true);
    }
  }

  // Submit Form: Save Edited Bundle
  async function handleSubmit() {
    setLoading(true);
    const data: any = {
      id: id as string,
      bundleName: bundleName,
      bundleTitle: bundleTitle,
      description: description,
      discount: discount,
    };

    // Include products if they were changed
    if (productsChanged) {
      data.products = products.map((p) => p.id);
    }

    let response = await fetch("/api/editBundle", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      toggleSuccessToastActive();
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      toggleErrorToastActive();
    }
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

  const handleBundleNameChange = useCallback(
    (value: string) => setBundleName(value),
    []
  );
  const handleDiscountChange = useCallback(
    (value: string) => setDiscount(value),
    []
  );
  const handleTitleChange = useCallback(
    (value: string) => setBundleTitle(value),
    []
  );
  const handleDescriptionChange = useCallback(
    (value: string) => setDescription(value),
    []
  );

  // while getting bundle data showing spinner
  if (gettingBundle) {
    return (
      <div
        style={{
          height: "20rem",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner accessibilityLabel="Spinner" size="large" />
      </div>
    );
  }

  return (
    <Frame>
      <Page
        title={i18n.translate("edit_bundle.title")}
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
                      onChange={handleBundleNameChange}
                      label={i18n.translate("create_bundle.bundle_name.label")}
                      helpText={i18n.translate(
                        "create_bundle.bundle_name.help_text"
                      )}
                      type="text"
                      autoComplete="off"
                    />

                    <TextField
                      value={bundleTitle}
                      onChange={handleTitleChange}
                      label={i18n.translate("create_bundle.bundle_title.label")}
                      helpText={i18n.translate(
                        "create_bundle.bundle_title.help_text"
                      )}
                      type="text"
                      autoComplete="off"
                    />

                    <TextField
                      value={description}
                      onChange={handleDescriptionChange}
                      label={i18n.translate("create_bundle.description.label")}
                      helpText={i18n.translate(
                        "create_bundle.description.help_text"
                      )}
                      type="text"
                      autoComplete="off"
                    />

                    <TextField
                      value={discount}
                      onChange={handleDiscountChange}
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

                <Card padding="0">
                  <BlockStack gap="400">
                    <div style={{ padding: "1rem 1rem 0" }}>
                      <BlockStack gap="200">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 600 }}>
                            {i18n.translate("edit_bundle.products_table.title")}
                          </span>
                          <Button onClick={handleChangeProducts}>
                            {productsChanged ? "✓ Products Changed" : "Change Products"}
                          </Button>
                        </div>
                      </BlockStack>
                    </div>
                    <DataTable
                      showTotalsInFooter
                      columnContentTypes={["text", "text"]}
                      headings={[
                        `${i18n.translate("edit_bundle.products_table.product")}`,
                        `${i18n.translate("edit_bundle.products_table.price")}`,
                      ]}
                      rows={rows}
                    />
                  </BlockStack>
                </Card>

                <div
                  style={{ display: "flex", gap: "1rem", paddingBottom: "1rem" }}
                >
                  <Button variant="primary" submit loading={loading}>
                    {i18n.translate("buttons.save_bundle")}
                  </Button>
                  <Button
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    {i18n.translate("buttons.cancel")}
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

export default EditBundlePage;
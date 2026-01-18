import {
  IndexTable,
  Card,
  useIndexResourceState,
  Text,
  Pagination,
  Button,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useFetch from "./hooks/useFetch";
import { GetBundlesData } from "@/utils/shopifyQueries/getBundles";
import { useI18n } from "@shopify/react-i18n";

export type Fieldvalues = {
  bundle_name?: string;
  bundle_title?: string;
  created_at?: string;
  description?: string;
  discount?: string;
  products?: string;
  products_quantities?: string;
};

export default function ProductsTable() {
  const fetch = useFetch();
  const router = useRouter();
  const [i18n] = useI18n();

  const [bundles, setBundles] = useState([]);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [startCursor, setStartCursor] = useState("");
  const [endCursor, setEndCursor] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [gettingBundles, setgettingBundles] = useState(false);

  // Delete bundles
  async function deleteBundle() {
    setDeleting(true);
    await fetch("/api/deleteBundles", {
      method: "POST",
      body: JSON.stringify({
        ids: selectedResources,
      }),
    });
    setBundles(
      bundles.filter((bundle) => {
        if (selectedResources.includes(bundle.id)) {
          return false;
        }
        return true;
      })
    );
    setDeleting(false);
  }

  function arrayToObject(fields) {
    let values: Fieldvalues = {};
    for (let field of fields) {
      values[field.key] = field.value;
    }
    return values;
  }

  // get all bundles data
  async function getBunldes(after: boolean, cursor: string = null) {
    setgettingBundles(true);
    try {
      const response = await fetch("/api/getBundles", {
        method: "POST",
        body: JSON.stringify({
          after: after,
          cursor: cursor,
        }),
      });

      // Check if fetch returned null (reauthorization needed)
      if (!response) {
        console.log('Fetch returned null, redirecting to auth');
        setgettingBundles(false);
        return;
      }

      let data: GetBundlesData = JSON.parse(await response.json());

      let bundles = data.edges.map(({ node }) => {
        let values = arrayToObject(node.fields);
        return {
          id: node.id,
          handle: node.handle,
          name: values.bundle_name,
          title: values.bundle_title,
          created: new Date(values.created_at).toDateString(),
          discount: values.discount,
        };
      });

      setBundles(bundles);
      setStartCursor(data.pageInfo.startCursor);
      setEndCursor(data.pageInfo.endCursor);
      setHasNextPage(data.pageInfo.hasNextPage);
      setHasPreviousPage(data.pageInfo.hasPreviousPage);
    } catch (error) {
      console.error('Error fetching bundles:', error);
    } finally {
      setgettingBundles(false);
    }
  }

  // initially get all bundles
  useEffect(() => {
    getBunldes(true);
  }, []);

  const resourceName = {
    singular: `${i18n.translate("index.title")}`,
    plural: `${i18n.translate("index.title")}`,
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(bundles);

  // Navigate to edit page using Next.js router
  const navigateToEdit = (id: string) => {
    router.push(`/edit_bundle?id=${encodeURIComponent(id)}`);
  };

  // table data
  const rowMarkup = bundles.map(
    ({ id, handle, name, title, created, discount }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {name}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(handle);
            }}
            variant="plain"
          >
            {i18n.translate("index.bundles_table.copy")}
          </Button>
        </IndexTable.Cell>
        <IndexTable.Cell>{discount}</IndexTable.Cell>
        <IndexTable.Cell>{created}</IndexTable.Cell>
        <IndexTable.Cell>{title}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button
            onClick={() => navigateToEdit(id)}
            variant="plain"
          >
            {i18n.translate("index.bundles_table.view_edit")}
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <BlockStack gap="400">
      <Card padding="0">
        <IndexTable
          resourceName={resourceName}
          itemCount={bundles.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          loading={gettingBundles}
          headings={[
            { title: `${i18n.translate("index.bundles_table.name")}` },
            { title: `${i18n.translate("index.bundles_table.shortcode")}` },
            { title: `${i18n.translate("index.bundles_table.discount")}` },
            { title: `${i18n.translate("index.bundles_table.created")}` },
            { title: `${i18n.translate("index.bundles_table.title")}` },
            { title: `${i18n.translate("index.bundles_table.action")}` },
          ]}
          lastColumnSticky
        >
          {rowMarkup}
        </IndexTable>
      </Card>
      <InlineStack gap="400" align="start">
        <Pagination
          hasPrevious={hasPreviousPage}
          onPrevious={() => {
            getBunldes(false, startCursor);
          }}
          hasNext={hasNextPage}
          onNext={() => {
            getBunldes(true, endCursor);
          }}
        />
        {selectedResources.length > 0 && (
          <Button onClick={() => deleteBundle()} tone="critical" loading={deleting}>
            {i18n.translate("buttons.delete")}
          </Button>
        )}
      </InlineStack>
    </BlockStack>
  );
}
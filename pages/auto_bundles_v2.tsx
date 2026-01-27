import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useRouter } from "next/router";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Frame,
  IndexTable,
  Layout,
  Modal,
  OptionList,
  Page,
  Spinner,
  TextField,
  Toast,
  BlockStack,
  Text,
  InlineStack,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import useFetch from "@/components/hooks/useFetch";
import { useI18n } from "@shopify/react-i18n";

const AutoBundlesV2Page = () => {
  const router = useRouter();
  const fetch = useFetch();
  const [i18n] = useI18n();

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create rule form state
  const [ruleName, setRuleName] = useState("");
  const [productTags, setProductTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("0");
  const [discount, setDiscount] = useState("10");
  const [minProducts, setMinProducts] = useState("2");
  const [creating, setCreating] = useState(false);

  // Toast state
  const [successToastActive, setSuccessToastActive] = useState(false);
  const [errorToastActive, setErrorToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Load rules
      const rulesData = await fetch("/api/autobundle/listRules", {
        method: "POST",
      }).then((res) => res.json());
      setRules(rulesData);

      // Load collections and tags for create form
      const collectionsData = await fetch("/api/getCollections", {
        method: "POST",
      }).then((res) => res.json());

      const tagsData = await fetch("/api/getProductTags", {
        method: "POST",
      }).then((res) => res.json());

      setCollections(collectionsData.edges);
      setProductTags(tagsData.edges);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  }

  async function handleCreateRule() {
    if (!ruleName.trim()) {
      setToastMessage("Please enter a rule name");
      setErrorToastActive(true);
      return;
    }

    setCreating(true);
    try {
      const allCollections = collections.map((c: any) => c.node.title);

      const response = await fetch("/api/autobundle/createRule", {
        method: "POST",
        body: JSON.stringify({
          name: ruleName,
          collections: selectedCollections,
          allCollections: allCollections,
          tags: selectedTags,
          minPrice,
          maxPrice,
          minProducts,
          discount,
        }),
      });

      if (response.ok) {
        setToastMessage("Auto bundle rule created successfully");
        setSuccessToastActive(true);
        setShowCreateModal(false);
        resetForm();
        loadData();
      } else {
        setToastMessage("Failed to create rule");
        setErrorToastActive(true);
      }
    } catch (error) {
      setToastMessage("Error creating rule");
      setErrorToastActive(true);
    }
    setCreating(false);
  }

  async function handleDeleteRule(ruleId: string) {
    if (!confirm("Are you sure you want to delete this rule?")) return;

    try {
      const response = await fetch("/api/autobundle/deleteRule", {
        method: "POST",
        body: JSON.stringify({ ruleId }),
      });

      if (response.ok) {
        setToastMessage("Rule deleted successfully");
        setSuccessToastActive(true);
        loadData();
      } else {
        setToastMessage("Failed to delete rule");
        setErrorToastActive(true);
      }
    } catch (error) {
      setToastMessage("Error deleting rule");
      setErrorToastActive(true);
    }
  }

  async function handleToggleRule(ruleId: string, currentState: boolean) {
    try {
      const response = await fetch("/api/autobundle/toggleRule", {
        method: "POST",
        body: JSON.stringify({ ruleId, isActive: !currentState }),
      });

      if (response.ok) {
        setToastMessage(
          `Rule ${!currentState ? "activated" : "deactivated"} successfully`
        );
        setSuccessToastActive(true);
        loadData();
      }
    } catch (error) {
      setToastMessage("Error toggling rule");
      setErrorToastActive(true);
    }
  }

  function resetForm() {
    setRuleName("");
    setSelectedTags([]);
    setSelectedCollections([]);
    setMinPrice("0");
    setMaxPrice("0");
    setDiscount("10");
    setMinProducts("2");
  }

  const collectionsOptions = collections.map((c: any) => ({
    value: c.node.title,
    label: c.node.title,
  }));

  const tagsOptions = productTags.map((t: any) => ({
    value: t.node,
    label: t.node,
  }));

  const rowMarkup = rules.map((rule: any, index) => (
    <IndexTable.Row id={rule.id} key={rule.id} position={index}>
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {rule.name}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {rule.isActive ? (
          <Badge tone="success">Active</Badge>
        ) : (
          <Badge>Inactive</Badge>
        )}
      </IndexTable.Cell>
      <IndexTable.Cell>{rule.discount}%</IndexTable.Cell>
      <IndexTable.Cell>
        {rule.collections.length > 0
          ? rule.collections.join(", ")
          : "All collections"}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {rule.tags.length > 0 ? rule.tags.join(", ") : "All tags"}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {new Date(rule.createdAt).toLocaleDateString()}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="200">
          <Button
            size="slim"
            onClick={() => handleToggleRule(rule.id, rule.isActive)}
          >
            {rule.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            size="slim"
            tone="critical"
            onClick={() => handleDeleteRule(rule.id)}
          >
            Delete
          </Button>
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "30rem",
        }}
      >
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <Frame>
      <Page
        title="Auto Bundle Rules (v2)"
        backAction={{
          onAction: () => router.push("/"),
        }}
        primaryAction={{
          content: "Create Rule",
          onAction: () => setShowCreateModal(true),
        }}
      >
        <Layout>
          <Layout.Section>
            <Card padding="0">
              {rules.length === 0 ? (
                <EmptyState
                  heading="No auto bundle rules yet"
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                  action={{
                    content: "Create your first rule",
                    onAction: () => setShowCreateModal(true),
                  }}
                >
                  <p>
                    Create rules to automatically generate bundles based on
                    collections, tags, and price ranges.
                  </p>
                </EmptyState>
              ) : (
                <IndexTable
                  resourceName={{ singular: "rule", plural: "rules" }}
                  itemCount={rules.length}
                  headings={[
                    { title: "Rule Name" },
                    { title: "Status" },
                    { title: "Discount" },
                    { title: "Collections" },
                    { title: "Tags" },
                    { title: "Created" },
                    { title: "Actions" },
                  ]}
                  selectable={false}
                >
                  {rowMarkup}
                </IndexTable>
              )}
            </Card>
          </Layout.Section>
        </Layout>

        <Modal
          open={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          title="Create Auto Bundle Rule"
          primaryAction={{
            content: "Create Rule",
            onAction: handleCreateRule,
            loading: creating,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => {
                setShowCreateModal(false);
                resetForm();
              },
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              <TextField
                label="Rule Name"
                value={ruleName}
                onChange={setRuleName}
                placeholder="e.g., Summer Collection Bundle"
                autoComplete="off"
              />

              <OptionList
                title="Collections (leave empty for all)"
                onChange={setSelectedCollections}
                options={collectionsOptions}
                allowMultiple
                selected={selectedCollections}
              />

              <OptionList
                title="Tags (leave empty for all)"
                onChange={setSelectedTags}
                options={tagsOptions}
                allowMultiple
                selected={selectedTags}
              />

              <TextField
                label="Minimum Price"
                type="number"
                value={minPrice}
                onChange={setMinPrice}
                min={0}
                autoComplete="off"
              />

              <TextField
                label="Maximum Price (0 for no limit)"
                type="number"
                value={maxPrice}
                onChange={setMaxPrice}
                min={0}
                autoComplete="off"
              />

              <TextField
                label="Discount Percentage"
                type="number"
                value={discount}
                onChange={setDiscount}
                suffix="%"
                min={0}
                max={100}
                autoComplete="off"
              />

              <TextField
                label="Minimum Products Required"
                type="number"
                value={minProducts}
                onChange={setMinProducts}
                min={1}
                max={20}
                autoComplete="off"
              />
            </BlockStack>
          </Modal.Section>
        </Modal>

        {successToastActive && (
          <Toast
            content={toastMessage}
            onDismiss={() => setSuccessToastActive(false)}
            duration={3000}
          />
        )}
        {errorToastActive && (
          <Toast
            content={toastMessage}
            onDismiss={() => setErrorToastActive(false)}
            duration={3000}
            error
          />
        )}
      </Page>
    </Frame>
  );
};

export async function getServerSideProps(context) {
  return await isShopAvailable(context);
}

export default AutoBundlesV2Page;

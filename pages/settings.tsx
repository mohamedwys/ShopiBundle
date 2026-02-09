import isShopAvailable from "@/utils/middleware/isShopAvailable";
import useFetch from "@/components/hooks/useFetch";
import { useAppBridge } from "@/components/providers/AppBridgeProvider";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  TextField,
  Checkbox,
  Button,
  Banner,
  Badge,
  Divider,
  Toast,
  Frame,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
  ProgressBar,
} from "@shopify/polaris";

interface ShopSettings {
  shop: string;
  plan: string;
  widgetEnabled: boolean;
  defaultPrimaryColor: string;
  defaultAccentColor: string;
  emailAlerts: boolean;
  weeklyDigest: boolean;
  lowStockAlerts: boolean;
  alertEmail: string;
  storeName: string;
  storeCurrency: string;
  storeTimezone: string;
  onboardingCompleted: boolean;
}

interface BillingUsage {
  currentRevenue: number;
  revenueLimit: number;
  plan: string;
  periodStart: string;
  periodEnd: string;
}

const SettingsPage = () => {
  const router = useRouter();
  const { app, isReady } = useAppBridge();
  const fetch = useFetch();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [billingUsage, setBillingUsage] = useState<BillingUsage | null>(null);

  // Form state (editable fields)
  const [widgetEnabled, setWidgetEnabled] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [accentColor, setAccentColor] = useState("#5C6AC4");
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [lowStockAlerts, setLowStockAlerts] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");

  // Track whether form has unsaved changes
  const [isDirty, setIsDirty] = useState(false);

  // Toast state
  const [successToastActive, setSuccessToastActive] = useState(false);
  const [errorToastActive, setErrorToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toggleSuccessToast = useCallback(
    () => setSuccessToastActive((active) => !active),
    []
  );
  const toggleErrorToast = useCallback(
    () => setErrorToastActive((active) => !active),
    []
  );

  // Populate form state from fetched settings
  const populateForm = useCallback((data: ShopSettings) => {
    setWidgetEnabled(data.widgetEnabled);
    setPrimaryColor(data.defaultPrimaryColor || "#000000");
    setAccentColor(data.defaultAccentColor || "#5C6AC4");
    setEmailAlerts(data.emailAlerts);
    setWeeklyDigest(data.weeklyDigest);
    setLowStockAlerts(data.lowStockAlerts);
    setAlertEmail(data.alertEmail || "");
    setIsDirty(false);
  }, []);

  // Fetch settings and billing data on mount
  useEffect(() => {
    if (!isReady) return;

    const loadData = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const [settingsRes, billingRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/billing/usage"),
        ]);

        if (!settingsRes || !billingRes) {
          setFetchError("Unable to connect. Please refresh the page.");
          setLoading(false);
          return;
        }

        const settingsData = await settingsRes.json();
        const billingData = await billingRes.json();

        if (settingsData.success && settingsData.data) {
          setSettings(settingsData.data);
          populateForm(settingsData.data);
        } else {
          setFetchError(
            settingsData.error || "Failed to load settings."
          );
        }

        if (billingData.success && billingData.data) {
          setBillingUsage(billingData.data);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        setFetchError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isReady]);

  // Mark form as dirty when any editable field changes
  useEffect(() => {
    if (!settings) return;
    const changed =
      widgetEnabled !== settings.widgetEnabled ||
      primaryColor !== (settings.defaultPrimaryColor || "#000000") ||
      accentColor !== (settings.defaultAccentColor || "#5C6AC4") ||
      emailAlerts !== settings.emailAlerts ||
      weeklyDigest !== settings.weeklyDigest ||
      lowStockAlerts !== settings.lowStockAlerts ||
      alertEmail !== (settings.alertEmail || "");
    setIsDirty(changed);
  }, [
    settings,
    widgetEnabled,
    primaryColor,
    accentColor,
    emailAlerts,
    weeklyDigest,
    lowStockAlerts,
    alertEmail,
  ]);

  // Save settings
  const handleSave = useCallback(async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          widgetEnabled,
          defaultPrimaryColor: primaryColor,
          defaultAccentColor: accentColor,
          emailAlerts,
          weeklyDigest,
          lowStockAlerts,
          alertEmail,
        }),
      });

      if (!response) {
        setToastMessage("Unable to save. Please try again.");
        setErrorToastActive(true);
        setSaving(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Update local settings reference to match saved state
        setSettings((prev) =>
          prev
            ? {
                ...prev,
                widgetEnabled,
                defaultPrimaryColor: primaryColor,
                defaultAccentColor: accentColor,
                emailAlerts,
                weeklyDigest,
                lowStockAlerts,
                alertEmail,
              }
            : prev
        );
        setIsDirty(false);
        setToastMessage("Settings saved successfully.");
        setSuccessToastActive(true);
      } else {
        setToastMessage(data.error || "Failed to save settings.");
        setErrorToastActive(true);
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setToastMessage("An unexpected error occurred while saving.");
      setErrorToastActive(true);
    } finally {
      setSaving(false);
    }
  }, [
    fetch,
    widgetEnabled,
    primaryColor,
    accentColor,
    emailAlerts,
    weeklyDigest,
    lowStockAlerts,
    alertEmail,
  ]);

  // Handle plan upgrade
  const handleUpgrade = useCallback(async () => {
    setUpgrading(true);

    try {
      const response = await fetch("/api/billing/upgrade", {
        method: "POST",
      });

      if (!response) {
        setToastMessage("Unable to start upgrade. Please try again.");
        setErrorToastActive(true);
        setUpgrading(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.data?.confirmationUrl) {
        // Redirect merchant to Shopify charge approval page
        if (window.top) {
          window.top.location.href = data.data.confirmationUrl;
        } else {
          window.location.href = data.data.confirmationUrl;
        }
      } else {
        setToastMessage(data.error || "Failed to initiate upgrade.");
        setErrorToastActive(true);
      }
    } catch (err) {
      console.error("Error upgrading plan:", err);
      setToastMessage("An unexpected error occurred during upgrade.");
      setErrorToastActive(true);
    } finally {
      setUpgrading(false);
    }
  }, [fetch]);

  // Validate hex color input
  const isValidHexColor = (value: string): boolean => {
    return /^#[0-9A-Fa-f]{6}$/.test(value);
  };

  // Loading skeleton
  if (loading) {
    return (
      <Frame>
        <SkeletonPage title="Settings" primaryAction>
          <Layout>
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={4} />
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={3} />
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={4} />
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={3} />
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        </SkeletonPage>
      </Frame>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <Frame>
        <Page
          title="Settings"
          backAction={{ onAction: () => router.push("/") }}
        >
          <Layout>
            <Layout.Section>
              <Banner tone="critical" title="Error loading settings">
                <p>{fetchError}</p>
              </Banner>
            </Layout.Section>
          </Layout>
        </Page>
      </Frame>
    );
  }

  const isFreePlan = settings?.plan === "Free" || settings?.plan === "free";
  const revenueLimit = billingUsage?.revenueLimit || (isFreePlan ? 100 : 1000);
  const currentRevenue = billingUsage?.currentRevenue || 0;
  const usagePercent = Math.min(
    Math.round((currentRevenue / revenueLimit) * 100),
    100
  );
  const usageIsHigh = usagePercent >= 80;

  const widgetScriptUrl = `https://shopi-bundle.vercel.app/extensions/product-bundle/assets/bundle-widget.js`;

  return (
    <Frame>
      <Page
        title="Settings"
        backAction={{ onAction: () => router.push("/") }}
        primaryAction={{
          content: "Save",
          onAction: handleSave,
          loading: saving,
          disabled: !isDirty || saving,
        }}
      >
        <Layout>
          {/* Billing & Plan Section */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Billing & Plan
                  </Text>
                  <Badge tone={isFreePlan ? "info" : "success"}>
                    {isFreePlan ? "Free" : "Starter"}
                  </Badge>
                </InlineStack>

                <Divider />

                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd">
                      Revenue this period
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="semibold">
                      ${currentRevenue.toFixed(2)} / $
                      {revenueLimit.toLocaleString()}
                    </Text>
                  </InlineStack>
                  <ProgressBar
                    progress={usagePercent}
                    tone={usageIsHigh ? "critical" : "primary"}
                    size="small"
                  />
                  {usageIsHigh && (
                    <Text as="p" variant="bodySm" tone="critical">
                      You are approaching your revenue limit for this billing
                      period.
                    </Text>
                  )}
                </BlockStack>

                <Divider />

                <BlockStack gap="200">
                  <Text as="p" variant="bodyMd" fontWeight="semibold">
                    Plan features
                  </Text>
                  {isFreePlan ? (
                    <BlockStack gap="100">
                      <Text as="p" variant="bodySm">
                        Up to $100/month in bundle revenue
                      </Text>
                      <Text as="p" variant="bodySm">
                        Unlimited bundles
                      </Text>
                      <Text as="p" variant="bodySm">
                        Basic analytics
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Upgrade to Starter for $1,000/month revenue limit,
                        priority support, and advanced analytics.
                      </Text>
                    </BlockStack>
                  ) : (
                    <BlockStack gap="100">
                      <Text as="p" variant="bodySm">
                        Up to $1,000/month in bundle revenue
                      </Text>
                      <Text as="p" variant="bodySm">
                        Unlimited bundles
                      </Text>
                      <Text as="p" variant="bodySm">
                        Advanced analytics & priority support
                      </Text>
                    </BlockStack>
                  )}
                </BlockStack>

                <InlineStack align="start">
                  {isFreePlan ? (
                    <Button
                      variant="primary"
                      onClick={handleUpgrade}
                      loading={upgrading}
                    >
                      Upgrade to Starter
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (window.top) {
                          window.top.location.href =
                            "https://admin.shopify.com/store/settings/billing";
                        }
                      }}
                    >
                      Manage Subscription
                    </Button>
                  )}
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Widget Settings Section */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Widget Settings
                </Text>

                <Divider />

                <Checkbox
                  label="Enable bundle widget"
                  helpText="When disabled, the bundle widget will not appear on your storefront."
                  checked={widgetEnabled}
                  onChange={setWidgetEnabled}
                />

                <TextField
                  label="Primary color"
                  value={primaryColor}
                  onChange={setPrimaryColor}
                  autoComplete="off"
                  prefix="#"
                  placeholder="000000"
                  error={
                    primaryColor && !isValidHexColor(primaryColor)
                      ? "Enter a valid hex color (e.g., #5C6AC4)"
                      : undefined
                  }
                  helpText="Primary color for the widget buttons and headings."
                  connectedRight={
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 4,
                        border: "1px solid #c4cdd5",
                        backgroundColor: isValidHexColor(primaryColor)
                          ? primaryColor
                          : "#ffffff",
                      }}
                    />
                  }
                />

                <TextField
                  label="Accent color"
                  value={accentColor}
                  onChange={setAccentColor}
                  autoComplete="off"
                  prefix="#"
                  placeholder="5C6AC4"
                  error={
                    accentColor && !isValidHexColor(accentColor)
                      ? "Enter a valid hex color (e.g., #5C6AC4)"
                      : undefined
                  }
                  helpText="Accent color for highlights and secondary elements."
                  connectedRight={
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 4,
                        border: "1px solid #c4cdd5",
                        backgroundColor: isValidHexColor(accentColor)
                          ? accentColor
                          : "#ffffff",
                      }}
                    />
                  }
                />
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Notifications Section */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Notifications
                </Text>

                <Divider />

                <Checkbox
                  label="Email alerts"
                  helpText="Receive an email when you are approaching your revenue limit."
                  checked={emailAlerts}
                  onChange={setEmailAlerts}
                />

                <Checkbox
                  label="Weekly performance digest"
                  helpText="Receive a weekly summary of your bundle performance."
                  checked={weeklyDigest}
                  onChange={setWeeklyDigest}
                />

                <Checkbox
                  label="Low stock alerts"
                  helpText="Get notified when products included in bundles are running low on inventory."
                  checked={lowStockAlerts}
                  onChange={setLowStockAlerts}
                />

                <TextField
                  label="Alert email address"
                  type="email"
                  value={alertEmail}
                  onChange={setAlertEmail}
                  autoComplete="email"
                  placeholder="you@example.com"
                  helpText="All notification emails will be sent to this address."
                  disabled={!emailAlerts && !weeklyDigest && !lowStockAlerts}
                />
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Widget Installation Section */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Widget Installation
                  </Text>
                  <Badge tone="success">Active</Badge>
                </InlineStack>

                <Divider />

                <Banner tone="info">
                  <p>
                    The ShopiBundle widget is installed via the Shopify theme app
                    extension. No manual code changes are required.
                  </p>
                </Banner>

                <TextField
                  label="Widget script URL"
                  value={widgetScriptUrl}
                  onChange={() => {}}
                  autoComplete="off"
                  readOnly
                  helpText="This script is automatically loaded by the theme app extension."
                  selectTextOnFocus
                />

                <BlockStack gap="200">
                  <Text as="p" variant="bodyMd" fontWeight="semibold">
                    How it works
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    1. The theme app extension automatically adds the widget
                    container to your product pages.
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    2. The widget script loads bundle data via the storefront
                    proxy route.
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    3. Customers see available bundles and can add them directly
                    to their cart.
                  </Text>
                </BlockStack>

                <Text as="p" variant="bodySm" tone="subdued">
                  To customize widget placement, go to your Shopify theme editor
                  and look for the "ShopiBundle" app block in the product page
                  template.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Store Info (read-only) */}
          {settings && (
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Store Information
                  </Text>

                  <Divider />

                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Store name
                    </Text>
                    <Text as="p" variant="bodyMd">
                      {settings.storeName || settings.shop}
                    </Text>
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Currency
                    </Text>
                    <Text as="p" variant="bodyMd">
                      {settings.storeCurrency || "USD"}
                    </Text>
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Timezone
                    </Text>
                    <Text as="p" variant="bodyMd">
                      {settings.storeTimezone || "UTC"}
                    </Text>
                  </InlineStack>
                </BlockStack>
              </Card>
            </Layout.Section>
          )}
        </Layout>

        {successToastActive && (
          <Toast
            content={toastMessage}
            onDismiss={toggleSuccessToast}
            duration={3000}
          />
        )}
        {errorToastActive && (
          <Toast
            content={toastMessage}
            onDismiss={toggleErrorToast}
            duration={4000}
            error
          />
        )}
      </Page>
    </Frame>
  );
};

export async function getServerSideProps(context: any) {
  return await isShopAvailable(context);
}

export default SettingsPage;

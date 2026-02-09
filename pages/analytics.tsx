/**
 * Analytics Dashboard Page
 *
 * Full-page analytics view with plan usage banner, key metric cards,
 * and a sortable bundle performance table.
 *
 * Data source: GET /api/analytics/overview?days=N
 */

import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useRouter } from "next/router";
import useFetch from "@/components/hooks/useFetch";

import {
  Badge,
  Banner,
  BlockStack,
  Button,
  Card,
  DataTable,
  EmptyState,
  InlineGrid,
  InlineStack,
  Layout,
  Page,
  ProgressBar,
  Select,
  SkeletonBodyText,
  Text,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OverviewData {
  totalRevenue: number;
  totalOrders: number;
  totalImpressions: number;
  totalAddToCarts: number;
  conversionRate: number;
  aovLift: number | null;
  previousPeriod: {
    revenue: number;
    orders: number;
    revenueGrowth: number;
  };
}

interface UsageData {
  plan: string;
  monthlyRevenue: number;
  revenueLimit: number;
  usagePercent: number;
  daysUntilReset: number;
  isOverLimit: boolean;
  isNearLimit: boolean;
  upgradeMessage: string | null;
}

interface BundlePerformance {
  id: string;
  name: string;
  title: string;
  type: string;
  status: string;
  impressions: number;
  clicks: number;
  addToCarts: number;
  orders: number;
  revenue: number;
  conversionRate: number;
}

interface AnalyticsPayload {
  overview: OverviewData;
  usage: UsageData;
  bundles: BundlePerformance[];
  period: { days: number; startDate: string };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const formatNumber = (value: number): string =>
  new Intl.NumberFormat("en-US").format(value);

const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

const BUNDLE_TYPE_LABELS: Record<string, string> = {
  FIXED: "Fixed",
  VOLUME: "Volume",
  BOGO: "BOGO",
  MIX_MATCH: "Mix & Match",
  FBT: "Frequently Bought Together",
  FREE_GIFT: "Free Gift",
  TIERED: "Tiered",
};

const STATUS_BADGE_TONE: Record<
  string,
  "success" | "info" | "warning" | "critical" | "attention" | undefined
> = {
  ACTIVE: "success",
  DRAFT: undefined,
  SCHEDULED: "info",
  PAUSED: "attention",
  ARCHIVED: "critical",
};

const PERIOD_OPTIONS = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 14 days", value: "14" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

type SortDirection = "ascending" | "descending";

// Columns in the DataTable that are sortable (by index)
const SORTABLE_COLUMNS = [true, false, false, true, true, true, true];

// Map column index to BundlePerformance numeric field for sorting
const SORT_FIELD_MAP: Record<number, keyof BundlePerformance> = {
  0: "name",
  3: "impressions",
  4: "orders",
  5: "revenue",
  6: "conversionRate",
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

const AnalyticsPage: NextPage = () => {
  const router = useRouter();
  const fetch = useFetch();

  // Data
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [bundles, setBundles] = useState<BundlePerformance[]>([]);

  // UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("30");
  const [sortIndex, setSortIndex] = useState<number>(5);
  const [sortDirection, setSortDirection] = useState<SortDirection>("descending");

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analytics/overview?days=${period}`);

      // null means App Bridge is redirecting for auth
      if (!response) return;

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || `Request failed (${response.status})`);
      }

      const json = await response.json();

      if (!json.success) {
        throw new Error(json.error || "Failed to load analytics");
      }

      const data: AnalyticsPayload = json.data;
      setOverview(data.overview);
      setUsage(data.usage);
      setBundles(data.bundles ?? []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Analytics fetch error:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetch, period]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  // ---------------------------------------------------------------------------
  // Upgrade handler
  // ---------------------------------------------------------------------------

  const handleUpgrade = useCallback(async () => {
    try {
      const response = await fetch("/api/billing/upgrade", { method: "POST" });
      if (!response) return;

      const data = await response.json();
      if (data.success && data.data?.confirmationUrl) {
        const target = window.top ?? window;
        target.location.href = data.data.confirmationUrl;
      }
    } catch (err) {
      console.error("Upgrade error:", err);
    }
  }, [fetch]);

  // ---------------------------------------------------------------------------
  // Sorting
  // ---------------------------------------------------------------------------

  const handleSort = useCallback(
    (headingIndex: number, direction: SortDirection) => {
      setSortIndex(headingIndex);
      setSortDirection(direction);
    },
    [],
  );

  const getSortedBundles = useCallback((): BundlePerformance[] => {
    const field = SORT_FIELD_MAP[sortIndex];
    if (!field) return bundles;

    return [...bundles].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      let cmp: number;
      if (typeof aVal === "string" && typeof bVal === "string") {
        cmp = aVal.localeCompare(bVal);
      } else {
        cmp = (aVal as number) - (bVal as number);
      }

      return sortDirection === "ascending" ? cmp : -cmp;
    });
  }, [bundles, sortIndex, sortDirection]);

  // ---------------------------------------------------------------------------
  // Sub-renders
  // ---------------------------------------------------------------------------

  /** Plan usage banner at the top of the page */
  const renderUsageBanner = () => {
    if (!usage) return null;

    const usedLabel = formatCurrency(usage.monthlyRevenue);
    const limitLabel = formatCurrency(usage.revenueLimit);
    const progressValue = Math.min(usage.usagePercent, 100);

    // Over-limit: success tone (congratulatory) with upgrade CTA
    if (usage.isOverLimit) {
      return (
        <Banner
          title={`You've generated ${usedLabel} in bundle revenue this month!`}
          tone="success"
          action={{ content: "Upgrade plan", onAction: handleUpgrade }}
        >
          <BlockStack gap="200">
            <ProgressBar
              progress={100}
              tone="success"
              size="small"
            />
            <Text as="p" variant="bodySm">
              {usedLabel} / {limitLabel} on the {usage.plan} plan.{" "}
              {usage.upgradeMessage || "Upgrade to unlock higher limits."}
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Resets in {usage.daysUntilReset} day
              {usage.daysUntilReset !== 1 ? "s" : ""}
            </Text>
          </BlockStack>
        </Banner>
      );
    }

    // Near-limit: warning tone
    if (usage.isNearLimit) {
      return (
        <Banner
          title={`${usedLabel} / ${limitLabel} used this month`}
          tone="warning"
          action={{ content: "Upgrade plan", onAction: handleUpgrade }}
        >
          <BlockStack gap="200">
            <ProgressBar
              progress={progressValue}
              tone="highlight"
              size="small"
            />
            <Text as="p" variant="bodySm">
              You are approaching your {usage.plan} plan limit.{" "}
              {usage.upgradeMessage || "Consider upgrading to avoid interruptions."}
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Resets in {usage.daysUntilReset} day
              {usage.daysUntilReset !== 1 ? "s" : ""}
            </Text>
          </BlockStack>
        </Banner>
      );
    }

    // Normal usage: info tone, no upgrade CTA
    return (
      <Banner
        title={`${usage.plan} plan - ${usedLabel} / ${limitLabel} this month`}
        tone="info"
      >
        <BlockStack gap="200">
          <ProgressBar
            progress={progressValue}
            tone="highlight"
            size="small"
          />
          <Text as="p" variant="bodySm" tone="subdued">
            Resets in {usage.daysUntilReset} day
            {usage.daysUntilReset !== 1 ? "s" : ""}
          </Text>
        </BlockStack>
      </Banner>
    );
  };

  /** Growth indicator shown beneath the revenue card */
  const renderGrowth = (growth: number) => {
    if (growth === 0) return null;

    const isPositive = growth > 0;
    const arrow = isPositive ? "\u2191" : "\u2193";
    const tone: "success" | "critical" = isPositive ? "success" : "critical";

    return (
      <Text as="p" variant="bodySm" tone={tone}>
        {arrow} {isPositive ? "+" : ""}
        {growth.toFixed(1)}% vs previous period
      </Text>
    );
  };

  /** 4-6 key metric cards in a responsive grid */
  const renderMetricCards = () => {
    if (!overview) return null;

    const cards = [
      {
        label: "Total Bundle Revenue",
        value: formatCurrency(overview.totalRevenue),
        extra: renderGrowth(overview.previousPeriod.revenueGrowth),
      },
      {
        label: "Total Orders",
        value: formatNumber(overview.totalOrders),
        extra: (
          <Text as="p" variant="bodySm" tone="subdued">
            Previous: {formatNumber(overview.previousPeriod.orders)}
          </Text>
        ),
      },
      {
        label: "Total Impressions",
        value: formatNumber(overview.totalImpressions),
        extra: (
          <Text as="p" variant="bodySm" tone="subdued">
            {formatNumber(overview.totalAddToCarts)} add-to-carts
          </Text>
        ),
      },
      {
        label: "Conversion Rate",
        value: formatPercent(overview.conversionRate),
        extra: (
          <Text as="p" variant="bodySm" tone="subdued">
            Impression to order
          </Text>
        ),
      },
    ];

    // Only include AOV Lift when data is present
    if (overview.aovLift != null) {
      cards.push({
        label: "AOV Lift",
        value: `+${formatPercent(overview.aovLift)}`,
        extra: (
          <Text as="p" variant="bodySm" tone="subdued">
            Avg order value increase
          </Text>
        ),
      });
    }

    return (
      <InlineGrid columns={{ xs: 1, sm: 2, md: 3, lg: cards.length > 4 ? 5 : 4 }} gap="400">
        {cards.map((card) => (
          <Card key={card.label}>
            <BlockStack gap="200">
              <Text as="p" variant="bodySm" tone="subdued">
                {card.label}
              </Text>
              <Text as="p" variant="headingLg">
                {card.value}
              </Text>
              {card.extra}
            </BlockStack>
          </Card>
        ))}
      </InlineGrid>
    );
  };

  /** Sortable bundle performance DataTable */
  const renderBundleTable = () => {
    const sorted = getSortedBundles();

    if (sorted.length === 0) {
      return (
        <Card>
          <EmptyState
            heading="No data yet"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            action={{
              content: "Create a bundle",
              onAction: () => router.push("/create_bundle"),
            }}
          >
            <Text as="p">
              Once you create and publish bundles, their performance metrics will
              appear here.
            </Text>
          </EmptyState>
        </Card>
      );
    }

    const rows = sorted.map((bundle) => [
      <Button
        key={bundle.id}
        variant="plain"
        onClick={() => router.push(`/edit_bundle?id=${bundle.id}`)}
      >
        {bundle.title || bundle.name}
      </Button>,
      <Badge key={`type-${bundle.id}`}>
        {BUNDLE_TYPE_LABELS[bundle.type] || bundle.type}
      </Badge>,
      <Badge key={`status-${bundle.id}`} tone={STATUS_BADGE_TONE[bundle.status]}>
        {bundle.status}
      </Badge>,
      formatNumber(bundle.impressions),
      formatNumber(bundle.orders),
      formatCurrency(bundle.revenue),
      formatPercent(bundle.conversionRate),
    ]);

    return (
      <Card padding="0">
        <BlockStack gap="0">
          <div style={{ padding: "var(--p-space-400)" }}>
            <Text as="h2" variant="headingMd">
              Bundle Performance
            </Text>
          </div>
          <DataTable
            columnContentTypes={[
              "text",
              "text",
              "text",
              "numeric",
              "numeric",
              "numeric",
              "numeric",
            ]}
            headings={[
              "Bundle Name",
              "Type",
              "Status",
              "Impressions",
              "Orders",
              "Revenue",
              "Conv. Rate",
            ]}
            rows={rows}
            sortable={SORTABLE_COLUMNS}
            defaultSortDirection="descending"
            initialSortColumnIndex={5}
            onSort={handleSort}
            hasZebraStripingOnData
            increasedTableDensity
          />
        </BlockStack>
      </Card>
    );
  };

  /** Loading skeleton shown while the initial fetch is in progress */
  const renderSkeleton = () => (
    <Layout>
      {/* Usage banner skeleton */}
      <Layout.Section>
        <Card>
          <SkeletonBodyText lines={2} />
        </Card>
      </Layout.Section>

      {/* Metric cards skeleton */}
      <Layout.Section>
        <InlineGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="400">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <BlockStack gap="200">
                <SkeletonBodyText lines={1} />
                <SkeletonBodyText lines={1} />
                <SkeletonBodyText lines={1} />
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>
      </Layout.Section>

      {/* Table skeleton */}
      <Layout.Section>
        <Card>
          <BlockStack gap="400">
            <SkeletonBodyText lines={1} />
            <SkeletonBodyText lines={6} />
          </BlockStack>
        </Card>
      </Layout.Section>
    </Layout>
  );

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <Page
      title="Analytics"
      subtitle="Monitor your bundle performance and revenue"
      backAction={{ onAction: () => router.push("/") }}
      secondaryActions={[
        {
          content: "Refresh",
          onAction: fetchData,
        },
      ]}
    >
      <BlockStack gap="500">
        {/* Error banner */}
        {error && (
          <Banner
            title="Could not load analytics"
            tone="critical"
            onDismiss={() => setError(null)}
          >
            <BlockStack gap="200">
              <Text as="p">{error}</Text>
              <InlineStack gap="200">
                <Button onClick={fetchData}>Try again</Button>
              </InlineStack>
            </BlockStack>
          </Banner>
        )}

        {loading ? (
          renderSkeleton()
        ) : (
          <>
            {/* Usage banner */}
            {renderUsageBanner()}

            {/* Period selector */}
            <InlineStack align="end">
              <div style={{ minWidth: 200 }}>
                <Select
                  label="Time period"
                  labelInline
                  options={PERIOD_OPTIONS}
                  value={period}
                  onChange={setPeriod}
                />
              </div>
            </InlineStack>

            {/* Key metric cards */}
            {renderMetricCards()}

            {/* Bundle performance table */}
            {renderBundleTable()}
          </>
        )}
      </BlockStack>
    </Page>
  );
};

// Server-side check: ensure the shop is installed and redirect accordingly
export async function getServerSideProps(context: any) {
  return await isShopAvailable(context);
}

export default AnalyticsPage;

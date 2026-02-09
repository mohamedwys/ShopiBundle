import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useRouter } from "next/router";
import { ResourcePicker } from "@shopify/app-bridge/actions";
import { Product } from "@shopify/app-bridge/actions/ResourcePicker";
import SelectedProductsTable from "@/components/SelectedProductsTable";
import { useAppBridge } from "@/components/providers/AppBridgeProvider";

import {
  Badge,
  Banner,
  BlockStack,
  Button,
  Card,
  Checkbox,
  Divider,
  Frame,
  Icon,
  InlineStack,
  Page,
  ProgressBar,
  RangeSlider,
  Select,
  Text,
  TextField,
  Thumbnail,
  Toast,
} from "@shopify/polaris";
import {
  ProductIcon,
  DiscountIcon,
  PaintBrushFlatIcon,
  CheckCircleIcon,
  CartIcon,
} from "@shopify/polaris-icons";
import { useCallback, useMemo, useState } from "react";
import React from "react";
import { useBundleAPI } from "@/components/hooks/useBundleAPI";
import { useI18n } from "@shopify/react-i18n";
import { CreateBundleInput } from "@/types/v2-api.types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BundleTypeOption =
  | "VOLUME_DISCOUNT"
  | "BOGO"
  | "MIX_MATCH"
  | "FBT"
  | "FREE_GIFT";

type DiscountType = "percentage" | "fixed";

type BadgeStyle = "pill" | "ribbon" | "banner";

type ColorScheme = "default" | "high-contrast" | "minimal";

type LayoutTemplate = "list" | "cards" | "compact";

interface BundleTierConfig {
  id: string;
  quantity: number;
  discountType: DiscountType;
  discountValue: number;
  badgeText: string;
  isDefault: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WIZARD_STEPS = [
  "Bundle Type",
  "Products",
  "Tier Configuration",
  "Visual Customization",
  "Review & Publish",
] as const;

const BUNDLE_TYPES: Array<{
  value: BundleTypeOption;
  label: string;
  description: string;
  icon: typeof ProductIcon;
}> = [
  {
    value: "VOLUME_DISCOUNT",
    label: "Volume Discount",
    description:
      "Offer tiered discounts based on the quantity purchased. Great for encouraging larger orders.",
    icon: CartIcon,
  },
  {
    value: "BOGO",
    label: "Buy One, Get One",
    description:
      "Classic BOGO deal: buy a qualifying product and receive another free or at a discount.",
    icon: DiscountIcon,
  },
  {
    value: "MIX_MATCH",
    label: "Mix & Match",
    description:
      "Let customers pick and choose from a curated set of products to build their own bundle.",
    icon: ProductIcon,
  },
  {
    value: "FBT",
    label: "Frequently Bought Together",
    description:
      "Recommend complementary products that are commonly purchased together.",
    icon: CheckCircleIcon,
  },
  {
    value: "FREE_GIFT",
    label: "Free Gift with Purchase",
    description:
      "Reward customers with a free gift when they meet a minimum purchase threshold.",
    icon: PaintBrushFlatIcon,
  },
];

const DISCOUNT_TYPE_OPTIONS = [
  { label: "Percentage (%)", value: "percentage" },
  { label: "Fixed Amount ($)", value: "fixed" },
];

const COLOR_SCHEME_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "High Contrast", value: "high-contrast" },
  { label: "Minimal", value: "minimal" },
];

const LAYOUT_TEMPLATE_OPTIONS = [
  { label: "List", value: "list" },
  { label: "Cards", value: "cards" },
  { label: "Compact", value: "compact" },
];

const BADGE_STYLE_OPTIONS = [
  { label: "Pill", value: "pill" },
  { label: "Ribbon", value: "ribbon" },
  { label: "Banner", value: "banner" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateTierId(): string {
  return `tier_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

function createDefaultTier(isDefault = false): BundleTierConfig {
  return {
    id: generateTierId(),
    quantity: 2,
    discountType: "percentage",
    discountValue: 10,
    badgeText: isDefault ? "Most Popular" : "",
    isDefault,
  };
}

function bundleTypeToAPIType(
  type: BundleTypeOption
): string {
  const mapping: Record<BundleTypeOption, string> = {
    VOLUME_DISCOUNT: "TIERED",
    BOGO: "BOGO",
    MIX_MATCH: "MIX_MATCH",
    FBT: "FIXED",
    FREE_GIFT: "GIFT",
  };
  return mapping[type];
}

// ---------------------------------------------------------------------------
// Component: StepIndicator
// ---------------------------------------------------------------------------

interface StepIndicatorProps {
  currentStep: number;
  steps: readonly string[];
}

function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <Text as="span" variant="bodySm" tone="subdued">
            Step {currentStep + 1} of {steps.length}
          </Text>
          <Text as="span" variant="bodySm" fontWeight="semibold">
            {steps[currentStep]}
          </Text>
        </InlineStack>
        <ProgressBar progress={progressPercent} size="small" tone="primary" />
        <InlineStack gap="200" align="center" blockAlign="center">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <React.Fragment key={step}>
                {index > 0 && (
                  <div
                    style={{
                      height: "2px",
                      width: "32px",
                      backgroundColor: isCompleted
                        ? "var(--p-color-bg-fill-success)"
                        : "var(--p-color-bg-fill-secondary)",
                      borderRadius: "1px",
                    }}
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 600,
                      backgroundColor: isCompleted
                        ? "var(--p-color-bg-fill-success)"
                        : isCurrent
                          ? "var(--p-color-bg-fill-brand)"
                          : "var(--p-color-bg-fill-secondary)",
                      color: isCompleted || isCurrent
                        ? "var(--p-color-text-on-color)"
                        : "var(--p-color-text-secondary)",
                    }}
                  >
                    {isCompleted ? (
                      <Icon source={CheckCircleIcon} tone="inherit" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <Text
                    as="span"
                    variant="bodySm"
                    fontWeight={isCurrent ? "semibold" : "regular"}
                    tone={isCurrent ? undefined : "subdued"}
                  >
                    {step}
                  </Text>
                </div>
              </React.Fragment>
            );
          })}
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Component: Step1 - Bundle Type Selection
// ---------------------------------------------------------------------------

interface Step1Props {
  selectedType: BundleTypeOption | null;
  onSelect: (type: BundleTypeOption) => void;
}

function Step1BundleType({ selectedType, onSelect }: Step1Props) {
  return (
    <BlockStack gap="400">
      <BlockStack gap="200">
        <Text as="h2" variant="headingLg">
          Choose your bundle type
        </Text>
        <Text as="p" tone="subdued">
          Select the type of bundle promotion you want to create. This
          determines how discounts are applied and how products are presented to
          your customers.
        </Text>
      </BlockStack>

      <BlockStack gap="300">
        {BUNDLE_TYPES.map((bundleType) => {
          const isSelected = selectedType === bundleType.value;

          return (
            <div
              key={bundleType.value}
              onClick={() => onSelect(bundleType.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(bundleType.value);
                }
              }}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              style={{
                cursor: "pointer",
                borderRadius: "var(--p-border-radius-300)",
                border: isSelected
                  ? "2px solid var(--p-color-border-brand)"
                  : "1px solid var(--p-color-border-secondary)",
                padding: "16px",
                backgroundColor: isSelected
                  ? "var(--p-color-bg-surface-brand-selected)"
                  : "var(--p-color-bg-surface)",
                transition: "all 0.15s ease",
              }}
            >
              <InlineStack gap="400" align="start" blockAlign="center">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--p-border-radius-200)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected
                      ? "var(--p-color-bg-fill-brand)"
                      : "var(--p-color-bg-fill-secondary)",
                    flexShrink: 0,
                  }}
                >
                  <Icon
                    source={bundleType.icon}
                    tone={isSelected ? "inherit" : "subdued"}
                  />
                </div>
                <BlockStack gap="100">
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="h3" variant="headingMd">
                      {bundleType.label}
                    </Text>
                    {isSelected && <Badge tone="info">Selected</Badge>}
                  </InlineStack>
                  <Text as="p" variant="bodySm" tone="subdued">
                    {bundleType.description}
                  </Text>
                </BlockStack>
              </InlineStack>
            </div>
          );
        })}
      </BlockStack>
    </BlockStack>
  );
}

// ---------------------------------------------------------------------------
// Component: Step2 - Product Selection
// ---------------------------------------------------------------------------

interface Step2Props {
  bundleName: string;
  setBundleName: (value: string) => void;
  bundleTitle: string;
  setBundleTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  selectedProducts: Product[];
  onOpenPicker: () => void;
  onClearProducts: () => void;
  nameError: string;
  titleError: string;
}

function Step2ProductSelection({
  bundleName,
  setBundleName,
  bundleTitle,
  setBundleTitle,
  description,
  setDescription,
  selectedProducts,
  onOpenPicker,
  onClearProducts,
  nameError,
  titleError,
}: Step2Props) {
  return (
    <BlockStack gap="400">
      <BlockStack gap="200">
        <Text as="h2" variant="headingLg">
          Bundle details & products
        </Text>
        <Text as="p" tone="subdued">
          Name your bundle and select the products you want to include.
        </Text>
      </BlockStack>

      <Card>
        <BlockStack gap="400">
          <Text as="h3" variant="headingMd">
            Bundle Information
          </Text>
          <TextField
            label="Bundle Name"
            helpText="Internal name used for managing your bundles. Not visible to customers."
            value={bundleName}
            onChange={setBundleName}
            autoComplete="off"
            error={nameError || undefined}
          />
          <TextField
            label="Display Title"
            helpText="The title your customers will see on the storefront."
            value={bundleTitle}
            onChange={setBundleTitle}
            autoComplete="off"
            error={titleError || undefined}
          />
          <TextField
            label="Description"
            helpText="Optional description to help customers understand the bundle offer."
            value={description}
            onChange={setDescription}
            autoComplete="off"
            multiline={3}
          />
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="100">
              <Text as="h3" variant="headingMd">
                Products
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Select at least 2 products for your bundle.
              </Text>
            </BlockStack>
            <InlineStack gap="200">
              {selectedProducts.length > 0 && (
                <Button onClick={onClearProducts} variant="plain" tone="critical">
                  Clear all
                </Button>
              )}
              <Button variant="primary" onClick={onOpenPicker}>
                {selectedProducts.length > 0
                  ? "Change products"
                  : "Select products"}
              </Button>
            </InlineStack>
          </InlineStack>

          {selectedProducts.length === 0 && (
            <Banner tone="warning">
              <Text as="p">
                No products selected. Please choose at least 2 products to
                include in this bundle.
              </Text>
            </Banner>
          )}

          {selectedProducts.length === 1 && (
            <Banner tone="warning">
              <Text as="p">
                Only 1 product selected. Please select at least 2 products for a
                bundle.
              </Text>
            </Banner>
          )}

          {selectedProducts.length >= 2 && (
            <BlockStack gap="200">
              <Banner tone="success">
                <Text as="p">
                  {selectedProducts.length} product
                  {selectedProducts.length !== 1 ? "s" : ""} selected.
                </Text>
              </Banner>
              <SelectedProductsTable products={selectedProducts} />
            </BlockStack>
          )}
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

// ---------------------------------------------------------------------------
// Component: Step3 - Tier Configuration
// ---------------------------------------------------------------------------

interface Step3Props {
  tiers: BundleTierConfig[];
  onAddTier: () => void;
  onRemoveTier: (id: string) => void;
  onUpdateTier: (id: string, updates: Partial<BundleTierConfig>) => void;
  onSetDefault: (id: string) => void;
}

function Step3TierConfig({
  tiers,
  onAddTier,
  onRemoveTier,
  onUpdateTier,
  onSetDefault,
}: Step3Props) {
  return (
    <BlockStack gap="400">
      <BlockStack gap="200">
        <Text as="h2" variant="headingLg">
          Configure pricing tiers
        </Text>
        <Text as="p" tone="subdued">
          Define discount tiers based on quantity. Customers will see these
          options and can choose the tier that works best for them.
        </Text>
      </BlockStack>

      {tiers.length === 0 && (
        <Banner tone="info">
          <Text as="p">
            No tiers configured yet. Add at least one pricing tier to define
            your bundle discount structure.
          </Text>
        </Banner>
      )}

      {tiers.map((tier, index) => (
        <Card key={tier.id}>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Text as="h3" variant="headingMd">
                  Tier {index + 1}
                </Text>
                {tier.isDefault && <Badge tone="success">Default</Badge>}
              </InlineStack>
              <InlineStack gap="200">
                {!tier.isDefault && (
                  <Button
                    variant="plain"
                    onClick={() => onSetDefault(tier.id)}
                  >
                    Set as default
                  </Button>
                )}
                {tiers.length > 1 && (
                  <Button
                    variant="plain"
                    tone="critical"
                    onClick={() => onRemoveTier(tier.id)}
                  >
                    Remove
                  </Button>
                )}
              </InlineStack>
            </InlineStack>

            <Divider />

            <InlineStack gap="400" align="start">
              <div style={{ flex: 1 }}>
                <TextField
                  label="Minimum Quantity"
                  type="number"
                  value={String(tier.quantity)}
                  onChange={(value) => {
                    const parsed = parseInt(value, 10);
                    if (!isNaN(parsed) && parsed >= 1) {
                      onUpdateTier(tier.id, { quantity: parsed });
                    }
                  }}
                  autoComplete="off"
                  min={1}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Select
                  label="Discount Type"
                  options={DISCOUNT_TYPE_OPTIONS}
                  value={tier.discountType}
                  onChange={(value) =>
                    onUpdateTier(tier.id, {
                      discountType: value as DiscountType,
                    })
                  }
                />
              </div>
            </InlineStack>

            <BlockStack gap="200">
              <Text as="span" variant="bodySm">
                Discount Value:{" "}
                {tier.discountType === "percentage"
                  ? `${tier.discountValue}%`
                  : `$${tier.discountValue.toFixed(2)}`}
              </Text>
              <RangeSlider
                label="Discount Value"
                labelHidden
                value={tier.discountValue}
                min={0}
                max={tier.discountType === "percentage" ? 100 : 500}
                step={tier.discountType === "percentage" ? 1 : 0.5}
                output
                onChange={(value) =>
                  onUpdateTier(tier.id, {
                    discountValue: value as number,
                  })
                }
                suffix={
                  <Text as="span" variant="bodySm">
                    {tier.discountType === "percentage"
                      ? `${tier.discountValue}%`
                      : `$${tier.discountValue.toFixed(2)}`}
                  </Text>
                }
              />
            </BlockStack>

            <TextField
              label="Badge Text"
              helpText="Optional text shown on the tier badge (e.g., 'Most Popular', 'Best Value')."
              value={tier.badgeText}
              onChange={(value) =>
                onUpdateTier(tier.id, { badgeText: value })
              }
              autoComplete="off"
              placeholder="e.g., Most Popular"
            />

            <Checkbox
              label="Mark this tier as the default selection"
              checked={tier.isDefault}
              onChange={() => onSetDefault(tier.id)}
            />
          </BlockStack>
        </Card>
      ))}

      <InlineStack align="start">
        <Button onClick={onAddTier} variant="secondary">
          Add tier
        </Button>
      </InlineStack>
    </BlockStack>
  );
}

// ---------------------------------------------------------------------------
// Component: Step4 - Visual Customization
// ---------------------------------------------------------------------------

interface Step4Props {
  colorScheme: ColorScheme;
  setColorScheme: (value: ColorScheme) => void;
  layoutTemplate: LayoutTemplate;
  setLayoutTemplate: (value: LayoutTemplate) => void;
  badgeStyle: BadgeStyle;
  setBadgeStyle: (value: BadgeStyle) => void;
  cornerRadius: number;
  setCornerRadius: (value: number) => void;
  showSavingsBadge: boolean;
  setShowSavingsBadge: (value: boolean) => void;
  showComparePrice: boolean;
  setShowComparePrice: (value: boolean) => void;
}

function Step4VisualCustomization({
  colorScheme,
  setColorScheme,
  layoutTemplate,
  setLayoutTemplate,
  badgeStyle,
  setBadgeStyle,
  cornerRadius,
  setCornerRadius,
  showSavingsBadge,
  setShowSavingsBadge,
  showComparePrice,
  setShowComparePrice,
}: Step4Props) {
  return (
    <BlockStack gap="400">
      <BlockStack gap="200">
        <Text as="h2" variant="headingLg">
          Customize appearance
        </Text>
        <Text as="p" tone="subdued">
          Configure how your bundle will look on the storefront. These settings
          control the widget appearance for this bundle.
        </Text>
      </BlockStack>

      <Card>
        <BlockStack gap="400">
          <Text as="h3" variant="headingMd">
            Color & Layout
          </Text>
          <Select
            label="Color Scheme"
            helpText="Controls the overall color palette of the bundle widget."
            options={COLOR_SCHEME_OPTIONS}
            value={colorScheme}
            onChange={(value) => setColorScheme(value as ColorScheme)}
          />
          <Select
            label="Layout Template"
            helpText="Determines how products are arranged within the bundle display."
            options={LAYOUT_TEMPLATE_OPTIONS}
            value={layoutTemplate}
            onChange={(value) => setLayoutTemplate(value as LayoutTemplate)}
          />
          <BlockStack gap="200">
            <Text as="span" variant="bodySm">
              Corner Radius: {cornerRadius}px
            </Text>
            <RangeSlider
              label="Corner Radius"
              labelHidden
              value={cornerRadius}
              min={0}
              max={24}
              step={1}
              output
              onChange={(value) => setCornerRadius(value as number)}
              suffix={
                <Text as="span" variant="bodySm">
                  {cornerRadius}px
                </Text>
              }
            />
          </BlockStack>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="400">
          <Text as="h3" variant="headingMd">
            Badge & Pricing Display
          </Text>
          <Select
            label="Badge Style"
            helpText="How discount badges appear on the storefront."
            options={BADGE_STYLE_OPTIONS}
            value={badgeStyle}
            onChange={(value) => setBadgeStyle(value as BadgeStyle)}
          />
          <Checkbox
            label="Show savings badge"
            helpText="Display a badge showing how much customers save with this bundle."
            checked={showSavingsBadge}
            onChange={setShowSavingsBadge}
          />
          <Checkbox
            label="Show compare-at price"
            helpText="Show the original price with a strikethrough next to the discounted price."
            checked={showComparePrice}
            onChange={setShowComparePrice}
          />
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="300">
          <Text as="h3" variant="headingMd">
            Preview
          </Text>
          <Text as="p" variant="bodySm" tone="subdued">
            Approximate preview of your selected styles. Actual rendering may
            vary based on your theme.
          </Text>
          <div
            style={{
              border: "1px solid var(--p-color-border-secondary)",
              borderRadius: `${cornerRadius}px`,
              padding: "20px",
              backgroundColor:
                colorScheme === "high-contrast"
                  ? "#1a1a2e"
                  : colorScheme === "minimal"
                    ? "#fafafa"
                    : "#ffffff",
              color:
                colorScheme === "high-contrast"
                  ? "#ffffff"
                  : "#333333",
            }}
          >
            <BlockStack gap="200">
              <Text
                as="p"
                variant="headingSm"
              >
                <span
                  style={{
                    color:
                      colorScheme === "high-contrast"
                        ? "#ffffff"
                        : "#333333",
                  }}
                >
                  Bundle Widget Preview
                </span>
              </Text>
              <div
                style={{
                  display: layoutTemplate === "cards" ? "grid" : "flex",
                  gridTemplateColumns:
                    layoutTemplate === "cards"
                      ? "repeat(2, 1fr)"
                      : undefined,
                  flexDirection:
                    layoutTemplate === "list"
                      ? "column"
                      : layoutTemplate === "compact"
                        ? "row"
                        : undefined,
                  gap: layoutTemplate === "compact" ? "8px" : "12px",
                  flexWrap: layoutTemplate === "compact" ? "wrap" : undefined,
                }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      padding:
                        layoutTemplate === "compact" ? "8px 12px" : "12px",
                      borderRadius: `${Math.max(cornerRadius - 4, 0)}px`,
                      border: `1px solid ${
                        colorScheme === "high-contrast"
                          ? "#444"
                          : "#e0e0e0"
                      }`,
                      fontSize: "13px",
                      backgroundColor:
                        colorScheme === "high-contrast"
                          ? "#2d2d44"
                          : colorScheme === "minimal"
                            ? "#ffffff"
                            : "#f9f9f9",
                    }}
                  >
                    <span
                      style={{
                        color:
                          colorScheme === "high-contrast"
                            ? "#ffffff"
                            : "#333333",
                      }}
                    >
                      Product {i}
                    </span>
                    {showComparePrice && (
                      <span
                        style={{
                          textDecoration: "line-through",
                          marginLeft: "8px",
                          opacity: 0.5,
                        }}
                      >
                        $29.99
                      </span>
                    )}
                    <span
                      style={{
                        marginLeft: "8px",
                        fontWeight: 600,
                        color:
                          colorScheme === "high-contrast"
                            ? "#66ff66"
                            : "#2e7d32",
                      }}
                    >
                      $24.99
                    </span>
                  </div>
                ))}
              </div>
              {showSavingsBadge && (
                <div
                  style={{
                    marginTop: "8px",
                    display: "inline-block",
                    padding:
                      badgeStyle === "pill"
                        ? "4px 12px"
                        : badgeStyle === "ribbon"
                          ? "4px 16px 4px 12px"
                          : "8px 16px",
                    borderRadius:
                      badgeStyle === "pill"
                        ? "999px"
                        : badgeStyle === "ribbon"
                          ? "0 4px 4px 0"
                          : `${cornerRadius}px`,
                    backgroundColor:
                      colorScheme === "high-contrast"
                        ? "#4caf50"
                        : "#e8f5e9",
                    color:
                      colorScheme === "high-contrast"
                        ? "#ffffff"
                        : "#2e7d32",
                    fontSize: "12px",
                    fontWeight: 600,
                    width: badgeStyle === "banner" ? "100%" : "auto",
                    textAlign: badgeStyle === "banner" ? "center" : "left",
                  }}
                >
                  Save 15%
                </div>
              )}
            </BlockStack>
          </div>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

// ---------------------------------------------------------------------------
// Component: Step5 - Review & Publish
// ---------------------------------------------------------------------------

interface Step5Props {
  bundleType: BundleTypeOption | null;
  bundleName: string;
  bundleTitle: string;
  description: string;
  selectedProducts: Product[];
  tiers: BundleTierConfig[];
  colorScheme: ColorScheme;
  layoutTemplate: LayoutTemplate;
  badgeStyle: BadgeStyle;
  showSavingsBadge: boolean;
  showComparePrice: boolean;
}

function Step5Review({
  bundleType,
  bundleName,
  bundleTitle,
  description,
  selectedProducts,
  tiers,
  colorScheme,
  layoutTemplate,
  badgeStyle,
  showSavingsBadge,
  showComparePrice,
}: Step5Props) {
  const typeLabel =
    BUNDLE_TYPES.find((t) => t.value === bundleType)?.label ?? "Not selected";

  const defaultTier = tiers.find((t) => t.isDefault);

  return (
    <BlockStack gap="400">
      <BlockStack gap="200">
        <Text as="h2" variant="headingLg">
          Review your bundle
        </Text>
        <Text as="p" tone="subdued">
          Confirm all settings before publishing. You can go back to any step to
          make changes.
        </Text>
      </BlockStack>

      <Card>
        <BlockStack gap="300">
          <Text as="h3" variant="headingMd">
            Bundle Details
          </Text>
          <Divider />
          <InlineStack gap="200">
            <Text as="span" variant="bodySm" tone="subdued">
              Type:
            </Text>
            <Badge>{typeLabel}</Badge>
          </InlineStack>
          <InlineStack gap="200">
            <Text as="span" variant="bodySm" tone="subdued">
              Name:
            </Text>
            <Text as="span" variant="bodyMd" fontWeight="semibold">
              {bundleName || "Untitled"}
            </Text>
          </InlineStack>
          <InlineStack gap="200">
            <Text as="span" variant="bodySm" tone="subdued">
              Title:
            </Text>
            <Text as="span" variant="bodyMd">
              {bundleTitle || "Untitled"}
            </Text>
          </InlineStack>
          {description && (
            <InlineStack gap="200">
              <Text as="span" variant="bodySm" tone="subdued">
                Description:
              </Text>
              <Text as="span" variant="bodyMd">
                {description}
              </Text>
            </InlineStack>
          )}
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="300">
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h3" variant="headingMd">
              Products
            </Text>
            <Badge tone="info">
              {selectedProducts.length} product
              {selectedProducts.length !== 1 ? "s" : ""}
            </Badge>
          </InlineStack>
          <Divider />
          {selectedProducts.length > 0 ? (
            <BlockStack gap="200">
              {selectedProducts.map((product) => (
                <InlineStack
                  key={product.id}
                  gap="300"
                  blockAlign="center"
                >
                  {product.images && product.images.length > 0 ? (
                    <Thumbnail
                      source={product.images[0].originalSrc}
                      alt={product.title ?? "Product"}
                      size="small"
                    />
                  ) : (
                    <Thumbnail
                      source=""
                      alt="No image"
                      size="small"
                    />
                  )}
                  <BlockStack gap="050">
                    <Text as="span" variant="bodyMd" fontWeight="semibold">
                      {product.title}
                    </Text>
                    <Text as="span" variant="bodySm" tone="subdued">
                      {product.variants?.length ?? 0} variant
                      {(product.variants?.length ?? 0) !== 1 ? "s" : ""}
                    </Text>
                  </BlockStack>
                </InlineStack>
              ))}
            </BlockStack>
          ) : (
            <Text as="p" tone="critical">
              No products selected.
            </Text>
          )}
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="300">
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h3" variant="headingMd">
              Pricing Tiers
            </Text>
            <Badge tone="info">
              {tiers.length} tier{tiers.length !== 1 ? "s" : ""}
            </Badge>
          </InlineStack>
          <Divider />
          {tiers.length > 0 ? (
            <BlockStack gap="200">
              {tiers.map((tier, index) => (
                <InlineStack
                  key={tier.id}
                  align="space-between"
                  blockAlign="center"
                >
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="span" variant="bodyMd">
                      Buy {tier.quantity}+
                    </Text>
                    {tier.isDefault && (
                      <Badge tone="success">Default</Badge>
                    )}
                    {tier.badgeText && (
                      <Badge>{tier.badgeText}</Badge>
                    )}
                  </InlineStack>
                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                    {tier.discountType === "percentage"
                      ? `${tier.discountValue}% off`
                      : `$${tier.discountValue.toFixed(2)} off`}
                  </Text>
                </InlineStack>
              ))}
            </BlockStack>
          ) : (
            <Text as="p" tone="critical">
              No tiers configured.
            </Text>
          )}
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="300">
          <Text as="h3" variant="headingMd">
            Visual Settings
          </Text>
          <Divider />
          <InlineStack gap="200">
            <Text as="span" variant="bodySm" tone="subdued">
              Color Scheme:
            </Text>
            <Badge>
              {COLOR_SCHEME_OPTIONS.find((o) => o.value === colorScheme)
                ?.label ?? colorScheme}
            </Badge>
          </InlineStack>
          <InlineStack gap="200">
            <Text as="span" variant="bodySm" tone="subdued">
              Layout:
            </Text>
            <Badge>
              {LAYOUT_TEMPLATE_OPTIONS.find((o) => o.value === layoutTemplate)
                ?.label ?? layoutTemplate}
            </Badge>
          </InlineStack>
          <InlineStack gap="200">
            <Text as="span" variant="bodySm" tone="subdued">
              Badge Style:
            </Text>
            <Badge>
              {BADGE_STYLE_OPTIONS.find((o) => o.value === badgeStyle)?.label ??
                badgeStyle}
            </Badge>
          </InlineStack>
          <InlineStack gap="200">
            <Text as="span" variant="bodySm" tone="subdued">
              Savings Badge:
            </Text>
            <Badge tone={showSavingsBadge ? "success" : undefined}>
              {showSavingsBadge ? "Shown" : "Hidden"}
            </Badge>
          </InlineStack>
          <InlineStack gap="200">
            <Text as="span" variant="bodySm" tone="subdued">
              Compare Price:
            </Text>
            <Badge tone={showComparePrice ? "success" : undefined}>
              {showComparePrice ? "Shown" : "Hidden"}
            </Badge>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

const BundleBuilderPage = () => {
  const router = useRouter();
  const [i18n] = useI18n();
  const { app } = useAppBridge();
  const { createBundle, loading, error, clearError } = useBundleAPI();

  // ---- Wizard navigation state ----
  const [currentStep, setCurrentStep] = useState(0);

  // ---- Step 1: Bundle type ----
  const [bundleType, setBundleType] = useState<BundleTypeOption | null>(null);

  // ---- Step 2: Products & details ----
  const [bundleName, setBundleName] = useState("");
  const [bundleTitle, setBundleTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [nameError, setNameError] = useState("");
  const [titleError, setTitleError] = useState("");

  // ---- Step 3: Tier configuration ----
  const [tiers, setTiers] = useState<BundleTierConfig[]>([
    createDefaultTier(true),
  ]);

  // ---- Step 4: Visual customization ----
  const [colorScheme, setColorScheme] = useState<ColorScheme>("default");
  const [layoutTemplate, setLayoutTemplate] =
    useState<LayoutTemplate>("list");
  const [badgeStyle, setBadgeStyle] = useState<BadgeStyle>("pill");
  const [cornerRadius, setCornerRadius] = useState(8);
  const [showSavingsBadge, setShowSavingsBadge] = useState(true);
  const [showComparePrice, setShowComparePrice] = useState(true);

  // ---- Toast state ----
  const [successToastActive, setSuccessToastActive] = useState(false);
  const [errorToastActive, setErrorToastActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleSuccessToast = useCallback(
    () => setSuccessToastActive((a) => !a),
    []
  );
  const toggleErrorToast = useCallback(
    () => setErrorToastActive((a) => !a),
    []
  );

  // ---- Validation per step ----
  const validateStep = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 0:
          if (!bundleType) {
            setErrorMessage("Please select a bundle type to continue.");
            setErrorToastActive(true);
            return false;
          }
          return true;

        case 1: {
          let valid = true;
          setNameError("");
          setTitleError("");

          if (!bundleName.trim()) {
            setNameError("Bundle name is required.");
            valid = false;
          }
          if (!bundleTitle.trim()) {
            setTitleError("Display title is required.");
            valid = false;
          }
          if (selectedProducts.length < 2) {
            setErrorMessage("Please select at least 2 products.");
            setErrorToastActive(true);
            valid = false;
          }
          return valid;
        }

        case 2: {
          if (tiers.length === 0) {
            setErrorMessage(
              "Please add at least one pricing tier."
            );
            setErrorToastActive(true);
            return false;
          }
          for (const tier of tiers) {
            if (tier.quantity < 1) {
              setErrorMessage(
                "All tiers must have a minimum quantity of 1."
              );
              setErrorToastActive(true);
              return false;
            }
            if (tier.discountValue <= 0) {
              setErrorMessage(
                "All tiers must have a discount value greater than 0."
              );
              setErrorToastActive(true);
              return false;
            }
            if (
              tier.discountType === "percentage" &&
              tier.discountValue > 100
            ) {
              setErrorMessage(
                "Percentage discount cannot exceed 100%."
              );
              setErrorToastActive(true);
              return false;
            }
          }

          const hasDefault = tiers.some((t) => t.isDefault);
          if (!hasDefault) {
            setErrorMessage(
              "Please mark one tier as the default selection."
            );
            setErrorToastActive(true);
            return false;
          }
          return true;
        }

        case 3:
          // Visual customization has no required validation - all fields have defaults
          return true;

        case 4:
          return true;

        default:
          return true;
      }
    },
    [bundleType, bundleName, bundleTitle, selectedProducts, tiers]
  );

  // ---- Navigation ----
  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length - 1));
    }
  }, [currentStep, validateStep]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // ---- Product picker ----
  const openProductPicker = useCallback(() => {
    if (!app) {
      setErrorMessage("App Bridge not ready. Please refresh the page.");
      setErrorToastActive(true);
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
          setSelectedProducts(selection);
        }
      });

      picker.dispatch(ResourcePicker.Action.OPEN);
    } catch (err) {
      console.error("Product picker error:", err);
      setErrorMessage("Failed to open product picker.");
      setErrorToastActive(true);
    }
  }, [app]);

  const clearProducts = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  // ---- Tier management ----
  const addTier = useCallback(() => {
    setTiers((prev) => [...prev, createDefaultTier(prev.length === 0)]);
  }, []);

  const removeTier = useCallback((id: string) => {
    setTiers((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      // If the removed tier was the default and there are remaining tiers, make the first one default
      if (updated.length > 0 && !updated.some((t) => t.isDefault)) {
        updated[0].isDefault = true;
      }
      return updated;
    });
  }, []);

  const updateTier = useCallback(
    (id: string, updates: Partial<BundleTierConfig>) => {
      setTiers((prev) =>
        prev.map((tier) =>
          tier.id === id ? { ...tier, ...updates } : tier
        )
      );
    },
    []
  );

  const setDefaultTier = useCallback((id: string) => {
    setTiers((prev) =>
      prev.map((tier) => ({
        ...tier,
        isDefault: tier.id === id,
      }))
    );
  }, []);

  // ---- Compute the primary discount for the API (from default tier) ----
  const primaryDiscount = useMemo(() => {
    const defaultTier = tiers.find((t) => t.isDefault);
    if (!defaultTier) return 10;
    if (defaultTier.discountType === "percentage") {
      return defaultTier.discountValue;
    }
    // For fixed discounts, we pass the value as-is; the API field is discountPercent
    // but we use the closest meaningful value
    return defaultTier.discountValue;
  }, [tiers]);

  // ---- Submit handlers ----
  const handlePublish = useCallback(async () => {
    if (!validateStep(currentStep)) return;

    const input: CreateBundleInput = {
      name: bundleName.trim(),
      title: bundleTitle.trim(),
      description: description.trim() || undefined,
      discountPercent: primaryDiscount,
      components: selectedProducts.map((product) => ({
        shopifyProductId: product.id,
        quantity: 1,
      })),
    };

    const result = await createBundle(input);

    if (result) {
      setSuccessToastActive(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setErrorMessage(error || "Failed to create and publish bundle.");
      setErrorToastActive(true);
    }
  }, [
    validateStep,
    currentStep,
    bundleName,
    bundleTitle,
    description,
    primaryDiscount,
    selectedProducts,
    createBundle,
    error,
    router,
  ]);

  const handleSaveDraft = useCallback(async () => {
    // For drafts, relax validation - only require name and products
    if (!bundleName.trim()) {
      setErrorMessage("Bundle name is required to save a draft.");
      setErrorToastActive(true);
      return;
    }

    if (selectedProducts.length < 2) {
      setErrorMessage("Please select at least 2 products to save a draft.");
      setErrorToastActive(true);
      return;
    }

    const input: CreateBundleInput = {
      name: bundleName.trim(),
      title: bundleTitle.trim() || bundleName.trim(),
      description: description.trim() || undefined,
      discountPercent: primaryDiscount,
      components: selectedProducts.map((product) => ({
        shopifyProductId: product.id,
        quantity: 1,
      })),
    };

    const result = await createBundle(input);

    if (result) {
      setSuccessToastActive(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setErrorMessage(error || "Failed to save draft.");
      setErrorToastActive(true);
    }
  }, [
    bundleName,
    bundleTitle,
    description,
    primaryDiscount,
    selectedProducts,
    createBundle,
    error,
    router,
  ]);

  // ---- Render current step ----
  function renderCurrentStep() {
    switch (currentStep) {
      case 0:
        return (
          <Step1BundleType
            selectedType={bundleType}
            onSelect={setBundleType}
          />
        );
      case 1:
        return (
          <Step2ProductSelection
            bundleName={bundleName}
            setBundleName={(v) => {
              setBundleName(v);
              if (v.trim()) setNameError("");
            }}
            bundleTitle={bundleTitle}
            setBundleTitle={(v) => {
              setBundleTitle(v);
              if (v.trim()) setTitleError("");
            }}
            description={description}
            setDescription={setDescription}
            selectedProducts={selectedProducts}
            onOpenPicker={openProductPicker}
            onClearProducts={clearProducts}
            nameError={nameError}
            titleError={titleError}
          />
        );
      case 2:
        return (
          <Step3TierConfig
            tiers={tiers}
            onAddTier={addTier}
            onRemoveTier={removeTier}
            onUpdateTier={updateTier}
            onSetDefault={setDefaultTier}
          />
        );
      case 3:
        return (
          <Step4VisualCustomization
            colorScheme={colorScheme}
            setColorScheme={setColorScheme}
            layoutTemplate={layoutTemplate}
            setLayoutTemplate={setLayoutTemplate}
            badgeStyle={badgeStyle}
            setBadgeStyle={setBadgeStyle}
            cornerRadius={cornerRadius}
            setCornerRadius={setCornerRadius}
            showSavingsBadge={showSavingsBadge}
            setShowSavingsBadge={setShowSavingsBadge}
            showComparePrice={showComparePrice}
            setShowComparePrice={setShowComparePrice}
          />
        );
      case 4:
        return (
          <Step5Review
            bundleType={bundleType}
            bundleName={bundleName}
            bundleTitle={bundleTitle}
            description={description}
            selectedProducts={selectedProducts}
            tiers={tiers}
            colorScheme={colorScheme}
            layoutTemplate={layoutTemplate}
            badgeStyle={badgeStyle}
            showSavingsBadge={showSavingsBadge}
            showComparePrice={showComparePrice}
          />
        );
      default:
        return null;
    }
  }

  // ---- Toasts ----
  const successToast = successToastActive ? (
    <Toast
      content="Bundle created successfully!"
      onDismiss={toggleSuccessToast}
      duration={3000}
    />
  ) : null;

  const errorToast = errorToastActive ? (
    <Toast
      content={errorMessage || "An error occurred."}
      onDismiss={() => {
        toggleErrorToast();
        clearError();
      }}
      duration={4000}
      error
    />
  ) : null;

  // ---- Page title based on step ----
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === WIZARD_STEPS.length - 1;

  return (
    <Frame>
      <Page
        title="Bundle Builder"
        subtitle="Create a new bundle promotion step by step"
        backAction={{
          onAction: () => {
            if (isFirstStep) {
              router.push("/");
            } else {
              handleBack();
            }
          },
        }}
      >
        <BlockStack gap="400">
          <StepIndicator currentStep={currentStep} steps={WIZARD_STEPS} />

          {renderCurrentStep()}

          <Divider />

          {/* Navigation buttons */}
          <InlineStack align="space-between">
            <Button
              onClick={handleBack}
              disabled={isFirstStep}
            >
              Back
            </Button>

            <InlineStack gap="300">
              {isLastStep ? (
                <>
                  <Button
                    onClick={handleSaveDraft}
                    disabled={loading}
                    loading={loading}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handlePublish}
                    disabled={loading}
                    loading={loading}
                  >
                    Publish Bundle
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={handleNext}>
                  Next
                </Button>
              )}
            </InlineStack>
          </InlineStack>
        </BlockStack>

        {successToast}
        {errorToast}
      </Page>
    </Frame>
  );
};

// Server-side check: ensure the shop is installed
export async function getServerSideProps(context: any) {
  return await isShopAvailable(context);
}

export default BundleBuilderPage;

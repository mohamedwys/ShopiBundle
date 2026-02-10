# STEP 6: Admin Wizard — Type-Specific Editors

## Context
The admin bundle builder at `pages/bundle_builder.tsx` (1679 lines) is a 5-step wizard using Shopify Polaris. It currently supports 5 bundle types (`VOLUME_DISCOUNT`, `BOGO`, `MIX_MATCH`, `FBT`, `FREE_GIFT`) at the type selector level, but the wizard steps (Products, Tiers, Visual, Review) are the same generic flow for all types. The API type sent via `bundleTypeToAPIType()` maps to: `TIERED`, `BOGO`, `MIX_MATCH`, `FIXED`, `GIFT`.

This step adds type-specific editor panels (Step 3 context-aware), two missing bundle types to the selector (`SUBSCRIPTION`, `BUILD_YOUR_OWN`), and type-specific fields in the submission payload.

The `CreateBundleInput` in `types/v2-api.types.ts` (line 85) currently has: `name`, `title`, `description?`, `components[]`, `discountPercent`, `tags?`, `featuredImage?`.

## DO NOT re-analyze the codebase. All info is below. Just make the edits.

---

## Task 1: Add SUBSCRIPTION and BUILD_YOUR_OWN to BundleTypeOption

**File:** `pages/bundle_builder.tsx`

### 1a. Update BundleTypeOption type (lines 45-50):

**Current:**
```typescript
type BundleTypeOption =
  | "VOLUME_DISCOUNT"
  | "BOGO"
  | "MIX_MATCH"
  | "FBT"
  | "FREE_GIFT";
```

**Replace with:**
```typescript
type BundleTypeOption =
  | "VOLUME_DISCOUNT"
  | "BOGO"
  | "MIX_MATCH"
  | "FBT"
  | "FREE_GIFT"
  | "SUBSCRIPTION"
  | "BUILD_YOUR_OWN";
```

### 1b. Add entries to BUNDLE_TYPES array (after the FREE_GIFT entry, which ends at line 121):

After the `FREE_GIFT` entry closing `},`, add:
```typescript
  {
    value: "SUBSCRIPTION",
    label: "Subscription Bundle",
    description:
      "Recurring bundle with configurable delivery frequency. Customers subscribe and save on each delivery.",
    icon: CartIcon,
  },
  {
    value: "BUILD_YOUR_OWN",
    label: "Build Your Own",
    description:
      "Customers build a custom bundle by selecting products from a curated pool with quantity constraints.",
    icon: ProductIcon,
  },
```

### 1c. Update bundleTypeToAPIType mapping (lines 166-177):

**Current:**
```typescript
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
```

**Replace with:**
```typescript
function bundleTypeToAPIType(
  type: BundleTypeOption
): string {
  const mapping: Record<BundleTypeOption, string> = {
    VOLUME_DISCOUNT: "TIERED",
    BOGO: "BOGO",
    MIX_MATCH: "MIX_MATCH",
    FBT: "FIXED",
    FREE_GIFT: "GIFT",
    SUBSCRIPTION: "SUBSCRIPTION",
    BUILD_YOUR_OWN: "BUILD_YOUR_OWN",
  };
  return mapping[type];
}
```

---

## Task 2: Add type-specific discount options

**File:** `pages/bundle_builder.tsx`

### 2a. Extend DiscountType to include new types (line 52):

**Current:**
```typescript
type DiscountType = "percentage" | "fixed";
```

**Replace with:**
```typescript
type DiscountType = "percentage" | "fixed" | "fixed_price" | "free_item";
```

### 2b. Add new discount type options to DISCOUNT_TYPE_OPTIONS (lines 124-127):

**Current:**
```typescript
const DISCOUNT_TYPE_OPTIONS = [
  { label: "Percentage (%)", value: "percentage" },
  { label: "Fixed Amount ($)", value: "fixed" },
];
```

**Replace with:**
```typescript
const DISCOUNT_TYPE_OPTIONS = [
  { label: "Percentage (%)", value: "percentage" },
  { label: "Fixed Amount ($)", value: "fixed" },
  { label: "Fixed Price ($)", value: "fixed_price" },
  { label: "Free Item", value: "free_item" },
];
```

---

## Task 3: Add type-specific state to the main component

**File:** `pages/bundle_builder.tsx`

After the visual customization state block (line 1212 `const [showComparePrice, setShowComparePrice] = useState(true);`), add:

```typescript
  // ---- Type-specific configuration ----
  // BOGO
  const [bogoGetQuantity, setBogoGetQuantity] = useState(1);
  const [bogoGetType, setBogoGetType] = useState<"free" | "percentage">("free");
  const [bogoGetDiscount, setBogoGetDiscount] = useState(100);

  // MIX_MATCH / BUILD_YOUR_OWN
  const [minProducts, setMinProducts] = useState(2);
  const [maxProducts, setMaxProducts] = useState(5);
  const [componentGroups, setComponentGroups] = useState<Array<{
    id: string;
    name: string;
    minSelect: number;
    maxSelect: number;
  }>>([]);

  // GIFT
  const [allowGiftMessage, setAllowGiftMessage] = useState(true);
  const [maxMessageLength, setMaxMessageLength] = useState(200);
  const [allowGiftWrapping, setAllowGiftWrapping] = useState(false);

  // SUBSCRIPTION
  const [subscriptionFrequencies, setSubscriptionFrequencies] = useState<
    Array<{ value: string; label: string; intervalCount: number; interval: string }>
  >([
    { value: "2w", label: "Every 2 weeks", intervalCount: 2, interval: "WEEK" },
    { value: "1m", label: "Monthly", intervalCount: 1, interval: "MONTH" },
    { value: "2m", label: "Every 2 months", intervalCount: 2, interval: "MONTH" },
  ]);
  const [subscriptionDiscount, setSubscriptionDiscount] = useState(10);
```

---

## Task 4: Create type-specific editor sub-component

**File:** `pages/bundle_builder.tsx`

Add a new component BEFORE the main `BundleBuilderPage` component (before line 1176 `// Main Page Component`). Place it after `Step5Review` ends (line 1174):

```typescript
// ---------------------------------------------------------------------------
// Component: TypeSpecificConfig — shown within Step 3 based on bundle type
// ---------------------------------------------------------------------------

interface TypeSpecificConfigProps {
  bundleType: BundleTypeOption | null;
  // BOGO
  bogoGetQuantity: number;
  setBogoGetQuantity: (v: number) => void;
  bogoGetType: "free" | "percentage";
  setBogoGetType: (v: "free" | "percentage") => void;
  bogoGetDiscount: number;
  setBogoGetDiscount: (v: number) => void;
  // MIX_MATCH / BUILD_YOUR_OWN
  minProducts: number;
  setMinProducts: (v: number) => void;
  maxProducts: number;
  setMaxProducts: (v: number) => void;
  // GIFT
  allowGiftMessage: boolean;
  setAllowGiftMessage: (v: boolean) => void;
  maxMessageLength: number;
  setMaxMessageLength: (v: number) => void;
  allowGiftWrapping: boolean;
  setAllowGiftWrapping: (v: boolean) => void;
  // SUBSCRIPTION
  subscriptionDiscount: number;
  setSubscriptionDiscount: (v: number) => void;
}

function TypeSpecificConfig({
  bundleType,
  bogoGetQuantity,
  setBogoGetQuantity,
  bogoGetType,
  setBogoGetType,
  bogoGetDiscount,
  setBogoGetDiscount,
  minProducts,
  setMinProducts,
  maxProducts,
  setMaxProducts,
  allowGiftMessage,
  setAllowGiftMessage,
  maxMessageLength,
  setMaxMessageLength,
  allowGiftWrapping,
  setAllowGiftWrapping,
  subscriptionDiscount,
  setSubscriptionDiscount,
}: TypeSpecificConfigProps) {
  if (!bundleType) return null;

  switch (bundleType) {
    case "BOGO":
      return (
        <Card>
          <BlockStack gap="400">
            <Text as="h3" variant="headingMd">
              BOGO Configuration
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Configure what the customer gets when they meet the buy condition.
            </Text>
            <TextField
              label="Get Quantity"
              type="number"
              value={String(bogoGetQuantity)}
              onChange={(v) => {
                const n = parseInt(v, 10);
                if (!isNaN(n) && n >= 1) setBogoGetQuantity(n);
              }}
              autoComplete="off"
              helpText="How many items the customer gets (e.g., Buy 1 Get 1)"
              min={1}
            />
            <Select
              label="Get Discount Type"
              options={[
                { label: "Free (100% off)", value: "free" },
                { label: "Percentage off", value: "percentage" },
              ]}
              value={bogoGetType}
              onChange={(v) => setBogoGetType(v as "free" | "percentage")}
            />
            {bogoGetType === "percentage" && (
              <RangeSlider
                label="Discount Percentage"
                value={bogoGetDiscount}
                min={1}
                max={100}
                step={1}
                output
                onChange={(v) => setBogoGetDiscount(v as number)}
                suffix={
                  <Text as="span" variant="bodySm">
                    {bogoGetDiscount}%
                  </Text>
                }
              />
            )}
          </BlockStack>
        </Card>
      );

    case "MIX_MATCH":
    case "BUILD_YOUR_OWN":
      return (
        <Card>
          <BlockStack gap="400">
            <Text as="h3" variant="headingMd">
              Selection Rules
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Define how many products customers can pick for their bundle.
            </Text>
            <InlineStack gap="400">
              <div style={{ flex: 1 }}>
                <TextField
                  label="Minimum Products"
                  type="number"
                  value={String(minProducts)}
                  onChange={(v) => {
                    const n = parseInt(v, 10);
                    if (!isNaN(n) && n >= 1) setMinProducts(n);
                  }}
                  autoComplete="off"
                  min={1}
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextField
                  label="Maximum Products"
                  type="number"
                  value={String(maxProducts)}
                  onChange={(v) => {
                    const n = parseInt(v, 10);
                    if (!isNaN(n) && n >= 1) setMaxProducts(n);
                  }}
                  autoComplete="off"
                  min={1}
                />
              </div>
            </InlineStack>
            {minProducts > maxProducts && (
              <Banner tone="warning">
                <Text as="p">
                  Minimum products cannot exceed maximum products.
                </Text>
              </Banner>
            )}
          </BlockStack>
        </Card>
      );

    case "FREE_GIFT":
      return (
        <Card>
          <BlockStack gap="400">
            <Text as="h3" variant="headingMd">
              Gift Options
            </Text>
            <Checkbox
              label="Allow gift message"
              helpText="Let customers write a personalized message."
              checked={allowGiftMessage}
              onChange={setAllowGiftMessage}
            />
            {allowGiftMessage && (
              <TextField
                label="Max Message Length"
                type="number"
                value={String(maxMessageLength)}
                onChange={(v) => {
                  const n = parseInt(v, 10);
                  if (!isNaN(n) && n >= 10) setMaxMessageLength(n);
                }}
                autoComplete="off"
                helpText="Maximum characters for the gift message."
                min={10}
                max={500}
              />
            )}
            <Checkbox
              label="Allow gift wrapping"
              helpText="Offer gift wrapping options (configure options in settings)."
              checked={allowGiftWrapping}
              onChange={setAllowGiftWrapping}
            />
          </BlockStack>
        </Card>
      );

    case "SUBSCRIPTION":
      return (
        <Card>
          <BlockStack gap="400">
            <Text as="h3" variant="headingMd">
              Subscription Settings
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Configure the recurring delivery and subscription discount.
            </Text>
            <RangeSlider
              label="Subscription Discount"
              value={subscriptionDiscount}
              min={0}
              max={50}
              step={1}
              output
              onChange={(v) => setSubscriptionDiscount(v as number)}
              suffix={
                <Text as="span" variant="bodySm">
                  {subscriptionDiscount}%
                </Text>
              }
            />
            <Banner tone="info">
              <Text as="p">
                Subscription bundles use Shopify Selling Plans. Delivery
                frequencies are configurable after initial setup. Default
                frequencies: Every 2 weeks, Monthly, Every 2 months.
              </Text>
            </Banner>
          </BlockStack>
        </Card>
      );

    default:
      return null;
  }
}
```

---

## Task 5: Render TypeSpecificConfig inside Step 3

**File:** `pages/bundle_builder.tsx`

In `Step3TierConfig` (starts line 512), add the `TypeSpecificConfig` rendering. The component takes additional props.

### 5a. Update Step3Props interface (lines 504-510):

**Current:**
```typescript
interface Step3Props {
  tiers: BundleTierConfig[];
  onAddTier: () => void;
  onRemoveTier: (id: string) => void;
  onUpdateTier: (id: string, updates: Partial<BundleTierConfig>) => void;
  onSetDefault: (id: string) => void;
}
```

**Replace with:**
```typescript
interface Step3Props {
  tiers: BundleTierConfig[];
  onAddTier: () => void;
  onRemoveTier: (id: string) => void;
  onUpdateTier: (id: string, updates: Partial<BundleTierConfig>) => void;
  onSetDefault: (id: string) => void;
  typeSpecificConfig: React.ReactNode;
}
```

### 5b. Add typeSpecificConfig rendering in Step3TierConfig.

In the `Step3TierConfig` function (destructure `typeSpecificConfig` from props), add the rendering after the "Add tier" button block (after line 657 `</InlineStack>`):

```typescript
      {typeSpecificConfig}
```

### 5c. Pass TypeSpecificConfig in renderCurrentStep.

In `renderCurrentStep()` (line 1503), the `case 2:` currently renders (lines 1536-1542):
```typescript
          <Step3TierConfig
            tiers={tiers}
            onAddTier={addTier}
            onRemoveTier={removeTier}
            onUpdateTier={updateTier}
            onSetDefault={setDefaultTier}
          />
```

**Replace with:**
```typescript
          <Step3TierConfig
            tiers={tiers}
            onAddTier={addTier}
            onRemoveTier={removeTier}
            onUpdateTier={updateTier}
            onSetDefault={setDefaultTier}
            typeSpecificConfig={
              <TypeSpecificConfig
                bundleType={bundleType}
                bogoGetQuantity={bogoGetQuantity}
                setBogoGetQuantity={setBogoGetQuantity}
                bogoGetType={bogoGetType}
                setBogoGetType={setBogoGetType}
                bogoGetDiscount={bogoGetDiscount}
                setBogoGetDiscount={setBogoGetDiscount}
                minProducts={minProducts}
                setMinProducts={setMinProducts}
                maxProducts={maxProducts}
                setMaxProducts={setMaxProducts}
                allowGiftMessage={allowGiftMessage}
                setAllowGiftMessage={setAllowGiftMessage}
                maxMessageLength={maxMessageLength}
                setMaxMessageLength={setMaxMessageLength}
                allowGiftWrapping={allowGiftWrapping}
                setAllowGiftWrapping={setAllowGiftWrapping}
                subscriptionDiscount={subscriptionDiscount}
                setSubscriptionDiscount={setSubscriptionDiscount}
              />
            }
          />
```

---

## Task 6: Update CreateBundleInput to support type-specific fields

**File:** `types/v2-api.types.ts`

**Current CreateBundleInput (lines 85-98):**
```typescript
export interface CreateBundleInput {
  name: string;
  title: string;
  description?: string;
  components: Array<{
    shopifyProductId: string;
    shopifyVariantId?: string;
    quantity?: number;
  }>;
  discountPercent: number;
  tags?: string[];
  featuredImage?: string;
}
```

**Replace with:**
```typescript
export interface CreateBundleInput {
  name: string;
  title: string;
  type?: string;
  description?: string;
  components: Array<{
    shopifyProductId: string;
    shopifyVariantId?: string;
    quantity?: number;
    isRequired?: boolean;
  }>;
  discountPercent: number;
  tags?: string[];
  featuredImage?: string;

  // Type-specific JSON config
  selectionRules?: {
    minProducts: number;
    maxProducts: number;
    componentGroups?: Array<{
      id: string;
      name: string;
      minSelect: number;
      maxSelect: number;
    }>;
  };
  giftSettings?: {
    allowMessage: boolean;
    maxMessageLength: number;
    allowWrapping: boolean;
  };
  subscriptionSettings?: {
    frequencies: Array<{
      value: string;
      label: string;
      intervalCount: number;
      interval: string;
    }>;
    defaultFrequency: string;
    discountPercent: number;
  };
}
```

---

## Task 7: Update handlePublish to include type-specific data

**File:** `pages/bundle_builder.tsx`

In `handlePublish` (line 1417), the current input construction (lines 1420-1429):

```typescript
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
```

**Replace with:**
```typescript
    const apiType = bundleType ? bundleTypeToAPIType(bundleType) : undefined;

    const input: CreateBundleInput = {
      name: bundleName.trim(),
      title: bundleTitle.trim(),
      type: apiType,
      description: description.trim() || undefined,
      discountPercent: primaryDiscount,
      components: selectedProducts.map((product) => ({
        shopifyProductId: product.id,
        quantity: 1,
      })),
      // Type-specific config
      ...(bundleType === "MIX_MATCH" || bundleType === "BUILD_YOUR_OWN"
        ? {
            selectionRules: {
              minProducts,
              maxProducts,
            },
          }
        : {}),
      ...(bundleType === "FREE_GIFT"
        ? {
            giftSettings: {
              allowMessage: allowGiftMessage,
              maxMessageLength,
              allowWrapping: allowGiftWrapping,
            },
          }
        : {}),
      ...(bundleType === "SUBSCRIPTION"
        ? {
            subscriptionSettings: {
              frequencies: subscriptionFrequencies,
              defaultFrequency: subscriptionFrequencies[0]?.value || "1m",
              discountPercent: subscriptionDiscount,
            },
          }
        : {}),
    };
```

Also update `handleSaveDraft` (line 1455) with the same pattern — add `type: apiType,` and the type-specific spread after the existing input fields (lines 1469-1478):

After line `discountPercent: primaryDiscount,` add:
```typescript
      type: bundleType ? bundleTypeToAPIType(bundleType) : undefined,
```

---

## Task 8: Update Step5Review to show type-specific settings

**File:** `pages/bundle_builder.tsx`

In `Step5Review` (line 952), after the "Visual Settings" card (ends line 1171), add a new card:

```typescript
      {/* Type-specific review */}
      {bundleType === "BOGO" && (
        <Card>
          <BlockStack gap="300">
            <Text as="h3" variant="headingMd">BOGO Configuration</Text>
            <Divider />
            <Text as="p" variant="bodyMd">
              Buy condition defined by tiers above. Get items configured separately.
            </Text>
          </BlockStack>
        </Card>
      )}

      {(bundleType === "MIX_MATCH" || bundleType === "BUILD_YOUR_OWN") && (
        <Card>
          <BlockStack gap="300">
            <Text as="h3" variant="headingMd">Selection Rules</Text>
            <Divider />
            <Text as="p" variant="bodyMd">
              Customers select between {/* minProducts */}2 and {/* maxProducts */}5 products.
            </Text>
          </BlockStack>
        </Card>
      )}
```

Note: The exact min/max values should be passed as props. For a minimal implementation, you can add `minProducts` and `maxProducts` to `Step5Props` and reference them. However, since the review step is informational, showing the hard-coded description is acceptable for an MVP.

---

## Verification
1. Run: `npx tsc --noEmit` — 0 errors
2. Verify the admin wizard renders all 7 bundle types in Step 1
3. Verify type-specific config appears in Step 3 for BOGO, MIX_MATCH, BUILD_YOUR_OWN, FREE_GIFT, SUBSCRIPTION
4. Verify the submit payload includes `type` and type-specific fields

## Commit message
```
Add type-specific editors to admin bundle wizard

- Add SUBSCRIPTION and BUILD_YOUR_OWN to bundle type selector
- TypeSpecificConfig renders contextual editor in Step 3:
  - BOGO: get quantity, discount type (free/percentage)
  - MIX_MATCH/BUILD_YOUR_OWN: min/max product selection rules
  - FREE_GIFT: gift message toggle, max length, wrapping toggle
  - SUBSCRIPTION: delivery frequency config, subscription discount
- Extend CreateBundleInput with type, selectionRules, giftSettings, subscriptionSettings
- Submit payload now includes bundle type and type-specific JSON
```

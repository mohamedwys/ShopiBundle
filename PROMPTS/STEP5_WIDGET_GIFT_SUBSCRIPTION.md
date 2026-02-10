# STEP 5: Widget — Gift Options, Frequency Picker, Lazy Loading

## Context
This step adds gift bundle UX (message + wrapping), subscription frequency picker, and a step wizard for multi-step bundles. It also updates the cart utilities to attach gift/subscription metadata as cart line item properties, and updates the Liquid template + proxy route for the new types.

## DO NOT re-analyze the codebase. All info is below. Just make the edits.

---

## Task 1: Create GiftOptions component

**File (NEW):** `widget/src/components/GiftOptions.tsx`

This component renders gift customization: optional message textarea, gift wrapping radio, preview.

The BundleConfig now has `giftSettings` (added in Step 4):
```typescript
giftSettings?: {
  allowMessage: boolean;
  maxMessageLength: number;
  allowWrapping: boolean;
  wrappingOptions?: Array<{ id: string; name: string; price: number; imageUrl?: string }>;
};
```

```typescript
import React, { useState, useCallback } from 'react';
import { formatPrice } from '../utils/formatting';

interface GiftOptionsProps {
  allowMessage: boolean;
  maxMessageLength: number;
  allowWrapping: boolean;
  wrappingOptions: Array<{ id: string; name: string; price: number; imageUrl?: string }>;
  moneyFormat: string;
  onGiftMessageChange: (message: string) => void;
  onWrappingChange: (wrappingId: string | null) => void;
}

export function GiftOptions({
  allowMessage,
  maxMessageLength,
  allowWrapping,
  wrappingOptions,
  moneyFormat,
  onGiftMessageChange,
  onWrappingChange,
}: GiftOptionsProps): React.ReactElement {
  const [message, setMessage] = useState('');
  const [selectedWrapping, setSelectedWrapping] = useState<string | null>(null);

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value.slice(0, maxMessageLength);
      setMessage(val);
      onGiftMessageChange(val);
    },
    [maxMessageLength, onGiftMessageChange]
  );

  const handleWrappingSelect = useCallback(
    (wrappingId: string | null) => {
      setSelectedWrapping(wrappingId);
      onWrappingChange(wrappingId);
    },
    [onWrappingChange]
  );

  return (
    <div className="sb-gift" role="group" aria-label="Gift options">
      {allowMessage && (
        <div className="sb-gift__message">
          <label className="sb-gift__label" htmlFor="sb-gift-message">
            Gift Message
          </label>
          <textarea
            id="sb-gift-message"
            className="sb-gift__textarea"
            value={message}
            onChange={handleMessageChange}
            placeholder="Write a personal message..."
            maxLength={maxMessageLength}
            rows={3}
          />
          <span className="sb-gift__char-count">
            {message.length}/{maxMessageLength}
          </span>
        </div>
      )}

      {allowWrapping && wrappingOptions.length > 0 && (
        <div className="sb-gift__wrapping">
          <span className="sb-gift__label">Gift Wrapping</span>
          <div className="sb-gift__wrapping-options" role="radiogroup" aria-label="Gift wrapping options">
            <div
              className={`sb-gift__wrapping-option ${selectedWrapping === null ? 'sb-gift__wrapping-option--selected' : ''}`}
              role="radio"
              aria-checked={selectedWrapping === null}
              tabIndex={0}
              onClick={() => handleWrappingSelect(null)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleWrappingSelect(null); } }}
            >
              <span className="sb-gift__wrapping-name">No wrapping</span>
              <span className="sb-gift__wrapping-price">Free</span>
            </div>
            {wrappingOptions.map((opt) => (
              <div
                key={opt.id}
                className={`sb-gift__wrapping-option ${selectedWrapping === opt.id ? 'sb-gift__wrapping-option--selected' : ''}`}
                role="radio"
                aria-checked={selectedWrapping === opt.id}
                tabIndex={0}
                onClick={() => handleWrappingSelect(opt.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleWrappingSelect(opt.id); } }}
              >
                {opt.imageUrl && (
                  <img className="sb-gift__wrapping-img" src={opt.imageUrl} alt={opt.name} width="40" height="40" loading="lazy" />
                )}
                <span className="sb-gift__wrapping-name">{opt.name}</span>
                <span className="sb-gift__wrapping-price">
                  +{formatPrice(opt.price, moneyFormat)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Task 2: Create FrequencyPicker component

**File (NEW):** `widget/src/components/FrequencyPicker.tsx`

The BundleConfig now has `subscriptionSettings` (added in Step 4):
```typescript
subscriptionSettings?: {
  frequencies: Array<{ value: string; label: string; intervalCount: number; interval: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' }>;
  defaultFrequency: string;
  discountPercent: number;
};
```

```typescript
import React, { useState, useCallback } from 'react';

interface FrequencyPickerProps {
  frequencies: Array<{ value: string; label: string }>;
  defaultFrequency: string;
  discountPercent: number;
  onChange: (frequency: string) => void;
}

/**
 * Subscription frequency picker for SUBSCRIPTION bundles.
 * Renders delivery interval options (e.g., "Every 2 weeks", "Monthly").
 */
export function FrequencyPicker({
  frequencies,
  defaultFrequency,
  discountPercent,
  onChange,
}: FrequencyPickerProps): React.ReactElement {
  const [selected, setSelected] = useState(defaultFrequency);

  const handleSelect = useCallback(
    (value: string) => {
      setSelected(value);
      onChange(value);
    },
    [onChange]
  );

  return (
    <div className="sb-freq" role="group" aria-label="Delivery frequency">
      <div className="sb-freq__header">
        <span className="sb-freq__label">Delivery Frequency</span>
        {discountPercent > 0 && (
          <span className="sb-freq__discount">
            Save {discountPercent}% with subscription
          </span>
        )}
      </div>
      <div className="sb-freq__options" role="radiogroup">
        {frequencies.map((freq) => (
          <div
            key={freq.value}
            className={`sb-freq__option ${selected === freq.value ? 'sb-freq__option--selected' : ''}`}
            role="radio"
            aria-checked={selected === freq.value}
            tabIndex={0}
            onClick={() => handleSelect(freq.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(freq.value);
              }
            }}
          >
            <span className="sb-freq__radio-dot" aria-hidden="true" />
            <span className="sb-freq__option-label">{freq.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Task 3: Create StepWizard component

**File (NEW):** `widget/src/components/StepWizard.tsx`

For multi-step bundles (BUILD_YOUR_OWN, GIFT): Step 1 = Select Products, Step 2 = Customize, Step 3 = Review.

```typescript
import React, { useState, useCallback } from 'react';

interface StepWizardProps {
  steps: Array<{
    label: string;
    content: React.ReactNode;
    isValid: boolean;
  }>;
  onComplete: () => void;
  completeLabel?: string;
}

/**
 * Multi-step wizard for complex bundle types.
 * Renders step indicators, navigation buttons, and step content.
 */
export function StepWizard({
  steps,
  onComplete,
  completeLabel = 'Add to Cart',
}: StepWizardProps): React.ReactElement {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, steps.length]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  return (
    <div className="sb-wizard">
      {/* Step indicators */}
      <div className="sb-wizard__steps" role="tablist">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={index}
              className={`sb-wizard__step ${isCurrent ? 'sb-wizard__step--current' : ''} ${isCompleted ? 'sb-wizard__step--completed' : ''}`}
              role="tab"
              aria-selected={isCurrent}
            >
              <span className="sb-wizard__step-number">
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span className="sb-wizard__step-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="sb-wizard__content" role="tabpanel">
        {currentStepData.content}
      </div>

      {/* Navigation */}
      <div className="sb-wizard__nav">
        {!isFirstStep && (
          <button
            type="button"
            className="sb-wizard__btn sb-wizard__btn--back"
            onClick={handleBack}
          >
            Back
          </button>
        )}
        <div className="sb-wizard__nav-spacer" />
        {isLastStep ? (
          <button
            type="button"
            className="sb-wizard__btn sb-wizard__btn--complete"
            onClick={onComplete}
            disabled={!currentStepData.isValid}
          >
            {completeLabel}
          </button>
        ) : (
          <button
            type="button"
            className="sb-wizard__btn sb-wizard__btn--next"
            onClick={handleNext}
            disabled={!currentStepData.isValid}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## Task 4: Update BundleWidget with Gift & Subscription support

**File:** `widget/src/components/BundleWidget.tsx`

### 4a. Add imports (add after the ErrorBanner import added in Step 4):

```typescript
import { GiftOptions } from './GiftOptions';
import { FrequencyPicker } from './FrequencyPicker';
```

### 4b. Add gift/subscription state (after bundleQuantity state added in Step 4):

```typescript
  // Gift options state
  const [giftMessage, setGiftMessage] = useState('');
  const [giftWrappingId, setGiftWrappingId] = useState<string | null>(null);

  // Subscription frequency state
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<string>(
    config.subscriptionSettings?.defaultFrequency || ''
  );
```

### 4c. Update handleAddToCart to include gift/subscription properties.

Find the properties block inside `handleAddToCart` (currently lines 128-132):
```typescript
        properties: {
          ...item.properties,
          _bundle_id: config.id,
          ...(selectedTier?.id ? { _bundle_tier: selectedTier.id } : {}),
        },
```

Replace with:
```typescript
        properties: {
          ...item.properties,
          _bundle_id: config.id,
          ...(selectedTier?.id ? { _bundle_tier: selectedTier.id } : {}),
          ...(giftMessage ? { _gift_message: giftMessage } : {}),
          ...(giftWrappingId ? { _gift_wrapping: giftWrappingId } : {}),
          ...(subscriptionFrequency ? { _subscription_frequency: subscriptionFrequency } : {}),
        },
```

### 4d. Add Gift/Subscription sections in the JSX.

After the QuantitySelector block added in Step 4 (the `{settings.showQuantitySelector && ...}` block), add:

```typescript
      {/* Gift options for GIFT bundles */}
      {config.type === 'gift' && config.giftSettings && (
        <GiftOptions
          allowMessage={config.giftSettings.allowMessage}
          maxMessageLength={config.giftSettings.maxMessageLength}
          allowWrapping={config.giftSettings.allowWrapping}
          wrappingOptions={config.giftSettings.wrappingOptions || []}
          moneyFormat={settings.moneyFormat}
          onGiftMessageChange={setGiftMessage}
          onWrappingChange={setGiftWrappingId}
        />
      )}

      {/* Subscription frequency for SUBSCRIPTION bundles */}
      {config.type === 'subscription' && config.subscriptionSettings && (
        <FrequencyPicker
          frequencies={config.subscriptionSettings.frequencies}
          defaultFrequency={config.subscriptionSettings.defaultFrequency}
          discountPercent={config.subscriptionSettings.discountPercent}
          onChange={setSubscriptionFrequency}
        />
      )}
```

### 4e. Add giftMessage, giftWrappingId, subscriptionFrequency to handleAddToCart's dependency array.

The current dependency array (lines 169-178):
```typescript
  }, [
    selectedTier,
    currentPricing,
    variantSelections,
    products,
    config.id,
    settings.addToCartBehavior,
    onAddToCart,
    analytics,
  ]);
```

Add the new deps:
```typescript
  }, [
    selectedTier,
    currentPricing,
    variantSelections,
    products,
    config.id,
    settings.addToCartBehavior,
    onAddToCart,
    analytics,
    giftMessage,
    giftWrappingId,
    subscriptionFrequency,
  ]);
```

---

## Task 5: Update cart.ts for subscription selling plan

**File:** `widget/src/utils/cart.ts`

### 5a. Extend CartAddPayload items to support selling_plan.

The current `addToCart` function (lines 13-33) sends `{ items: payload.items }` to `/cart/add.js`.

Shopify's Cart AJAX API accepts `selling_plan` on each item for subscriptions.

Update the `CartLineItem` interface in `widget/src/types/index.ts` (lines 130-135):

**Current:**
```typescript
export interface CartLineItem {
  variantId: string;
  quantity: number;
  price: number;
  properties: Record<string, string>;
}
```

**Replace with:**
```typescript
export interface CartLineItem {
  variantId: string;
  quantity: number;
  price: number;
  properties: Record<string, string>;
  selling_plan?: string;
}
```

### 5b. Update addToCart to map variantId to id (Shopify expects `id` not `variantId`)

**File:** `widget/src/utils/cart.ts`

The current body (line 17):
```typescript
    body: JSON.stringify({ items: payload.items }),
```

Replace with:
```typescript
    body: JSON.stringify({
      items: payload.items.map((item) => ({
        id: item.variantId,
        quantity: item.quantity,
        properties: item.properties,
        ...(item.selling_plan ? { selling_plan: item.selling_plan } : {}),
      })),
    }),
```

---

## Task 6: Update proxy route to pass new config fields

**File:** `pages/api/proxy_route/bundle-widget.ts`

### 6a. Extend buildWidgetConfig to return selectionRules, giftSettings, subscriptionSettings.

In `buildWidgetConfig` (starts at line 277), after the `settings` block (ends at line 352), add new fields from the metadata to the returned config.

**Current return (lines 317-352):**
```typescript
  return {
    id,
    type: bundleType,
    title,
    subtitle: description || undefined,
    description: undefined,
    tiers,
    products,
    visual: { ... },
    analytics: { ... },
    settings: { ... },
  };
```

**After `settings: { ... },` add:**
```typescript
    // Pass through selection rules if present in metadata
    ...(metadata.selection_rules ? {
      selectionRules: (() => {
        try { return JSON.parse(metadata.selection_rules); } catch { return undefined; }
      })()
    } : {}),
    // Pass through gift settings if present
    ...(metadata.gift_settings ? {
      giftSettings: (() => {
        try { return JSON.parse(metadata.gift_settings); } catch { return undefined; }
      })()
    } : {}),
    // Pass through subscription settings if present
    ...(metadata.subscription_settings ? {
      subscriptionSettings: (() => {
        try { return JSON.parse(metadata.subscription_settings); } catch { return undefined; }
      })()
    } : {}),
```

### 6b. Add `settings.minQuantity` default.

In the `settings` object (lines 341-351), add `minQuantity: 1,` after `maxQuantity: 10,`:

```typescript
    settings: {
      currency,
      currencySymbol: "$",
      locale: "en",
      moneyFormat: "${{amount}}",
      addToCartBehavior: "drawer",
      showQuantitySelector: false,
      maxQuantity: 10,
      minQuantity: 1,
      allowVariantSelection: true,
      outOfStockBehavior: "disable",
    },
```

### 6c. Add BUILD_YOUR_OWN and GIFT to the switch statement.

In the `buildWidgetConfig` switch (lines 295-315), add cases:

After the `case "BOGO":` block (line 305), add:
```typescript
    case "build-your-own":
    case "BUILD_YOUR_OWN":
      bundleType = "build-your-own";
      tiers = buildFixedTiers(discount, products);
      break;
    case "gift":
    case "GIFT":
      bundleType = "gift";
      tiers = buildFixedTiers(discount, products);
      break;
    case "subscription":
    case "SUBSCRIPTION":
      bundleType = "subscription";
      tiers = buildFixedTiers(discount, products);
      break;
```

---

## Task 7: Update Liquid template for new data attributes

**File:** `extensions/product-bundle/blocks/bundle.liquid`

No changes needed — the Liquid template already passes all necessary data attributes (`data-product-id`, `data-shop`, `data-money-format`, `data-locale`, `data-currency`, `data-proxy-path`). The bundle type is determined server-side by the proxy route, not in the template. The new components render client-side based on `config.type`.

---

## Verification
1. Run: `cd widget && npx tsc --noEmit` — 0 errors
2. Run: `cd widget && node esbuild.config.js` — bundle compiles
3. Verify new components export correctly: `GiftOptions`, `FrequencyPicker`, `StepWizard`

## Commit message
```
Add GiftOptions, FrequencyPicker, StepWizard widget components

- GiftOptions: message textarea + wrapping selection for GIFT bundles
- FrequencyPicker: subscription delivery interval selector
- StepWizard: multi-step flow for complex bundle types
- Cart utility now supports selling_plan for subscriptions
- Proxy route passes selectionRules, giftSettings, subscriptionSettings
- Gift/subscription properties attached to cart line items
```

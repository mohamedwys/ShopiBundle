# STEP 4: Widget — ProductSelector, QuantitySelector, Empty/Error States

## Context
The storefront widget at `widget/src/` is a React 18 IIFE bundle (~180KB). It currently handles `volume`, `bogo`, `fbt`, `fixed`, `free-gift` types via `calculateTierPricing()` dispatcher. This step adds interactive product selection for MIX_MATCH/BUILD_YOUR_OWN bundles, a quantity selector component, and proper empty/error state components.

## DO NOT re-analyze the codebase. All info is below. Just make the edits.

---

## Task 1: Add `build-your-own` and `subscription` to BundleType

**File:** `widget/src/types/index.ts`

**Current BundleType (lines 12-18):**
```typescript
export type BundleType =
  | 'volume'       // Volume discounts (buy 2, 3, 5+)
  | 'bogo'         // Buy X Get Y free/discounted
  | 'mix-match'    // Customer picks products
  | 'fbt'          // Frequently bought together
  | 'fixed'        // Fixed bundle (all products included)
  | 'free-gift';   // Spend X get free gift
```

**Replace with:**
```typescript
export type BundleType =
  | 'volume'           // Volume discounts (buy 2, 3, 5+)
  | 'bogo'             // Buy X Get Y free/discounted
  | 'mix-match'        // Customer picks products
  | 'build-your-own'   // Customer builds bundle from pool
  | 'fbt'              // Frequently bought together
  | 'fixed'            // Fixed bundle (all products included)
  | 'free-gift'        // Spend X get free gift
  | 'subscription'     // Recurring bundle
  | 'gift';            // Gift bundle with message/wrapping
```

---

## Task 2: Extend BundleConfig for selection rules

**File:** `widget/src/types/index.ts`

**Current BundleConfig (lines 22-33):**
```typescript
export interface BundleConfig {
  id: string;
  type: BundleType;
  title: string;
  subtitle?: string;
  description?: string;
  tiers: BundleTier[];
  products: ProductReference[];
  visual: VisualConfig;
  analytics: AnalyticsConfig;
  settings: BundleSettings;
}
```

**Replace with:**
```typescript
export interface BundleConfig {
  id: string;
  type: BundleType;
  title: string;
  subtitle?: string;
  description?: string;
  tiers: BundleTier[];
  products: ProductReference[];
  visual: VisualConfig;
  analytics: AnalyticsConfig;
  settings: BundleSettings;

  // MIX_MATCH / BUILD_YOUR_OWN selection rules
  selectionRules?: {
    minProducts: number;
    maxProducts: number;
    minQuantity?: number;
    maxQuantity?: number;
    productPool?: ProductReference[];
    componentGroups?: Array<{
      id: string;
      name: string;
      minSelect: number;
      maxSelect: number;
      productIds: string[];
    }>;
  };

  // Gift bundle settings
  giftSettings?: {
    allowMessage: boolean;
    maxMessageLength: number;
    allowWrapping: boolean;
    wrappingOptions?: Array<{ id: string; name: string; price: number; imageUrl?: string }>;
  };

  // Subscription settings
  subscriptionSettings?: {
    frequencies: Array<{ value: string; label: string; intervalCount: number; interval: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' }>;
    defaultFrequency: string;
    discountPercent: number;
  };
}
```

---

## Task 3: Extend BundleSettings for quantity selector

**File:** `widget/src/types/index.ts`

**Current BundleSettings (lines 104-114):**
```typescript
export interface BundleSettings {
  currency: string;
  currencySymbol: string;
  locale: string;
  moneyFormat: string;
  addToCartBehavior: 'redirect' | 'drawer' | 'stay';
  showQuantitySelector: boolean;
  maxQuantity: number;
  allowVariantSelection: boolean;
  outOfStockBehavior: 'disable' | 'hide' | 'notify';
}
```

**Replace with:**
```typescript
export interface BundleSettings {
  currency: string;
  currencySymbol: string;
  locale: string;
  moneyFormat: string;
  addToCartBehavior: 'redirect' | 'drawer' | 'stay';
  showQuantitySelector: boolean;
  maxQuantity: number;
  minQuantity: number;
  allowVariantSelection: boolean;
  outOfStockBehavior: 'disable' | 'hide' | 'notify';
}
```

---

## Task 4: Add new component prop interfaces

**File:** `widget/src/types/index.ts`

**After the existing `ProgressBarProps` interface (ends at line 254), add:**

```typescript
export interface ProductSelectorProps {
  products: ProductReference[];
  selectedProducts: Map<string, number>;
  minSelect: number;
  maxSelect: number;
  onToggle: (productId: string, selected: boolean) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  currency: string;
  moneyFormat: string;
  showPrice: boolean;
}

export interface QuantitySelectorProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: 'bundle' | 'search' | 'error';
}

export interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  retryAction?: () => void;
}
```

---

## Task 5: Create ProductSelector component

**File (NEW):** `widget/src/components/ProductSelector.tsx`

```typescript
import React, { useCallback } from 'react';
import type { ProductSelectorProps } from '../types';
import { formatPrice } from '../utils/formatting';

/**
 * Interactive product selector for MIX_MATCH and BUILD_YOUR_OWN bundles.
 * Renders a grid of selectable products with optional quantity controls.
 */
export function ProductSelector({
  products,
  selectedProducts,
  minSelect,
  maxSelect,
  onToggle,
  onQuantityChange,
  currency,
  moneyFormat,
  showPrice,
}: ProductSelectorProps): React.ReactElement {
  const selectedCount = Array.from(selectedProducts.values()).reduce((sum, qty) => sum + qty, 0);
  const canSelectMore = selectedCount < maxSelect;

  const handleToggle = useCallback(
    (productId: string) => {
      const isSelected = selectedProducts.has(productId);
      if (isSelected) {
        onToggle(productId, false);
      } else if (canSelectMore) {
        onToggle(productId, true);
      }
    },
    [selectedProducts, canSelectMore, onToggle]
  );

  return (
    <div className="sb-selector" role="group" aria-label="Select products for your bundle">
      <div className="sb-selector__header">
        <span className="sb-selector__count">
          {selectedCount} of {maxSelect} selected
          {minSelect > 0 && ` (min ${minSelect})`}
        </span>
        {!canSelectMore && (
          <span className="sb-selector__limit">Maximum reached</span>
        )}
      </div>

      <div className="sb-selector__grid">
        {products.map((product) => {
          const isSelected = selectedProducts.has(product.productId);
          const quantity = selectedProducts.get(product.productId) || 0;
          const isDisabled = !product.available || (!isSelected && !canSelectMore);

          return (
            <div
              key={product.productId}
              className={`sb-selector__item ${isSelected ? 'sb-selector__item--selected' : ''} ${isDisabled ? 'sb-selector__item--disabled' : ''}`}
              role="checkbox"
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              onClick={() => !isDisabled && handleToggle(product.productId)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                  e.preventDefault();
                  handleToggle(product.productId);
                }
              }}
            >
              {product.imageUrl && (
                <img
                  className="sb-selector__image"
                  src={product.imageUrl}
                  alt={product.imageAlt || product.title}
                  loading="lazy"
                  width="80"
                  height="80"
                />
              )}
              <div className="sb-selector__info">
                <span className="sb-selector__title">{product.title}</span>
                {showPrice && (
                  <span className="sb-selector__price">
                    {formatPrice(product.price, moneyFormat)}
                  </span>
                )}
                {!product.available && (
                  <span className="sb-selector__oos">Out of stock</span>
                )}
              </div>

              {isSelected && (
                <div className="sb-selector__check" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {isSelected && quantity > 0 && (
                <div className="sb-selector__qty" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="sb-selector__qty-btn"
                    onClick={() => onQuantityChange(product.productId, Math.max(1, quantity - 1))}
                    aria-label={`Decrease quantity for ${product.title}`}
                  >
                    -
                  </button>
                  <span className="sb-selector__qty-value">{quantity}</span>
                  <button
                    type="button"
                    className="sb-selector__qty-btn"
                    onClick={() => {
                      if (selectedCount - quantity + (quantity + 1) <= maxSelect) {
                        onQuantityChange(product.productId, quantity + 1);
                      }
                    }}
                    disabled={selectedCount >= maxSelect}
                    aria-label={`Increase quantity for ${product.title}`}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## Task 6: Create QuantitySelector component

**File (NEW):** `widget/src/components/QuantitySelector.tsx`

```typescript
import React, { useCallback } from 'react';
import type { QuantitySelectorProps } from '../types';

/**
 * Reusable quantity selector with +/- buttons.
 * Used for bundle-level quantity selection.
 */
export function QuantitySelector({
  value,
  min,
  max,
  onChange,
  disabled = false,
  size = 'medium',
}: QuantitySelectorProps): React.ReactElement {
  const handleDecrement = useCallback(() => {
    if (value > min) onChange(value - 1);
  }, [value, min, onChange]);

  const handleIncrement = useCallback(() => {
    if (value < max) onChange(value + 1);
  }, [value, max, onChange]);

  return (
    <div className={`sb-qty sb-qty--${size}`} role="group" aria-label="Quantity selector">
      <button
        type="button"
        className="sb-qty__btn sb-qty__btn--minus"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <span className="sb-qty__value" aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button
        type="button"
        className="sb-qty__btn sb-qty__btn--plus"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
```

---

## Task 7: Create EmptyState component

**File (NEW):** `widget/src/components/EmptyState.tsx`

```typescript
import React from 'react';
import type { EmptyStateProps } from '../types';

/**
 * Empty state shown when no bundle data is available.
 * Replaces the current `<></>` (fragment) returns in BundleWidget and WidgetRoot.
 */
export function EmptyState({ title, description, icon = 'bundle' }: EmptyStateProps): React.ReactElement {
  const icons: Record<string, React.ReactElement> = {
    bundle: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="8" y="16" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 22H40" stroke="currentColor" strokeWidth="2"/>
        <path d="M20 16V40M28 16V40" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 8L24 16L32 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    search: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="22" cy="22" r="12" stroke="currentColor" strokeWidth="2"/>
        <path d="M31 31L40 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    error: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2"/>
        <path d="M24 16V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="34" r="1.5" fill="currentColor"/>
      </svg>
    ),
  };

  return (
    <div className="sb-empty" role="status">
      <div className="sb-empty__icon">{icons[icon]}</div>
      <p className="sb-empty__title">{title}</p>
      {description && <p className="sb-empty__desc">{description}</p>}
    </div>
  );
}
```

---

## Task 8: Create ErrorBanner component

**File (NEW):** `widget/src/components/ErrorBanner.tsx`

```typescript
import React from 'react';
import type { ErrorBannerProps } from '../types';

/**
 * Dismissible error banner for non-fatal errors.
 * Replaces inline error messages in BundleWidget.
 */
export function ErrorBanner({ message, onDismiss, retryAction }: ErrorBannerProps): React.ReactElement {
  return (
    <div className="sb-error" role="alert">
      <div className="sb-error__content">
        <svg className="sb-error__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 4.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>
        </svg>
        <span className="sb-error__message">{message}</span>
      </div>
      <div className="sb-error__actions">
        {retryAction && (
          <button type="button" className="sb-error__retry" onClick={retryAction}>
            Retry
          </button>
        )}
        {onDismiss && (
          <button type="button" className="sb-error__dismiss" onClick={onDismiss} aria-label="Dismiss error">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## Task 9: Update BundleWidget to use new components

**File:** `widget/src/components/BundleWidget.tsx`

### 9a. Add imports (after line 14):

After the line `import { SkeletonLoader } from './SkeletonLoader';`, add:
```typescript
import { ProductSelector } from './ProductSelector';
import { QuantitySelector } from './QuantitySelector';
import { EmptyState } from './EmptyState';
import { ErrorBanner } from './ErrorBanner';
```

### 9b. Add product selection state (after variantSelections state, line 57):

After the `variantSelections` useState block (ends at line 57), add:
```typescript
  // Product selections for MIX_MATCH / BUILD_YOUR_OWN
  const [selectedBuildProducts, setSelectedBuildProducts] = useState<Map<string, number>>(
    () => new Map()
  );

  // Bundle quantity for quantity selector
  const [bundleQuantity, setBundleQuantity] = useState<number>(1);
```

### 9c. Add product toggle handler (after handleVariantChange, line 107):

```typescript
  const handleProductToggle = useCallback(
    (productId: string, selected: boolean) => {
      setSelectedBuildProducts((prev) => {
        const next = new Map(prev);
        if (selected) {
          next.set(productId, 1);
        } else {
          next.delete(productId);
        }
        return next;
      });
    },
    []
  );

  const handleProductQuantityChange = useCallback(
    (productId: string, quantity: number) => {
      setSelectedBuildProducts((prev) => {
        const next = new Map(prev);
        if (quantity <= 0) {
          next.delete(productId);
        } else {
          next.set(productId, quantity);
        }
        return next;
      });
    },
    []
  );
```

### 9d. Replace empty return (line 180):

**Current:**
```typescript
  if (!tiers.length || !products.length) return <></>;
```

**Replace with:**
```typescript
  if (!tiers.length && !products.length) {
    return <EmptyState title="No bundle available" description="This bundle is not currently active." />;
  }
  if (!products.length) {
    return <EmptyState title="No products found" description="The products in this bundle are unavailable." icon="search" />;
  }
```

### 9e. Add showProducts condition for new types (lines 182-187):

**Current:**
```typescript
  const showProducts =
    (config.type === 'fbt' ||
      config.type === 'mix-match' ||
      config.type === 'fixed' ||
      config.type === 'free-gift') &&
    visual.showProductImages;
```

**Replace with:**
```typescript
  const showProducts =
    (config.type === 'fbt' ||
      config.type === 'mix-match' ||
      config.type === 'build-your-own' ||
      config.type === 'fixed' ||
      config.type === 'free-gift' ||
      config.type === 'gift') &&
    visual.showProductImages;

  const showProductSelector =
    (config.type === 'mix-match' || config.type === 'build-your-own') &&
    config.selectionRules;
```

### 9f. Add ProductSelector and QuantitySelector rendering inside the widget JSX.

After the `{showProducts && ...}` block (ends around line 222) and before the `{/* Offer tier cards */}` comment, add:

```typescript
      {/* Product selector for MIX_MATCH / BUILD_YOUR_OWN */}
      {showProductSelector && config.selectionRules && (
        <ProductSelector
          products={config.selectionRules.productPool || products}
          selectedProducts={selectedBuildProducts}
          minSelect={config.selectionRules.minProducts}
          maxSelect={config.selectionRules.maxProducts}
          onToggle={handleProductToggle}
          onQuantityChange={handleProductQuantityChange}
          currency={settings.currency}
          moneyFormat={settings.moneyFormat}
          showPrice={true}
        />
      )}

      {/* Quantity selector */}
      {settings.showQuantitySelector && (
        <div className="sb-widget__quantity">
          <span className="sb-widget__quantity-label">Quantity:</span>
          <QuantitySelector
            value={bundleQuantity}
            min={settings.minQuantity || 1}
            max={settings.maxQuantity}
            onChange={setBundleQuantity}
          />
        </div>
      )}
```

### 9g. Replace inline error display (lines 291-294):

**Current:**
```typescript
        {errorMessage && (
          <p className="sb-widget__error" role="alert">
            {errorMessage}
          </p>
        )}
```

**Replace with:**
```typescript
        {errorMessage && (
          <ErrorBanner
            message={errorMessage}
            onDismiss={() => {
              setErrorMessage('');
              setAddToCartState('idle');
            }}
            retryAction={handleAddToCart}
          />
        )}
```

---

## Task 10: Update WidgetRoot empty/error states

**File:** `widget/src/index.tsx`

**Current (lines 62-63):**
```typescript
  if (loading) return <SkeletonLoader />;
  if (error || !config) return <></>;
```

**Replace with:**
```typescript
  if (loading) return <SkeletonLoader />;
  if (error) return <EmptyState title="Unable to load bundle" description={error} icon="error" />;
  if (!config) return <></>;
```

**Also add import at line 24 (after ErrorBoundary import):**
```typescript
import { EmptyState } from './components/EmptyState';
```

---

## Task 11: Update calculateTierPricing dispatcher

**File:** `widget/src/utils/pricing.ts`

**Current switch in calculateTierPricing (lines 24-37):**
```typescript
  switch (bundleType) {
    case 'volume':
      return calculateVolumePricing(tier, products);
    case 'bogo':
      return calculateBogoPricing(tier, products);
    case 'fbt':
    case 'mix-match':
    case 'fixed':
      return calculateFixedPricing(tier, products);
    case 'free-gift':
      return calculateFreeGiftPricing(tier, products);
    default:
      return calculateFixedPricing(tier, products);
  }
```

**Replace with:**
```typescript
  switch (bundleType) {
    case 'volume':
      return calculateVolumePricing(tier, products);
    case 'bogo':
      return calculateBogoPricing(tier, products);
    case 'fbt':
    case 'mix-match':
    case 'build-your-own':
    case 'fixed':
    case 'subscription':
      return calculateFixedPricing(tier, products);
    case 'free-gift':
    case 'gift':
      return calculateFreeGiftPricing(tier, products);
    default:
      return calculateFixedPricing(tier, products);
  }
```

---

## Verification
1. Run: `cd widget && npx tsc --noEmit` — 0 errors
2. Run: `cd widget && node esbuild.config.js` (or equivalent build) — bundle compiles

## Commit message
```
Add ProductSelector, QuantitySelector, EmptyState, ErrorBanner widget components

- ProductSelector: interactive grid for MIX_MATCH/BUILD_YOUR_OWN product selection
- QuantitySelector: reusable +/- quantity control with min/max
- EmptyState: replaces silent <></> returns with user-friendly messages
- ErrorBanner: dismissible error display with retry action
- Extend BundleType with build-your-own, subscription, gift
- Add selectionRules, giftSettings, subscriptionSettings to BundleConfig
- Update calculateTierPricing dispatcher for new bundle types
```

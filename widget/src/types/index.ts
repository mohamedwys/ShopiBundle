/**
 * ShopiBundle React Widget - Type Definitions
 *
 * Complete types for the storefront bundle widget that supports
 * volume discounts, BOGO, mix-and-match, and FBT offer types.
 */

// ============================================
// BUNDLE CONFIGURATION
// ============================================

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

export type DiscountType = 'percentage' | 'fixed' | 'free' | 'fixed_price';

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
    frequencies: Array<{ value: string; label: string; intervalCount: number; interval: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'; sellingPlanId?: string }>;
    defaultFrequency: string;
    discountPercent: number;
    sellingPlanGroupId?: string;
  };
}

export interface BundleTier {
  id: string;
  label: string;
  subtitle?: string;
  quantity: number;
  discountType: DiscountType;
  discountValue: number;
  isDefault: boolean;
  badge?: string;
  badgeColor?: string;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface ProductReference {
  productId: string;
  variantId?: string;
  handle?: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
  imageAlt?: string;
  isRequired: boolean;
  quantity: number;
  variants?: ProductVariant[];
  available: boolean;
  inventoryQuantity?: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  inventoryQuantity?: number;
  options: VariantOption[];
  imageUrl?: string;
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface VisualConfig {
  layout: 'cards' | 'list' | 'compact' | 'progress-bar';
  colorScheme: 'default' | 'high-contrast' | 'minimal' | 'custom';
  primaryColor?: string;
  accentColor?: string;
  badgeStyle: 'pill' | 'ribbon' | 'banner';
  showPerUnitPrice: boolean;
  showSavingsAmount: boolean;
  showSavingsPercent: boolean;
  showCompareAtPrice: boolean;
  showProgressBar: boolean;
  showProductImages: boolean;
  imageSize: 'small' | 'medium' | 'large';
  borderRadius?: number;
}

export interface AnalyticsConfig {
  enabled: boolean;
  trackingEndpoint?: string;
  experimentId?: string;
  experimentVariant?: string;
}

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

// ============================================
// PRICING
// ============================================

export interface PricingResult {
  originalPrice: number;
  bundlePrice: number;
  savingsAmount: number;
  savingsPercent: number;
  perUnitPrice: number;
  freeItemsCount: number;
  lineItems: CartLineItem[];
}

export interface CartLineItem {
  variantId: string;
  quantity: number;
  price: number;
  properties: Record<string, string>;
  selling_plan?: string;
}

// ============================================
// CART
// ============================================

export interface CartAddPayload {
  items: CartLineItem[];
}

export interface CartResponse {
  items: Array<{
    id: number;
    quantity: number;
    variant_id: number;
    title: string;
    price: number;
    properties: Record<string, string>;
  }>;
  total_price: number;
  item_count: number;
}

// ============================================
// ANALYTICS
// ============================================

export type AnalyticsEventName =
  | 'bundle_viewed'
  | 'tier_selected'
  | 'variant_changed'
  | 'add_to_cart_clicked'
  | 'add_to_cart_success'
  | 'add_to_cart_failed';

export interface AnalyticsEvent {
  eventName: AnalyticsEventName;
  bundleId: string;
  bundleType: BundleType;
  tierId?: string;
  tierLabel?: string;
  discountType?: DiscountType;
  discountValue?: number;
  originalPrice?: number;
  bundlePrice?: number;
  savingsAmount?: number;
  quantity?: number;
  experimentId?: string;
  experimentVariant?: string;
  timestamp: number;
  sessionId: string;
  productId?: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

// ============================================
// A/B TESTING
// ============================================

export interface ABTestConfig {
  experimentId: string;
  variant: string;
  layoutVariant?: 'A' | 'B' | 'C';
  defaultTierId?: string;
  badgeText?: string;
  colorScheme?: VisualConfig['colorScheme'];
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface BundleWidgetProps {
  config: BundleConfig;
  onAddToCart?: (payload: CartAddPayload) => Promise<void>;
  className?: string;
}

export interface OfferCardProps {
  tier: BundleTier;
  products: ProductReference[];
  selected: boolean;
  disabled: boolean;
  currency: string;
  moneyFormat: string;
  locale: string;
  visual: VisualConfig;
  pricing: PricingResult;
  onSelect: (tierId: string) => void;
}

export interface ProductCardProps {
  product: ProductReference;
  size: 'small' | 'medium' | 'large';
  showPrice: boolean;
  onVariantChange?: (productId: string, variantId: string) => void;
}

export interface SavingsBadgeProps {
  savingsAmount: number;
  savingsPercent: number;
  currency: string;
  moneyFormat: string;
  locale: string;
  style?: 'pill' | 'ribbon' | 'banner';
}

export interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onSelect: (variantId: string) => void;
  layout?: 'dropdown' | 'swatches';
}

export interface ProgressBarProps {
  current: number;
  target: number;
  label: string;
  color?: string;
}

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

// ============================================
// WIDGET MOUNT CONFIG
// ============================================

export interface WidgetMountConfig {
  containerId: string;
  bundleHandle?: string;
  productId?: string;
  shopDomain: string;
  proxyPath: string;
  locale?: string;
  currency?: string;
  moneyFormat?: string;
  abTest?: ABTestConfig;
}

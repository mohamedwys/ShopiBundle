/**
 * ShopiBundle Enhanced - Core Type Definitions
 *
 * This file contains all TypeScript interfaces and types for the
 * enhanced bundle system that matches and exceeds Shopify native bundles.
 */

// ============================================
// BUNDLE TYPES
// ============================================

export type BundleType =
  | 'FIXED'           // All products included, no choices
  | 'MIX_MATCH'       // Customer selects from options
  | 'TIERED'          // Volume-based pricing tiers
  | 'BOGO'            // Buy one get one
  | 'BUILD_YOUR_OWN'  // Customer builds custom bundle
  | 'SUBSCRIPTION'    // Recurring bundle
  | 'GIFT';           // Gift bundle with message

export type BundleStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'SCHEDULED'
  | 'PAUSED'
  | 'ARCHIVED';

export interface Bundle {
  id: string;
  shop: string;

  // Basic Info
  name: string;
  title: string;
  description?: string;
  slug: string;

  // Type and Status
  type: BundleType;
  status: BundleStatus;

  // Shopify References
  shopifyProductId?: string;
  shopifyMetaobjectId?: string;

  // Display Settings
  displayOrder: number;
  featuredImage?: string;
  images: string[];
  tags: string[];

  // Metadata
  metadata?: Record<string, unknown>;

  // Relations
  components: BundleComponent[];
  pricingRules: BundlePricingRule[];
  componentGroups?: ComponentGroup[];

  // Computed Fields (calculated at runtime)
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  savingsPercentage: number;
  availableQuantity: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface BundleListItem extends Omit<Bundle, 'components' | 'pricingRules' | 'componentGroups'> {
  componentCount: number;
  componentPreview: BundleComponentPreview[];
}

export interface BundleComponentPreview {
  shopifyProductId: string;
  cachedTitle?: string;
  cachedImageUrl?: string;
}

// ============================================
// BUNDLE COMPONENTS
// ============================================

export type PriceAdjustmentType =
  | 'NONE'
  | 'FIXED_AMOUNT'    // Reduce by fixed amount
  | 'PERCENTAGE'      // Reduce by percentage
  | 'FIXED_PRICE';    // Set to specific price

export interface BundleComponent {
  id: string;
  bundleId: string;

  // Product Reference
  shopifyProductId: string;
  shopifyVariantId?: string;

  // Component Settings
  quantity: number;
  isRequired: boolean;
  displayOrder: number;

  // For Mix & Match
  groupId?: string;
  minQuantity: number;
  maxQuantity: number;

  // Pricing Override
  priceAdjustment?: number;
  priceAdjustmentType: PriceAdjustmentType;

  // Cached Product Data (for performance)
  product?: ShopifyProduct;
  cachedTitle?: string;
  cachedPrice?: number;
  cachedCompareAtPrice?: number;
  cachedImageUrl?: string;
  cachedInventory?: number;
  lastSyncedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// COMPONENT GROUPS (For Mix & Match)
// ============================================

export type SelectionType =
  | 'SINGLE'    // Pick exactly one
  | 'MULTIPLE'  // Pick multiple
  | 'OPTIONAL'; // Pick zero or more

export interface ComponentGroup {
  id: string;
  bundleId: string;

  name: string;
  description?: string;
  displayOrder: number;

  // Selection Rules
  selectionType: SelectionType;
  minSelections: number;
  maxSelections: number;

  // Components in this group
  components: BundleComponent[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PRICING RULES
// ============================================

export type PricingRuleType =
  | 'BUNDLE_DISCOUNT'   // Standard bundle discount
  | 'VOLUME_TIER'       // Buy more, save more
  | 'BOGO'              // Buy X get Y
  | 'MEMBER_PRICE'      // Customer tag based
  | 'TIME_LIMITED'      // Flash sale
  | 'FIRST_PURCHASE';   // New customer discount

export type DiscountType =
  | 'PERCENTAGE'
  | 'FIXED_AMOUNT'
  | 'FIXED_PRICE'       // Set total bundle price
  | 'FREE_ITEM';        // For BOGO

export interface BundlePricingRule {
  id: string;
  bundleId: string;

  name: string;
  priority: number;
  isActive: boolean;

  // Rule Type
  ruleType: PricingRuleType;

  // Conditions
  conditions: PricingConditions;

  // Discount Settings
  discountType: DiscountType;
  discountValue: number;

  // Limits
  usageLimit?: number;
  usageCount: number;
  startsAt?: Date;
  endsAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingConditions {
  minQuantity?: number;
  maxQuantity?: number;
  minOrderValue?: number;
  customerTags?: string[];
  excludeDiscountedItems?: boolean;
  applicableProductIds?: string[];
}

// ============================================
// PRICING CALCULATION
// ============================================

export interface PricingCalculation {
  bundleId: string;

  // Line Items
  lineItems: PricingLineItem[];

  // Totals
  subtotal: number;
  totalDiscount: number;
  total: number;

  // Applied Rules
  appliedRules: AppliedPricingRule[];

  // Savings Display
  originalTotal: number;
  savingsAmount: number;
  savingsPercentage: number;
}

export interface PricingLineItem {
  componentId: string;
  productId: string;
  variantId?: string;
  title: string;
  quantity: number;
  unitPrice: number;
  linePrice: number;
  discountedPrice: number;
  discount: number;
}

export interface AppliedPricingRule {
  ruleId: string;
  ruleName: string;
  ruleType: PricingRuleType;
  discountAmount: number;
  description: string;
}

// ============================================
// TIERED PRICING
// ============================================

export interface PricingTier {
  minQuantity: number;
  maxQuantity?: number;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FIXED_PRICE';
  discountValue: number;
  label?: string;
}

export interface TieredPriceResult {
  unitPrice: number;
  totalPrice: number;
  originalPrice: number;
  savings: number;
  appliedTier: PricingTier;
  discountDescription: string;
  nextTier: NextTierInfo | null;
}

export interface NextTierInfo {
  tier: PricingTier;
  quantityNeeded: number;
  message: string;
}

// ============================================
// BOGO PRICING
// ============================================

export interface BogoItem {
  productId: string;
  variantId?: string;
  price: number;
  quantity: number;
}

export interface BogoRule {
  buyQuantity: number;
  getQuantity: number;
  getDiscountType: 'FREE' | 'PERCENTAGE';
  getDiscountPercent: number;
}

export interface BogoPriceResult {
  paidItems: BogoItem[];
  freeItems: BogoItem[];
  paidTotal: number;
  freeValue: number;
  totalPrice: number;
  description: string;
}

// ============================================
// INVENTORY
// ============================================

export type InventoryMethod =
  | 'COMPONENT_BASED'   // Min of all component inventories
  | 'BUNDLE_SPECIFIC'   // Bundle has its own inventory
  | 'UNLIMITED';        // No inventory tracking

export interface BundleInventory {
  id: string;
  bundleId: string;

  trackingMethod: InventoryMethod;

  // If bundle has its own inventory
  bundleQuantity?: number;
  lowStockThreshold: number;

  // Calculated from components
  availableQuantity: number;
  reservedQuantity: number;

  // Settings
  allowOversell: boolean;
  autoSyncEnabled: boolean;

  lastCalculatedAt: Date;
}

export interface InventoryStatus {
  bundleId: string;
  trackingMethod: InventoryMethod;

  availableQuantity: number;
  reservedQuantity: number;

  isInStock: boolean;
  isLowStock: boolean;
  lowStockThreshold: number;

  componentStatus: ComponentInventoryStatus[];

  lastSyncedAt: Date;
}

export interface ComponentInventoryStatus {
  componentId: string;
  productId: string;
  variantId?: string;
  title: string;

  available: number;
  required: number;

  isBottleneck: boolean;
}

export interface InventorySyncLog {
  id: string;
  shop: string;
  bundleId: string;

  syncType: 'webhook' | 'scheduled' | 'manual';
  previousQuantity: number;
  newQuantity: number;
  triggerProductId?: string;

  success: boolean;
  errorMessage?: string;

  createdAt: Date;
}

// ============================================
// ANALYTICS
// ============================================

export interface BundleAnalyticsSummary {
  bundleId: string;
  bundleName: string;

  // Time Range
  startDate: Date;
  endDate: Date;

  // Engagement
  totalImpressions: number;
  totalClicks: number;
  clickThroughRate: number;

  // Conversion
  totalAddToCarts: number;
  totalOrders: number;
  conversionRate: number;
  cartAbandonmentRate: number;

  // Revenue
  totalRevenue: number;
  totalDiscountGiven: number;
  averageOrderValue: number;
  revenuePerImpression: number;

  // Comparison
  previousPeriod?: {
    revenue: number;
    orders: number;
    conversionRate: number;
  };
  growth?: {
    revenueGrowth: number;
    ordersGrowth: number;
    conversionGrowth: number;
  };
}

export interface BundleAnalyticsDaily {
  id: string;
  bundleId: string;
  date: Date;

  impressions: number;
  clicks: number;
  addToCarts: number;
  orders: number;
  unitsSold: number;
  revenue: number;
  discountAmount: number;
  averageOrderValue: number;
}

export type BundleEventType =
  | 'impression'
  | 'click'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'purchase';

export interface BundleEvent {
  id: string;
  shop: string;
  bundleId: string;

  eventType: BundleEventType;

  // Context
  sessionId?: string;
  customerId?: string;
  orderId?: string;

  // Event Data
  quantity: number;
  revenue?: number;
  metadata?: Record<string, unknown>;

  // Source
  source?: 'pdp' | 'collection' | 'cart' | 'checkout' | 'homepage';
  deviceType?: 'desktop' | 'mobile' | 'tablet';

  createdAt: Date;
}

// ============================================
// AUTO-BUNDLING RULES
// ============================================

export type AutoBundleTrigger =
  | 'COLLECTION_BASED'    // Products in same collection
  | 'TAG_BASED'           // Products with matching tags
  | 'PRICE_RANGE'         // Products in price range
  | 'VENDOR_BASED'        // Same vendor products
  | 'AI_RECOMMENDATION'   // AI-generated based on orders
  | 'PRODUCT_TYPE';       // Same product type

export interface AutoBundleRule {
  id: string;
  shop: string;

  name: string;
  description?: string;

  // Trigger Conditions
  triggerType: AutoBundleTrigger;
  conditions: AutoBundleConditions;

  // Bundle Template
  bundleTemplate: AutoBundleTemplate;

  // Settings
  isActive: boolean;
  priority: number;
  maxBundlesGenerated?: number;

  // Stats
  bundlesCreated: number;
  lastTriggeredAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface AutoBundleConditions {
  collections?: string[];
  tags?: string[];
  vendors?: string[];
  productTypes?: string[];
  minPrice?: number;
  maxPrice?: number;
  minProducts?: number;
  maxProducts?: number;
}

export interface AutoBundleTemplate {
  nameTemplate: string;
  titleTemplate: string;
  bundleType: BundleType;
  discountType: DiscountType;
  discountValue: number;
  defaultStatus: BundleStatus;
}

// ============================================
// SUBSCRIPTION BUNDLES
// ============================================

export type SubscriptionFrequency =
  | 'WEEKLY'
  | 'BI_WEEKLY'
  | 'MONTHLY'
  | 'BI_MONTHLY'
  | 'QUARTERLY'
  | 'ANNUALLY';

export interface SubscriptionBundleSettings {
  id: string;
  bundleId: string;

  // Subscription Settings
  frequency: SubscriptionFrequency;
  intervalCount: number;

  // Pricing
  subscriptionDiscount: number;

  // Shopify Selling Plan Reference
  sellingPlanGroupId?: string;
  sellingPlanId?: string;

  // Settings
  allowSkip: boolean;
  allowSwap: boolean;
  minCycles: number;
  maxCycles?: number;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// GIFT BUNDLES
// ============================================

export interface GiftBundleSettings {
  id: string;
  bundleId: string;

  allowGiftMessage: boolean;
  maxMessageLength: number;

  allowScheduledDelivery: boolean;

  // Gift Wrap Options
  giftWrapAvailable: boolean;
  giftWrapPrice?: number;
  giftWrapProductId?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface GiftBundleOrder {
  bundleId: string;
  recipientName: string;
  recipientEmail?: string;
  giftMessage?: string;
  scheduledDeliveryDate?: Date;
  includeGiftWrap: boolean;
}

// ============================================
// SHOPIFY TYPES
// ============================================

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  descriptionHtml?: string;
  productType?: string;
  vendor?: string;
  tags: string[];
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  sku?: string;
  inventoryQuantity?: number;
  inventoryPolicy: 'DENY' | 'CONTINUE';
  selectedOptions: { name: string; value: string }[];
  image?: ShopifyImage;
}

export interface ShopifyImage {
  id: string;
  src: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyDiscount {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SCHEDULED';
  usageCount: number;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface CreateBundleRequest {
  name: string;
  title: string;
  description?: string;
  type: BundleType;
  components: CreateComponentInput[];
  componentGroups?: CreateComponentGroupInput[];
  pricingRules?: CreatePricingRuleInput[];
  inventoryMethod?: InventoryMethod;
  lowStockThreshold?: number;
  tags?: string[];
}

export interface CreateComponentInput {
  productId: string;
  variantId?: string;
  quantity?: number;
  isRequired?: boolean;
  groupId?: string;
  minQuantity?: number;
  maxQuantity?: number;
  priceAdjustment?: number;
  priceAdjustmentType?: PriceAdjustmentType;
}

export interface CreateComponentGroupInput {
  name: string;
  description?: string;
  selectionType: SelectionType;
  minSelections: number;
  maxSelections: number;
}

export interface CreatePricingRuleInput {
  name: string;
  ruleType: PricingRuleType;
  conditions?: PricingConditions;
  discountType: DiscountType;
  discountValue: number;
  startsAt?: Date;
  endsAt?: Date;
}

export interface UpdateBundleRequest extends Partial<CreateBundleRequest> {
  status?: BundleStatus;
}

export interface BundleListParams {
  page?: number;
  limit?: number;
  status?: BundleStatus;
  type?: BundleType;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'revenue';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

// ============================================
// CUSTOMER CONTEXT
// ============================================

export interface CustomerContext {
  id?: string;
  email?: string;
  tags: string[];
  orderCount: number;
  totalSpent: number;
  isFirstPurchase?: boolean;
}

// ============================================
// STOREFRONT TYPES
// ============================================

export interface StorefrontBundle {
  id: string;
  name: string;
  title: string;
  description?: string;
  type: BundleType;
  featuredImage?: string;

  components: StorefrontComponent[];

  pricing: {
    originalPrice: number;
    discountedPrice: number;
    savings: number;
    savingsPercentage: number;
    currency: string;
  };

  inventory: {
    available: number;
    isInStock: boolean;
  };

  // For Mix & Match
  componentGroups?: StorefrontComponentGroup[];
}

export interface StorefrontComponent {
  productId: string;
  variantId?: string;
  quantity: number;
  title: string;
  price: number;
  imageUrl?: string;
  isRequired: boolean;
}

export interface StorefrontComponentGroup {
  id: string;
  name: string;
  description?: string;
  selectionType: SelectionType;
  minSelections: number;
  maxSelections: number;
  options: StorefrontComponent[];
}

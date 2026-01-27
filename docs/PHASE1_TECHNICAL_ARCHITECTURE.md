# Phase 1: Technical Architecture - ShopiBundle Enhanced

## Executive Summary

This document outlines the technical architecture for transforming ShopiBundle into an enterprise-grade bundle solution that matches and exceeds Shopify's native bundle functionality. Building on the existing foundation (manual bundles, auto-bundling rules, AI FBT), we will add advanced features including mix-and-match bundles, inventory synchronization, tiered pricing, subscription bundles, and enhanced storefront rendering.

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Target Architecture](#2-target-architecture)
3. [Enhanced Database Schema](#3-enhanced-database-schema)
4. [Core Data Models](#4-core-data-models)
5. [API Design](#5-api-design)
6. [Shopify Integration Strategy](#6-shopify-integration-strategy)
7. [Development Roadmap](#7-development-roadmap)
8. [Technical Risks & Mitigations](#8-technical-risks--mitigations)

---

## 1. Current State Analysis

### 1.1 Existing Capabilities

| Feature | Status | Implementation |
|---------|--------|----------------|
| Manual Bundle Creation | ✅ Complete | Metaobjects + Automatic Discounts |
| Auto-Bundling Rules | ✅ Complete | Collection/Tag-based rules |
| AI FBT (Apriori) | ✅ Complete | Order history analysis |
| Basic Analytics | ✅ Complete | Discount usage tracking |
| A/B Testing | ✅ Complete | Variant group assignments |
| Import/Export | ✅ Complete | JSON/CSV support |

### 1.2 Shopify Native Bundle Features (Our Target)

| Native Feature | Our Current Support | Gap |
|----------------|---------------------|-----|
| Fixed product bundles | ✅ Supported | None |
| Bundle as single product | ❌ Missing | Need product creation |
| Inventory sync | ❌ Missing | Critical gap |
| Bundle variants | ❌ Missing | Size/color options |
| Checkout line items | Partial | Uses discounts only |

### 1.3 Advanced Features (Exceeding Native)

| Advanced Feature | Priority | Complexity |
|------------------|----------|------------|
| Mix-and-match bundles | High | Medium |
| Tiered/volume pricing | High | Medium |
| BOGO offers | High | Low |
| Subscription bundles | Medium | High |
| Gift bundles | Medium | Low |
| Build-your-own box | High | High |
| Cross-sell widgets | High | Medium |

---

## 2. Target Architecture

### 2.1 Tech Stack (Confirmed)

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 14 (App Router) + React 18 + TypeScript                │
│  Shopify Polaris 13.x + App Bridge 4.x                          │
│  TanStack Query (React Query) for data fetching                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                   │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes (Serverless Functions)                      │
│  Prisma ORM 5.x + PostgreSQL (Neon/Supabase)                   │
│  Redis (Upstash) for caching & job queues                       │
│  Shopify GraphQL Admin API 2024-10                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SHOPIFY INTEGRATION                          │
├─────────────────────────────────────────────────────────────────┤
│  Admin API: Products, Discounts, Orders, Metaobjects            │
│  Storefront API: Product queries, Cart mutations                │
│  Webhooks: Orders, Products, Inventory                          │
│  Theme App Extensions: Bundle widgets                           │
│  Checkout UI Extensions: Bundle line items                      │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Application Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                           ShopiBundle App                               │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Bundle    │  │  Pricing    │  │  Inventory  │  │  Analytics  │   │
│  │   Engine    │  │   Engine    │  │    Sync     │  │   Engine    │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
│         │                │                │                │           │
│         └────────────────┼────────────────┼────────────────┘           │
│                          │                │                             │
│                          ▼                ▼                             │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                     Core Services Layer                        │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │    │
│  │  │ Bundle   │ │ Discount │ │ Product  │ │  Order   │         │    │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Service  │         │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                          │                                             │
│                          ▼                                             │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                    Data Access Layer                           │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │    │
│  │  │ Prisma ORM   │  │ Shopify API  │  │ Redis Cache  │         │    │
│  │  │ (PostgreSQL) │  │   Client     │  │  (Upstash)   │         │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Folder Structure (Enhanced)

```
/ShopiBundle/
├── app/                          # Next.js 14 App Router (migrate from pages/)
│   ├── (admin)/                  # Admin dashboard routes
│   │   ├── bundles/
│   │   │   ├── page.tsx          # Bundle list
│   │   │   ├── [id]/page.tsx     # Bundle detail/edit
│   │   │   └── create/page.tsx   # Create bundle
│   │   ├── analytics/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   │   ├── v2/                   # New versioned API
│   │   │   ├── bundles/
│   │   │   ├── pricing/
│   │   │   ├── inventory/
│   │   │   └── analytics/
│   │   ├── webhooks/
│   │   ├── proxy/
│   │   └── auth/
│   └── layout.tsx
│
├── lib/                          # Core business logic
│   ├── services/                 # Service layer
│   │   ├── bundle.service.ts
│   │   ├── pricing.service.ts
│   │   ├── inventory.service.ts
│   │   ├── discount.service.ts
│   │   └── analytics.service.ts
│   ├── engines/                  # Complex business logic
│   │   ├── bundle-engine.ts
│   │   ├── pricing-engine.ts
│   │   └── recommendation-engine.ts
│   ├── shopify/                  # Shopify API wrappers
│   │   ├── admin-api.ts
│   │   ├── storefront-api.ts
│   │   ├── queries/
│   │   └── mutations/
│   ├── db/                       # Database utilities
│   │   ├── prisma.ts
│   │   └── repositories/
│   └── utils/                    # Shared utilities
│
├── components/                   # React components
│   ├── bundles/
│   ├── analytics/
│   ├── common/
│   └── providers/
│
├── types/                        # TypeScript definitions
│   ├── bundle.types.ts
│   ├── pricing.types.ts
│   ├── shopify.types.ts
│   └── api.types.ts
│
├── extensions/                   # Shopify extensions
│   ├── theme-app-extension/      # Storefront widgets
│   │   ├── blocks/
│   │   │   ├── bundle-selector.liquid
│   │   │   ├── mix-match-builder.liquid
│   │   │   └── fbt-widget.liquid
│   │   └── assets/
│   └── checkout-ui-extension/    # Checkout customization
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── workers/                      # Background job handlers
│   ├── inventory-sync.worker.ts
│   ├── analytics-aggregation.worker.ts
│   └── ai-generation.worker.ts
│
└── config/
    ├── constants.ts
    └── feature-flags.ts
```

---

## 3. Enhanced Database Schema

### 3.1 New Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // For migrations
}

// ============================================
// CORE BUNDLE MODELS
// ============================================

model Bundle {
  id                    String              @id @default(cuid())
  shop                  String

  // Basic Info
  name                  String
  title                 String
  description           String?
  slug                  String              // URL-friendly identifier

  // Bundle Type
  type                  BundleType          @default(FIXED)
  status                BundleStatus        @default(DRAFT)

  // Shopify References
  shopifyProductId      String?             // If created as Shopify product
  shopifyMetaobjectId   String?             // Metaobject reference

  // Display Settings
  displayOrder          Int                 @default(0)
  featuredImage         String?
  images                String[]

  // Metadata
  tags                  String[]
  metadata              Json?

  // Timestamps
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt
  publishedAt           DateTime?

  // Relations
  components            BundleComponent[]
  pricingRules          BundlePricingRule[]
  discounts             BundleDiscount[]
  inventoryRecords      BundleInventory[]
  analytics             BundleAnalytics[]

  @@unique([shop, slug])
  @@index([shop, status])
  @@index([shop, type])
  @@index([createdAt])
}

enum BundleType {
  FIXED              // All products included, no choices
  MIX_MATCH          // Customer selects from options
  TIERED             // Volume-based pricing tiers
  BOGO               // Buy one get one
  BUILD_YOUR_OWN     // Customer builds custom bundle
  SUBSCRIPTION       // Recurring bundle
  GIFT               // Gift bundle with message
}

enum BundleStatus {
  DRAFT
  ACTIVE
  SCHEDULED
  PAUSED
  ARCHIVED
}

// ============================================
// BUNDLE COMPONENTS (Products in Bundle)
// ============================================

model BundleComponent {
  id                    String              @id @default(cuid())
  bundleId              String
  bundle                Bundle              @relation(fields: [bundleId], references: [id], onDelete: Cascade)

  // Product Reference
  shopifyProductId      String
  shopifyVariantId      String?             // Specific variant or null for any

  // Component Settings
  quantity              Int                 @default(1)
  isRequired            Boolean             @default(true)
  displayOrder          Int                 @default(0)

  // For Mix & Match
  groupId               String?             // Group components for selection
  minQuantity           Int                 @default(0)
  maxQuantity           Int                 @default(1)

  // Pricing Override
  priceAdjustment       Decimal?            @db.Decimal(10, 2)
  priceAdjustmentType   PriceAdjustmentType @default(NONE)

  // Cached Product Data (for performance)
  cachedTitle           String?
  cachedPrice           Decimal?            @db.Decimal(10, 2)
  cachedCompareAtPrice  Decimal?            @db.Decimal(10, 2)
  cachedImageUrl        String?
  cachedInventory       Int?
  lastSyncedAt          DateTime?

  // Timestamps
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt

  @@index([bundleId])
  @@index([shopifyProductId])
  @@index([groupId])
}

enum PriceAdjustmentType {
  NONE
  FIXED_AMOUNT          // Reduce by fixed amount
  PERCENTAGE            // Reduce by percentage
  FIXED_PRICE           // Set to specific price
}

// ============================================
// COMPONENT GROUPS (For Mix & Match)
// ============================================

model ComponentGroup {
  id                    String              @id @default(cuid())
  bundleId              String

  name                  String              // e.g., "Choose your protein"
  description           String?
  displayOrder          Int                 @default(0)

  // Selection Rules
  selectionType         SelectionType       @default(SINGLE)
  minSelections         Int                 @default(1)
  maxSelections         Int                 @default(1)

  // Timestamps
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt

  @@index([bundleId])
}

enum SelectionType {
  SINGLE                // Pick exactly one
  MULTIPLE              // Pick multiple
  OPTIONAL              // Pick zero or more
}

// ============================================
// PRICING RULES
// ============================================

model BundlePricingRule {
  id                    String              @id @default(cuid())
  bundleId              String
  bundle                Bundle              @relation(fields: [bundleId], references: [id], onDelete: Cascade)

  name                  String
  priority              Int                 @default(0)   // Higher = checked first
  isActive              Boolean             @default(true)

  // Rule Type
  ruleType              PricingRuleType

  // Conditions (JSON for flexibility)
  conditions            Json                // { minQuantity, maxQuantity, customerTags, etc. }

  // Discount Settings
  discountType          DiscountType
  discountValue         Decimal             @db.Decimal(10, 2)

  // Limits
  usageLimit            Int?
  usageCount            Int                 @default(0)
  startsAt              DateTime?
  endsAt                DateTime?

  // Timestamps
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt

  @@index([bundleId, isActive])
  @@index([priority])
}

enum PricingRuleType {
  BUNDLE_DISCOUNT       // Standard bundle discount
  VOLUME_TIER           // Buy more, save more
  BOGO                  // Buy X get Y
  MEMBER_PRICE          // Customer tag based
  TIME_LIMITED          // Flash sale
  FIRST_PURCHASE        // New customer discount
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
  FIXED_PRICE           // Set total bundle price
  FREE_ITEM             // For BOGO
}

// ============================================
// BUNDLE DISCOUNTS (Shopify Discount References)
// ============================================

model BundleDiscount {
  id                    String              @id @default(cuid())
  bundleId              String
  bundle                Bundle              @relation(fields: [bundleId], references: [id], onDelete: Cascade)

  shopifyDiscountId     String
  discountCode          String?             // If code-based
  discountType          String              // automatic, code

  isActive              Boolean             @default(true)

  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt

  @@unique([bundleId, shopifyDiscountId])
  @@index([shopifyDiscountId])
}

// ============================================
// INVENTORY TRACKING
// ============================================

model BundleInventory {
  id                    String              @id @default(cuid())
  bundleId              String
  bundle                Bundle              @relation(fields: [bundleId], references: [id], onDelete: Cascade)

  // Inventory Method
  trackingMethod        InventoryMethod     @default(COMPONENT_BASED)

  // If bundle has its own inventory
  bundleQuantity        Int?
  lowStockThreshold     Int                 @default(10)

  // Calculated from components
  availableQuantity     Int                 @default(0)
  reservedQuantity      Int                 @default(0)

  // Settings
  allowOversell         Boolean             @default(false)
  autoSyncEnabled       Boolean             @default(true)

  lastCalculatedAt      DateTime            @default(now())

  @@unique([bundleId])
}

enum InventoryMethod {
  COMPONENT_BASED       // Min of all component inventories
  BUNDLE_SPECIFIC       // Bundle has its own inventory
  UNLIMITED             // No inventory tracking
}

model InventorySyncLog {
  id                    String              @id @default(cuid())
  shop                  String
  bundleId              String

  syncType              String              // webhook, scheduled, manual
  previousQuantity      Int
  newQuantity           Int
  triggerProductId      String?

  success               Boolean
  errorMessage          String?

  createdAt             DateTime            @default(now())

  @@index([shop, bundleId])
  @@index([createdAt])
}

// ============================================
// ANALYTICS
// ============================================

model BundleAnalytics {
  id                    String              @id @default(cuid())
  bundleId              String
  bundle                Bundle              @relation(fields: [bundleId], references: [id], onDelete: Cascade)

  date                  DateTime            @db.Date

  // Engagement Metrics
  impressions           Int                 @default(0)
  clicks                Int                 @default(0)
  addToCarts            Int                 @default(0)

  // Conversion Metrics
  orders                Int                 @default(0)
  unitsSold             Int                 @default(0)

  // Revenue Metrics
  revenue               Decimal             @default(0) @db.Decimal(12, 2)
  discountAmount        Decimal             @default(0) @db.Decimal(12, 2)
  averageOrderValue     Decimal             @default(0) @db.Decimal(10, 2)

  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt

  @@unique([bundleId, date])
  @@index([date])
}

model BundleEvent {
  id                    String              @id @default(cuid())
  shop                  String
  bundleId              String

  eventType             String              // impression, click, add_to_cart, purchase, remove

  // Context
  sessionId             String?
  customerId            String?
  orderId               String?

  // Event Data
  quantity              Int                 @default(1)
  revenue               Decimal?            @db.Decimal(10, 2)
  metadata              Json?

  // Source
  source                String?             // pdp, collection, cart, checkout
  deviceType            String?             // desktop, mobile, tablet

  createdAt             DateTime            @default(now())

  @@index([shop, bundleId])
  @@index([eventType])
  @@index([createdAt])
}

// ============================================
// AUTO-BUNDLING RULES (Enhanced)
// ============================================

model AutoBundleRule {
  id                    String              @id @default(cuid())
  shop                  String

  name                  String
  description           String?

  // Trigger Conditions
  triggerType           AutoBundleTrigger
  conditions            Json                // Flexible conditions

  // Bundle Template
  bundleTemplate        Json                // How to create the bundle

  // Settings
  isActive              Boolean             @default(true)
  priority              Int                 @default(0)
  maxBundlesGenerated   Int?

  // Stats
  bundlesCreated        Int                 @default(0)
  lastTriggeredAt       DateTime?

  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt

  @@index([shop, isActive])
}

enum AutoBundleTrigger {
  COLLECTION_BASED      // Products in same collection
  TAG_BASED             // Products with matching tags
  PRICE_RANGE           // Products in price range
  VENDOR_BASED          // Same vendor products
  AI_RECOMMENDATION     // AI-generated based on orders
  PRODUCT_TYPE          // Same product type
}

// ============================================
// SUBSCRIPTION BUNDLES
// ============================================

model SubscriptionBundle {
  id                    String              @id @default(cuid())
  bundleId              String              @unique

  // Subscription Settings
  frequency             SubscriptionFrequency
  intervalCount         Int                 @default(1)

  // Pricing
  subscriptionDiscount  Decimal             @db.Decimal(5, 2)  // Additional discount for subscribers

  // Shopify Selling Plan Reference
  sellingPlanGroupId    String?
  sellingPlanId         String?

  // Settings
  allowSkip             Boolean             @default(true)
  allowSwap             Boolean             @default(true)
  minCycles             Int                 @default(1)
  maxCycles             Int?

  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt
}

enum SubscriptionFrequency {
  WEEKLY
  BI_WEEKLY
  MONTHLY
  BI_MONTHLY
  QUARTERLY
  ANNUALLY
}

// ============================================
// GIFT BUNDLES
// ============================================

model GiftBundleSettings {
  id                    String              @id @default(cuid())
  bundleId              String              @unique

  allowGiftMessage      Boolean             @default(true)
  maxMessageLength      Int                 @default(500)

  allowScheduledDelivery Boolean            @default(false)

  // Gift Wrap Options
  giftWrapAvailable     Boolean             @default(false)
  giftWrapPrice         Decimal?            @db.Decimal(10, 2)
  giftWrapProductId     String?             // Shopify product for gift wrap

  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt
}

// ============================================
// EXISTING MODELS (Keep for backward compatibility)
// ============================================

model active_stores {
  shop        String    @id
  isActive    Boolean?  @default(false)
  setupError  String?
  lastError   String?
  lastErrorAt DateTime?
}

model session {
  id      String  @id
  content String?
  shop    String?

  @@index([shop])
}

model oauth_state {
  state     String   @id
  shop      String
  isOnline  Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([shop])
  @@index([createdAt])
}

// Keep legacy models for migration period
model bundle_discount_id {
  bundleId   String @id
  bundleName String
  discountId String
  shop       String
}

model auto_bundle_rules {
  id          String   @id @default(cuid())
  shop        String
  name        String
  collections String[]
  tags        String[]
  minPrice    String
  maxPrice    String
  minProducts String
  discount    String
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([shop])
}

model ai_fbt_bundles {
  id                 String   @id @default(cuid())
  shop               String
  productId          String
  bundledProductIds  String[]
  confidenceScore    Float
  support            Float
  lift               Float
  generatedAt        DateTime @default(now())
  isActive           Boolean  @default(true)
  source             String   @default("AI")
  variantGroupId     String?
  bundleMetaobjectId String?
  discountId         String?
  isManualOverride   Boolean  @default(false)
  lastUpdatedAt      DateTime @default(now())

  @@index([shop, productId])
  @@index([shop, isActive])
}

model ai_fbt_config {
  shop                 String    @id
  isEnabled            Boolean   @default(false)
  minSupport           Float     @default(0.01)
  minConfidence        Float     @default(0.3)
  minLift              Float     @default(1.0)
  maxBundlesPerProduct Int       @default(3)
  lookbackDays         Int       @default(90)
  lastGeneratedAt      DateTime?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @default(now())
}

model ai_bundle_events {
  id             String   @id @default(cuid())
  shop           String
  bundleId       String
  productId      String
  eventType      String
  variantGroupId String?
  sessionId      String?
  customerId     String?
  createdAt      DateTime @default(now())
  metadata       Json?

  @@index([shop, bundleId])
  @@index([shop, eventType])
  @@index([createdAt])
}

model ai_bundle_ab_assignments {
  id             String   @id @default(cuid())
  shop           String
  sessionId      String
  productId      String
  variantGroupId String
  assignedAt     DateTime @default(now())
  expiresAt      DateTime

  @@index([sessionId, productId])
  @@index([expiresAt])
}
```

---

## 4. Core Data Models

### 4.1 TypeScript Type Definitions

```typescript
// types/bundle.types.ts

export type BundleType =
  | 'FIXED'
  | 'MIX_MATCH'
  | 'TIERED'
  | 'BOGO'
  | 'BUILD_YOUR_OWN'
  | 'SUBSCRIPTION'
  | 'GIFT';

export type BundleStatus = 'DRAFT' | 'ACTIVE' | 'SCHEDULED' | 'PAUSED' | 'ARCHIVED';

export interface Bundle {
  id: string;
  shop: string;
  name: string;
  title: string;
  description?: string;
  slug: string;
  type: BundleType;
  status: BundleStatus;

  // Shopify References
  shopifyProductId?: string;
  shopifyMetaobjectId?: string;

  // Display
  displayOrder: number;
  featuredImage?: string;
  images: string[];
  tags: string[];

  // Relations
  components: BundleComponent[];
  pricingRules: BundlePricingRule[];

  // Computed
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

export interface BundleComponent {
  id: string;
  bundleId: string;
  shopifyProductId: string;
  shopifyVariantId?: string;

  quantity: number;
  isRequired: boolean;
  displayOrder: number;

  // Mix & Match
  groupId?: string;
  minQuantity: number;
  maxQuantity: number;

  // Pricing
  priceAdjustment?: number;
  priceAdjustmentType: 'NONE' | 'FIXED_AMOUNT' | 'PERCENTAGE' | 'FIXED_PRICE';

  // Cached Data
  product?: ShopifyProduct;
  cachedTitle?: string;
  cachedPrice?: number;
  cachedImageUrl?: string;
  cachedInventory?: number;
}

export interface ComponentGroup {
  id: string;
  bundleId: string;
  name: string;
  description?: string;
  displayOrder: number;
  selectionType: 'SINGLE' | 'MULTIPLE' | 'OPTIONAL';
  minSelections: number;
  maxSelections: number;
  components: BundleComponent[];
}

export interface BundlePricingRule {
  id: string;
  bundleId: string;
  name: string;
  priority: number;
  isActive: boolean;

  ruleType: PricingRuleType;
  conditions: PricingConditions;

  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FIXED_PRICE' | 'FREE_ITEM';
  discountValue: number;

  usageLimit?: number;
  usageCount: number;
  startsAt?: Date;
  endsAt?: Date;
}

export type PricingRuleType =
  | 'BUNDLE_DISCOUNT'
  | 'VOLUME_TIER'
  | 'BOGO'
  | 'MEMBER_PRICE'
  | 'TIME_LIMITED'
  | 'FIRST_PURCHASE';

export interface PricingConditions {
  minQuantity?: number;
  maxQuantity?: number;
  minOrderValue?: number;
  customerTags?: string[];
  excludeDiscountedItems?: boolean;
  applicableProductIds?: string[];
}

// types/pricing.types.ts

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

// types/inventory.types.ts

export interface InventoryStatus {
  bundleId: string;
  trackingMethod: 'COMPONENT_BASED' | 'BUNDLE_SPECIFIC' | 'UNLIMITED';

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
  required: number; // quantity * bundle quantity

  isBottleneck: boolean; // This component limits bundle availability
}

// types/analytics.types.ts

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
```

### 4.2 Bundle Engine Implementation

```typescript
// lib/engines/bundle-engine.ts

import { Bundle, BundleComponent, BundleType } from '@/types/bundle.types';
import { PricingCalculation } from '@/types/pricing.types';
import { InventoryStatus } from '@/types/inventory.types';
import { PricingEngine } from './pricing-engine';
import { prisma } from '@/lib/db/prisma';
import { ShopifyAdminAPI } from '@/lib/shopify/admin-api';

export class BundleEngine {
  private pricingEngine: PricingEngine;
  private shopifyApi: ShopifyAdminAPI;

  constructor(shop: string, accessToken: string) {
    this.pricingEngine = new PricingEngine();
    this.shopifyApi = new ShopifyAdminAPI(shop, accessToken);
  }

  /**
   * Create a new bundle with all related entities
   */
  async createBundle(input: CreateBundleInput): Promise<Bundle> {
    // Validate input
    this.validateBundleInput(input);

    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // 1. Create bundle record
      const bundle = await tx.bundle.create({
        data: {
          shop: input.shop,
          name: input.name,
          title: input.title,
          description: input.description,
          slug: this.generateSlug(input.name),
          type: input.type,
          status: 'DRAFT',
          tags: input.tags || [],
        },
      });

      // 2. Create components
      const components = await Promise.all(
        input.components.map((comp, index) =>
          tx.bundleComponent.create({
            data: {
              bundleId: bundle.id,
              shopifyProductId: comp.productId,
              shopifyVariantId: comp.variantId,
              quantity: comp.quantity || 1,
              isRequired: comp.isRequired ?? true,
              displayOrder: index,
              groupId: comp.groupId,
              minQuantity: comp.minQuantity || 0,
              maxQuantity: comp.maxQuantity || 1,
            },
          })
        )
      );

      // 3. Create pricing rules
      if (input.pricingRules?.length) {
        await Promise.all(
          input.pricingRules.map((rule, index) =>
            tx.bundlePricingRule.create({
              data: {
                bundleId: bundle.id,
                name: rule.name,
                priority: index,
                ruleType: rule.ruleType,
                conditions: rule.conditions || {},
                discountType: rule.discountType,
                discountValue: rule.discountValue,
                startsAt: rule.startsAt,
                endsAt: rule.endsAt,
              },
            })
          )
        );
      }

      // 4. Create inventory tracking
      await tx.bundleInventory.create({
        data: {
          bundleId: bundle.id,
          trackingMethod: input.inventoryMethod || 'COMPONENT_BASED',
          lowStockThreshold: input.lowStockThreshold || 10,
        },
      });

      // 5. Sync component product data
      await this.syncComponentData(bundle.id, components);

      // 6. Calculate initial inventory
      await this.calculateInventory(bundle.id);

      return this.getBundle(bundle.id);
    });
  }

  /**
   * Get bundle with all computed fields
   */
  async getBundle(bundleId: string): Promise<Bundle | null> {
    const bundle = await prisma.bundle.findUnique({
      where: { id: bundleId },
      include: {
        components: {
          orderBy: { displayOrder: 'asc' },
        },
        pricingRules: {
          where: { isActive: true },
          orderBy: { priority: 'desc' },
        },
        inventoryRecords: true,
      },
    });

    if (!bundle) return null;

    // Calculate pricing
    const pricing = await this.pricingEngine.calculateBundlePrice(bundle);

    // Get inventory status
    const inventory = await this.getInventoryStatus(bundleId);

    return {
      ...bundle,
      originalPrice: pricing.originalTotal,
      discountedPrice: pricing.total,
      savings: pricing.savingsAmount,
      savingsPercentage: pricing.savingsPercentage,
      availableQuantity: inventory.availableQuantity,
    };
  }

  /**
   * Publish bundle to Shopify
   */
  async publishBundle(bundleId: string): Promise<Bundle> {
    const bundle = await this.getBundle(bundleId);
    if (!bundle) throw new Error('Bundle not found');

    // Create Shopify discount
    const discountId = await this.createShopifyDiscount(bundle);

    // Create metaobject for storefront
    const metaobjectId = await this.createBundleMetaobject(bundle);

    // Optionally create as Shopify product (for certain bundle types)
    let productId: string | undefined;
    if (bundle.type === 'FIXED' || bundle.type === 'SUBSCRIPTION') {
      productId = await this.createBundleProduct(bundle);
    }

    // Update bundle with Shopify references
    return await prisma.bundle.update({
      where: { id: bundleId },
      data: {
        status: 'ACTIVE',
        shopifyMetaobjectId: metaobjectId,
        shopifyProductId: productId,
        publishedAt: new Date(),
        discounts: {
          create: {
            shopifyDiscountId: discountId,
            discountType: 'automatic',
            isActive: true,
          },
        },
      },
      include: {
        components: true,
        pricingRules: true,
      },
    });
  }

  /**
   * Calculate bundle inventory based on components
   */
  async calculateInventory(bundleId: string): Promise<InventoryStatus> {
    const bundle = await prisma.bundle.findUnique({
      where: { id: bundleId },
      include: {
        components: true,
        inventoryRecords: true,
      },
    });

    if (!bundle) throw new Error('Bundle not found');

    const inventoryRecord = bundle.inventoryRecords[0];

    if (inventoryRecord?.trackingMethod === 'UNLIMITED') {
      return {
        bundleId,
        trackingMethod: 'UNLIMITED',
        availableQuantity: 999999,
        reservedQuantity: 0,
        isInStock: true,
        isLowStock: false,
        lowStockThreshold: 0,
        componentStatus: [],
        lastSyncedAt: new Date(),
      };
    }

    // Get inventory for each component
    const componentStatus = await Promise.all(
      bundle.components.map(async (comp) => {
        const inventory = await this.shopifyApi.getProductInventory(
          comp.shopifyProductId,
          comp.shopifyVariantId
        );

        const available = inventory.availableQuantity;
        const required = comp.quantity;
        const bundlesAvailable = Math.floor(available / required);

        return {
          componentId: comp.id,
          productId: comp.shopifyProductId,
          variantId: comp.shopifyVariantId,
          title: comp.cachedTitle || '',
          available,
          required,
          bundlesAvailable,
          isBottleneck: false, // Will be set below
        };
      })
    );

    // Find the bottleneck (minimum available bundles)
    const minBundles = Math.min(...componentStatus.map(c => c.bundlesAvailable));
    componentStatus.forEach(c => {
      c.isBottleneck = c.bundlesAvailable === minBundles;
    });

    // Update inventory record
    await prisma.bundleInventory.update({
      where: { bundleId },
      data: {
        availableQuantity: minBundles,
        lastCalculatedAt: new Date(),
      },
    });

    const lowStockThreshold = inventoryRecord?.lowStockThreshold || 10;

    return {
      bundleId,
      trackingMethod: inventoryRecord?.trackingMethod || 'COMPONENT_BASED',
      availableQuantity: minBundles,
      reservedQuantity: inventoryRecord?.reservedQuantity || 0,
      isInStock: minBundles > 0,
      isLowStock: minBundles > 0 && minBundles <= lowStockThreshold,
      lowStockThreshold,
      componentStatus,
      lastSyncedAt: new Date(),
    };
  }

  /**
   * Handle inventory webhook - recalculate affected bundles
   */
  async handleInventoryUpdate(productId: string, variantId?: string): Promise<void> {
    // Find all bundles containing this product
    const affectedComponents = await prisma.bundleComponent.findMany({
      where: {
        shopifyProductId: productId,
        ...(variantId && { shopifyVariantId: variantId }),
        bundle: {
          status: 'ACTIVE',
        },
      },
      select: {
        bundleId: true,
      },
    });

    // Recalculate inventory for each bundle
    const bundleIds = [...new Set(affectedComponents.map(c => c.bundleId))];
    await Promise.all(bundleIds.map(id => this.calculateInventory(id)));
  }

  // Private helper methods
  private validateBundleInput(input: CreateBundleInput): void {
    if (!input.name?.trim()) {
      throw new Error('Bundle name is required');
    }
    if (!input.components?.length) {
      throw new Error('At least one component is required');
    }
    if (input.type === 'MIX_MATCH' && !input.componentGroups?.length) {
      throw new Error('Mix & match bundles require component groups');
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);
  }

  private async syncComponentData(bundleId: string, components: any[]): Promise<void> {
    await Promise.all(
      components.map(async (comp) => {
        const product = await this.shopifyApi.getProduct(comp.shopifyProductId);
        const variant = comp.shopifyVariantId
          ? product.variants.find(v => v.id === comp.shopifyVariantId)
          : product.variants[0];

        await prisma.bundleComponent.update({
          where: { id: comp.id },
          data: {
            cachedTitle: product.title,
            cachedPrice: parseFloat(variant?.price || '0'),
            cachedCompareAtPrice: variant?.compareAtPrice
              ? parseFloat(variant.compareAtPrice)
              : null,
            cachedImageUrl: product.images[0]?.src,
            cachedInventory: variant?.inventoryQuantity,
            lastSyncedAt: new Date(),
          },
        });
      })
    );
  }

  private async createShopifyDiscount(bundle: Bundle): Promise<string> {
    // Implementation depends on bundle type
    // Uses Shopify's automaticDiscountCreate mutation
    const productIds = bundle.components.map(c => c.shopifyProductId);
    const discountValue = bundle.savingsPercentage;

    return await this.shopifyApi.createAutomaticDiscount({
      title: `Bundle: ${bundle.name}`,
      startsAt: new Date().toISOString(),
      combinesWith: {
        productDiscounts: false,
        orderDiscounts: true,
        shippingDiscounts: true,
      },
      minimumRequirement: {
        quantity: {
          greaterThanOrEqualToQuantity: bundle.components.reduce(
            (sum, c) => sum + c.quantity, 0
          ),
        },
      },
      customerGets: {
        value: {
          percentage: discountValue / 100,
        },
        items: {
          products: {
            productsToAdd: productIds.map(id => `gid://shopify/Product/${id}`),
          },
        },
      },
    });
  }

  private async createBundleMetaobject(bundle: Bundle): Promise<string> {
    return await this.shopifyApi.createMetaobject({
      type: 'bundle',
      fields: [
        { key: 'name', value: bundle.name },
        { key: 'title', value: bundle.title },
        { key: 'description', value: bundle.description || '' },
        { key: 'type', value: bundle.type },
        { key: 'products', value: JSON.stringify(
          bundle.components.map(c => ({
            productId: c.shopifyProductId,
            variantId: c.shopifyVariantId,
            quantity: c.quantity,
          }))
        )},
        { key: 'original_price', value: bundle.originalPrice.toString() },
        { key: 'discounted_price', value: bundle.discountedPrice.toString() },
        { key: 'savings_percentage', value: bundle.savingsPercentage.toString() },
      ],
    });
  }

  private async createBundleProduct(bundle: Bundle): Promise<string> {
    // Create bundle as a Shopify product for direct purchase
    return await this.shopifyApi.createProduct({
      title: bundle.title,
      descriptionHtml: bundle.description,
      productType: 'Bundle',
      vendor: 'ShopiBundle',
      tags: ['bundle', ...bundle.tags],
      variants: [{
        price: bundle.discountedPrice.toString(),
        compareAtPrice: bundle.originalPrice.toString(),
        inventoryManagement: 'SHOPIFY',
        inventoryPolicy: 'DENY',
        inventoryQuantities: [{
          availableQuantity: bundle.availableQuantity,
          locationId: await this.shopifyApi.getPrimaryLocationId(),
        }],
      }],
      metafields: [{
        namespace: 'shopibundle',
        key: 'bundle_id',
        value: bundle.id,
        type: 'single_line_text_field',
      }],
    });
  }
}

// Input types
interface CreateBundleInput {
  shop: string;
  name: string;
  title: string;
  description?: string;
  type: BundleType;
  components: {
    productId: string;
    variantId?: string;
    quantity?: number;
    isRequired?: boolean;
    groupId?: string;
    minQuantity?: number;
    maxQuantity?: number;
  }[];
  componentGroups?: {
    name: string;
    selectionType: 'SINGLE' | 'MULTIPLE' | 'OPTIONAL';
    minSelections: number;
    maxSelections: number;
  }[];
  pricingRules?: {
    name: string;
    ruleType: PricingRuleType;
    conditions?: PricingConditions;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FIXED_PRICE' | 'FREE_ITEM';
    discountValue: number;
    startsAt?: Date;
    endsAt?: Date;
  }[];
  inventoryMethod?: 'COMPONENT_BASED' | 'BUNDLE_SPECIFIC' | 'UNLIMITED';
  lowStockThreshold?: number;
  tags?: string[];
}
```

### 4.3 Pricing Engine Implementation

```typescript
// lib/engines/pricing-engine.ts

import {
  Bundle,
  BundleComponent,
  BundlePricingRule,
  PricingRuleType
} from '@/types/bundle.types';
import {
  PricingCalculation,
  PricingLineItem,
  AppliedPricingRule
} from '@/types/pricing.types';

export class PricingEngine {
  /**
   * Calculate the final price for a bundle
   */
  async calculateBundlePrice(
    bundle: Bundle,
    quantity: number = 1,
    customerContext?: CustomerContext
  ): Promise<PricingCalculation> {
    // Build line items from components
    const lineItems = this.buildLineItems(bundle.components, quantity);

    // Calculate subtotal (original prices)
    const subtotal = lineItems.reduce((sum, item) => sum + item.linePrice, 0);
    const originalTotal = subtotal;

    // Get applicable pricing rules
    const applicableRules = this.getApplicableRules(
      bundle.pricingRules,
      { quantity, subtotal, customerContext }
    );

    // Apply rules in priority order
    const appliedRules: AppliedPricingRule[] = [];
    let totalDiscount = 0;

    for (const rule of applicableRules) {
      const discount = this.calculateRuleDiscount(rule, lineItems, subtotal);
      if (discount > 0) {
        totalDiscount += discount;
        appliedRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
          ruleType: rule.ruleType,
          discountAmount: discount,
          description: this.getRuleDescription(rule, discount),
        });

        // Some rules don't stack
        if (rule.ruleType === 'FIXED_PRICE') break;
      }
    }

    // Apply discounts to line items proportionally
    this.applyDiscountsToLineItems(lineItems, totalDiscount);

    const total = Math.max(0, subtotal - totalDiscount);

    return {
      bundleId: bundle.id,
      lineItems,
      subtotal,
      totalDiscount,
      total,
      appliedRules,
      originalTotal,
      savingsAmount: totalDiscount,
      savingsPercentage: originalTotal > 0
        ? Math.round((totalDiscount / originalTotal) * 100)
        : 0,
    };
  }

  /**
   * Calculate tiered pricing for volume bundles
   */
  calculateTieredPrice(
    basePrice: number,
    quantity: number,
    tiers: PricingTier[]
  ): TieredPriceResult {
    // Sort tiers by quantity ascending
    const sortedTiers = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);

    // Find applicable tier
    let applicableTier = sortedTiers[0];
    for (const tier of sortedTiers) {
      if (quantity >= tier.minQuantity) {
        applicableTier = tier;
      }
    }

    let unitPrice: number;
    let discountDescription: string;

    switch (applicableTier.discountType) {
      case 'PERCENTAGE':
        unitPrice = basePrice * (1 - applicableTier.discountValue / 100);
        discountDescription = `${applicableTier.discountValue}% off`;
        break;
      case 'FIXED_AMOUNT':
        unitPrice = basePrice - applicableTier.discountValue;
        discountDescription = `$${applicableTier.discountValue} off each`;
        break;
      case 'FIXED_PRICE':
        unitPrice = applicableTier.discountValue;
        discountDescription = `$${applicableTier.discountValue} each`;
        break;
      default:
        unitPrice = basePrice;
        discountDescription = '';
    }

    const totalPrice = unitPrice * quantity;
    const originalPrice = basePrice * quantity;

    return {
      unitPrice,
      totalPrice,
      originalPrice,
      savings: originalPrice - totalPrice,
      appliedTier: applicableTier,
      discountDescription,
      nextTier: this.getNextTier(sortedTiers, quantity),
    };
  }

  /**
   * Calculate BOGO pricing
   */
  calculateBogoPrice(
    items: BogoItem[],
    rule: BogoRule
  ): BogoPriceResult {
    const sortedItems = [...items].sort((a, b) => b.price - a.price);

    let buyCount = 0;
    let getCount = 0;
    const freeItems: BogoItem[] = [];
    const paidItems: BogoItem[] = [];

    for (const item of sortedItems) {
      for (let i = 0; i < item.quantity; i++) {
        if (buyCount < rule.buyQuantity) {
          paidItems.push({ ...item, quantity: 1 });
          buyCount++;
        } else if (getCount < rule.getQuantity) {
          freeItems.push({ ...item, quantity: 1 });
          getCount++;
        } else {
          // Reset for next BOGO cycle
          buyCount = 1;
          getCount = 0;
          paidItems.push({ ...item, quantity: 1 });
        }
      }
    }

    const paidTotal = paidItems.reduce((sum, item) => sum + item.price, 0);
    const freeValue = freeItems.reduce((sum, item) => {
      const discount = rule.getDiscountType === 'FREE'
        ? item.price
        : item.price * (rule.getDiscountPercent / 100);
      return sum + discount;
    }, 0);

    return {
      paidItems,
      freeItems,
      paidTotal,
      freeValue,
      totalPrice: paidTotal + freeItems.reduce((sum, item) => {
        if (rule.getDiscountType === 'FREE') return sum;
        return sum + item.price * (1 - rule.getDiscountPercent / 100);
      }, 0),
      description: `Buy ${rule.buyQuantity}, Get ${rule.getQuantity} ${
        rule.getDiscountType === 'FREE' ? 'Free' : `${rule.getDiscountPercent}% Off`
      }`,
    };
  }

  // Private helper methods
  private buildLineItems(
    components: BundleComponent[],
    bundleQuantity: number
  ): PricingLineItem[] {
    return components.map(comp => {
      const unitPrice = comp.cachedPrice || 0;
      const quantity = comp.quantity * bundleQuantity;
      const linePrice = unitPrice * quantity;

      return {
        componentId: comp.id,
        productId: comp.shopifyProductId,
        variantId: comp.shopifyVariantId,
        title: comp.cachedTitle || '',
        quantity,
        unitPrice,
        linePrice,
        discountedPrice: linePrice,
        discount: 0,
      };
    });
  }

  private getApplicableRules(
    rules: BundlePricingRule[],
    context: { quantity: number; subtotal: number; customerContext?: CustomerContext }
  ): BundlePricingRule[] {
    const now = new Date();

    return rules
      .filter(rule => {
        // Check active
        if (!rule.isActive) return false;

        // Check dates
        if (rule.startsAt && new Date(rule.startsAt) > now) return false;
        if (rule.endsAt && new Date(rule.endsAt) < now) return false;

        // Check usage limit
        if (rule.usageLimit && rule.usageCount >= rule.usageLimit) return false;

        // Check conditions
        const conditions = rule.conditions as PricingConditions;
        if (conditions.minQuantity && context.quantity < conditions.minQuantity) return false;
        if (conditions.maxQuantity && context.quantity > conditions.maxQuantity) return false;
        if (conditions.minOrderValue && context.subtotal < conditions.minOrderValue) return false;

        // Check customer tags
        if (conditions.customerTags?.length && context.customerContext) {
          const hasRequiredTag = conditions.customerTags.some(
            tag => context.customerContext?.tags.includes(tag)
          );
          if (!hasRequiredTag) return false;
        }

        return true;
      })
      .sort((a, b) => b.priority - a.priority);
  }

  private calculateRuleDiscount(
    rule: BundlePricingRule,
    lineItems: PricingLineItem[],
    subtotal: number
  ): number {
    switch (rule.discountType) {
      case 'PERCENTAGE':
        return subtotal * (rule.discountValue / 100);
      case 'FIXED_AMOUNT':
        return Math.min(rule.discountValue, subtotal);
      case 'FIXED_PRICE':
        return Math.max(0, subtotal - rule.discountValue);
      case 'FREE_ITEM':
        // Find cheapest item to make free
        const cheapest = Math.min(...lineItems.map(i => i.unitPrice));
        return cheapest;
      default:
        return 0;
    }
  }

  private applyDiscountsToLineItems(
    lineItems: PricingLineItem[],
    totalDiscount: number
  ): void {
    const subtotal = lineItems.reduce((sum, item) => sum + item.linePrice, 0);

    lineItems.forEach(item => {
      // Distribute discount proportionally
      const proportion = item.linePrice / subtotal;
      item.discount = totalDiscount * proportion;
      item.discountedPrice = item.linePrice - item.discount;
    });
  }

  private getRuleDescription(rule: BundlePricingRule, discount: number): string {
    switch (rule.discountType) {
      case 'PERCENTAGE':
        return `${rule.discountValue}% bundle discount`;
      case 'FIXED_AMOUNT':
        return `$${rule.discountValue} off`;
      case 'FIXED_PRICE':
        return `Bundle price: $${rule.discountValue}`;
      case 'FREE_ITEM':
        return 'Free item included';
      default:
        return `Save $${discount.toFixed(2)}`;
    }
  }

  private getNextTier(
    tiers: PricingTier[],
    currentQuantity: number
  ): NextTierInfo | null {
    const nextTier = tiers.find(t => t.minQuantity > currentQuantity);
    if (!nextTier) return null;

    return {
      tier: nextTier,
      quantityNeeded: nextTier.minQuantity - currentQuantity,
      message: `Add ${nextTier.minQuantity - currentQuantity} more to save ${nextTier.discountValue}%`,
    };
  }
}

// Supporting types
interface CustomerContext {
  id?: string;
  email?: string;
  tags: string[];
  orderCount: number;
  totalSpent: number;
}

interface PricingTier {
  minQuantity: number;
  maxQuantity?: number;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FIXED_PRICE';
  discountValue: number;
  label?: string;
}

interface TieredPriceResult {
  unitPrice: number;
  totalPrice: number;
  originalPrice: number;
  savings: number;
  appliedTier: PricingTier;
  discountDescription: string;
  nextTier: NextTierInfo | null;
}

interface NextTierInfo {
  tier: PricingTier;
  quantityNeeded: number;
  message: string;
}

interface BogoItem {
  productId: string;
  variantId?: string;
  price: number;
  quantity: number;
}

interface BogoRule {
  buyQuantity: number;
  getQuantity: number;
  getDiscountType: 'FREE' | 'PERCENTAGE';
  getDiscountPercent: number;
}

interface BogoPriceResult {
  paidItems: BogoItem[];
  freeItems: BogoItem[];
  paidTotal: number;
  freeValue: number;
  totalPrice: number;
  description: string;
}
```

---

## 5. API Design

### 5.1 API Structure Overview

```
/api/v2/
├── bundles/
│   ├── GET    /                    # List bundles
│   ├── POST   /                    # Create bundle
│   ├── GET    /:id                 # Get bundle
│   ├── PUT    /:id                 # Update bundle
│   ├── DELETE /:id                 # Delete bundle
│   ├── POST   /:id/publish         # Publish bundle
│   ├── POST   /:id/unpublish       # Unpublish bundle
│   ├── POST   /:id/duplicate       # Duplicate bundle
│   ├── GET    /:id/analytics       # Bundle analytics
│   └── POST   /:id/calculate-price # Calculate pricing
│
├── components/
│   ├── POST   /                    # Add component
│   ├── PUT    /:id                 # Update component
│   ├── DELETE /:id                 # Remove component
│   └── POST   /reorder             # Reorder components
│
├── pricing-rules/
│   ├── GET    /bundle/:bundleId    # List rules for bundle
│   ├── POST   /                    # Create rule
│   ├── PUT    /:id                 # Update rule
│   ├── DELETE /:id                 # Delete rule
│   └── POST   /:id/toggle          # Enable/disable rule
│
├── inventory/
│   ├── GET    /bundle/:bundleId    # Get inventory status
│   ├── POST   /sync                # Trigger sync
│   └── GET    /low-stock           # Get low stock bundles
│
├── analytics/
│   ├── GET    /dashboard           # Overview metrics
│   ├── GET    /bundles             # All bundles performance
│   ├── GET    /bundle/:id          # Single bundle analytics
│   ├── POST   /events              # Track event
│   └── GET    /export              # Export data
│
├── auto-rules/
│   ├── GET    /                    # List auto-bundle rules
│   ├── POST   /                    # Create rule
│   ├── PUT    /:id                 # Update rule
│   ├── DELETE /:id                 # Delete rule
│   ├── POST   /:id/toggle          # Enable/disable
│   └── POST   /:id/preview         # Preview matched products
│
├── ai/
│   ├── POST   /generate            # Generate AI bundles
│   ├── GET    /suggestions         # Get AI suggestions
│   ├── GET    /config              # Get AI config
│   └── PUT    /config              # Update AI config
│
└── proxy/                          # Storefront proxy routes
    ├── GET    /bundles             # Get bundles for product
    ├── GET    /bundle/:id          # Get bundle details
    ├── POST   /calculate           # Calculate price
    └── POST   /events              # Track storefront events
```

### 5.2 API Route Implementation Examples

```typescript
// app/api/v2/bundles/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BundleEngine } from '@/lib/engines/bundle-engine';
import { withAuth } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db/prisma';

// Validation schemas
const CreateBundleSchema = z.object({
  name: z.string().min(1).max(255),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(['FIXED', 'MIX_MATCH', 'TIERED', 'BOGO', 'BUILD_YOUR_OWN', 'SUBSCRIPTION', 'GIFT']),
  components: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().int().positive().default(1),
    isRequired: z.boolean().default(true),
    groupId: z.string().optional(),
  })).min(1),
  pricingRules: z.array(z.object({
    name: z.string(),
    ruleType: z.enum(['BUNDLE_DISCOUNT', 'VOLUME_TIER', 'BOGO', 'MEMBER_PRICE', 'TIME_LIMITED', 'FIRST_PURCHASE']),
    discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FIXED_PRICE', 'FREE_ITEM']),
    discountValue: z.number().positive(),
    conditions: z.record(z.any()).optional(),
  })).optional(),
  tags: z.array(z.string()).optional(),
});

const ListBundlesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['DRAFT', 'ACTIVE', 'SCHEDULED', 'PAUSED', 'ARCHIVED']).optional(),
  type: z.enum(['FIXED', 'MIX_MATCH', 'TIERED', 'BOGO', 'BUILD_YOUR_OWN', 'SUBSCRIPTION', 'GIFT']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'revenue']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// GET /api/v2/bundles - List bundles
export async function GET(request: NextRequest) {
  return withAuth(request, async (session) => {
    try {
      const { searchParams } = new URL(request.url);
      const params = ListBundlesSchema.parse(Object.fromEntries(searchParams));

      const { page, limit, status, type, search, sortBy, sortOrder } = params;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = { shop: session.shop };
      if (status) where.status = status;
      if (type) where.type = type;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Execute queries in parallel
      const [bundles, total] = await Promise.all([
        prisma.bundle.findMany({
          where,
          include: {
            components: {
              orderBy: { displayOrder: 'asc' },
              take: 5, // Preview only
            },
            _count: {
              select: { components: true },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.bundle.count({ where }),
      ]);

      // Calculate pricing for each bundle
      const engine = new BundleEngine(session.shop, session.accessToken);
      const bundlesWithPricing = await Promise.all(
        bundles.map(async (bundle) => {
          const fullBundle = await engine.getBundle(bundle.id);
          return {
            ...bundle,
            originalPrice: fullBundle?.originalPrice || 0,
            discountedPrice: fullBundle?.discountedPrice || 0,
            savingsPercentage: fullBundle?.savingsPercentage || 0,
          };
        })
      );

      return NextResponse.json({
        success: true,
        data: {
          bundles: bundlesWithPricing,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
          },
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { success: false, error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }
      console.error('Error listing bundles:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to list bundles' },
        { status: 500 }
      );
    }
  });
}

// POST /api/v2/bundles - Create bundle
export async function POST(request: NextRequest) {
  return withAuth(request, async (session) => {
    try {
      const body = await request.json();
      const data = CreateBundleSchema.parse(body);

      const engine = new BundleEngine(session.shop, session.accessToken);
      const bundle = await engine.createBundle({
        shop: session.shop,
        ...data,
      });

      return NextResponse.json({
        success: true,
        data: { bundle },
      }, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { success: false, error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }
      console.error('Error creating bundle:', error);
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : 'Failed to create bundle' },
        { status: 500 }
      );
    }
  });
}
```

```typescript
// app/api/v2/bundles/[id]/calculate-price/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PricingEngine } from '@/lib/engines/pricing-engine';
import { withAuth } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db/prisma';

const CalculatePriceSchema = z.object({
  quantity: z.number().int().positive().default(1),
  selectedVariants: z.record(z.string()).optional(), // componentId -> variantId
  customerTags: z.array(z.string()).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (session) => {
    try {
      const body = await request.json();
      const { quantity, selectedVariants, customerTags } = CalculatePriceSchema.parse(body);

      // Get bundle with components and rules
      const bundle = await prisma.bundle.findFirst({
        where: {
          id: params.id,
          shop: session.shop,
        },
        include: {
          components: true,
          pricingRules: {
            where: { isActive: true },
            orderBy: { priority: 'desc' },
          },
        },
      });

      if (!bundle) {
        return NextResponse.json(
          { success: false, error: 'Bundle not found' },
          { status: 404 }
        );
      }

      // Apply selected variants if mix-and-match
      if (selectedVariants && Object.keys(selectedVariants).length > 0) {
        bundle.components = bundle.components.map(comp => ({
          ...comp,
          shopifyVariantId: selectedVariants[comp.id] || comp.shopifyVariantId,
        }));
      }

      const pricingEngine = new PricingEngine();
      const calculation = await pricingEngine.calculateBundlePrice(
        bundle as any,
        quantity,
        customerTags ? { tags: customerTags, orderCount: 0, totalSpent: 0 } : undefined
      );

      return NextResponse.json({
        success: true,
        data: calculation,
      });
    } catch (error) {
      console.error('Error calculating price:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to calculate price' },
        { status: 500 }
      );
    }
  });
}
```

### 5.3 Storefront Proxy API

```typescript
// app/api/proxy/bundles/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyProxySignature } from '@/lib/middleware/verify-proxy';
import { prisma } from '@/lib/db/prisma';
import { PricingEngine } from '@/lib/engines/pricing-engine';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');
  const productId = searchParams.get('product_id');
  const signature = searchParams.get('signature');

  // Verify proxy signature
  if (!verifyProxySignature(request)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  if (!shop || !productId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // Find active bundles containing this product
    const bundles = await prisma.bundle.findMany({
      where: {
        shop,
        status: 'ACTIVE',
        components: {
          some: {
            shopifyProductId: productId,
          },
        },
      },
      include: {
        components: {
          orderBy: { displayOrder: 'asc' },
        },
        pricingRules: {
          where: { isActive: true },
          orderBy: { priority: 'desc' },
        },
        inventoryRecords: true,
      },
    });

    // Calculate pricing for each bundle
    const pricingEngine = new PricingEngine();
    const bundlesWithPricing = await Promise.all(
      bundles.map(async (bundle) => {
        const pricing = await pricingEngine.calculateBundlePrice(bundle as any);
        const inventory = bundle.inventoryRecords[0];

        return {
          id: bundle.id,
          name: bundle.name,
          title: bundle.title,
          description: bundle.description,
          type: bundle.type,
          featuredImage: bundle.featuredImage,

          components: bundle.components.map(c => ({
            productId: c.shopifyProductId,
            variantId: c.shopifyVariantId,
            quantity: c.quantity,
            title: c.cachedTitle,
            price: c.cachedPrice,
            imageUrl: c.cachedImageUrl,
          })),

          pricing: {
            originalPrice: pricing.originalTotal,
            discountedPrice: pricing.total,
            savings: pricing.savingsAmount,
            savingsPercentage: pricing.savingsPercentage,
            currency: 'USD', // Would come from shop settings
          },

          inventory: {
            available: inventory?.availableQuantity || 0,
            isInStock: (inventory?.availableQuantity || 0) > 0,
          },
        };
      })
    );

    return NextResponse.json({
      bundles: bundlesWithPricing,
    });
  } catch (error) {
    console.error('Proxy bundle error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bundles' },
      { status: 500 }
    );
  }
}
```

---

## 6. Shopify Integration Strategy

### 6.1 API Usage Matrix

| Feature | Admin API | Storefront API | Webhooks | Extensions |
|---------|-----------|----------------|----------|------------|
| Product data | ✅ GraphQL | ✅ GraphQL | - | - |
| Create discounts | ✅ GraphQL | - | - | - |
| Inventory sync | ✅ GraphQL | - | ✅ inventory_levels/update | - |
| Order tracking | ✅ GraphQL | - | ✅ orders/create | - |
| Metaobjects | ✅ GraphQL | ✅ GraphQL | - | - |
| Cart modifications | - | ✅ Mutations | - | ✅ Checkout UI |
| Bundle display | - | - | - | ✅ Theme blocks |
| Selling plans | ✅ GraphQL | ✅ GraphQL | - | - |

### 6.2 Webhook Configuration

```typescript
// lib/shopify/webhooks.ts

export const WEBHOOK_TOPICS = {
  // App lifecycle
  APP_UNINSTALLED: 'app/uninstalled',

  // Inventory
  INVENTORY_LEVELS_UPDATE: 'inventory_levels/update',
  INVENTORY_ITEMS_UPDATE: 'inventory_items/update',

  // Products
  PRODUCTS_UPDATE: 'products/update',
  PRODUCTS_DELETE: 'products/delete',
  VARIANTS_UPDATE: 'variants/update',

  // Orders
  ORDERS_CREATE: 'orders/create',
  ORDERS_PAID: 'orders/paid',
  ORDERS_FULFILLED: 'orders/fulfilled',
  ORDERS_CANCELLED: 'orders/cancelled',

  // Customers (for member pricing)
  CUSTOMERS_UPDATE: 'customers/update',
} as const;

// Webhook handlers
export const webhookHandlers = {
  'inventory_levels/update': async (shop: string, payload: any) => {
    const { inventory_item_id, available } = payload;

    // Find product by inventory item
    // Trigger inventory recalculation for affected bundles
    const bundleEngine = await getBundleEngineForShop(shop);
    await bundleEngine.handleInventoryUpdate(inventory_item_id);
  },

  'orders/create': async (shop: string, payload: any) => {
    const { id, line_items, discount_codes } = payload;

    // Track bundle purchases
    const analyticsService = new AnalyticsService(shop);
    await analyticsService.trackOrderBundles(id, line_items, discount_codes);

    // Update inventory
    for (const item of line_items) {
      const bundleEngine = await getBundleEngineForShop(shop);
      await bundleEngine.handleInventoryUpdate(item.product_id, item.variant_id);
    }
  },

  'products/update': async (shop: string, payload: any) => {
    const { id, title, variants, images } = payload;

    // Update cached product data in components
    await prisma.bundleComponent.updateMany({
      where: { shopifyProductId: id.toString() },
      data: {
        cachedTitle: title,
        cachedPrice: parseFloat(variants[0]?.price || '0'),
        cachedImageUrl: images[0]?.src,
        lastSyncedAt: new Date(),
      },
    });
  },

  'products/delete': async (shop: string, payload: any) => {
    const { id } = payload;

    // Mark affected bundles as needing attention
    const affectedBundles = await prisma.bundle.findMany({
      where: {
        shop,
        components: {
          some: { shopifyProductId: id.toString() },
        },
      },
    });

    for (const bundle of affectedBundles) {
      await prisma.bundle.update({
        where: { id: bundle.id },
        data: {
          status: 'PAUSED',
          metadata: {
            ...(bundle.metadata as object || {}),
            pauseReason: `Product ${id} was deleted`,
            pausedAt: new Date().toISOString(),
          },
        },
      });
    }
  },
};
```

### 6.3 Metaobject Definition

```typescript
// lib/shopify/setup-metaobjects.ts

export async function setupBundleMetaobjects(
  admin: AdminApiContext
): Promise<void> {
  // Define bundle metaobject type
  const bundleDefinition = await admin.graphql(`
    mutation CreateBundleMetaobjectDefinition {
      metaobjectDefinitionCreate(definition: {
        type: "shopibundle_bundle"
        name: "Product Bundle"
        description: "Bundle configuration for ShopiBundle app"
        displayNameKey: "name"
        fieldDefinitions: [
          {
            key: "name"
            name: "Bundle Name"
            type: "single_line_text_field"
            required: true
          }
          {
            key: "title"
            name: "Display Title"
            type: "single_line_text_field"
            required: true
          }
          {
            key: "description"
            name: "Description"
            type: "multi_line_text_field"
          }
          {
            key: "type"
            name: "Bundle Type"
            type: "single_line_text_field"
            validations: [{
              name: "choices"
              value: "[\"FIXED\",\"MIX_MATCH\",\"TIERED\",\"BOGO\",\"BUILD_YOUR_OWN\",\"SUBSCRIPTION\",\"GIFT\"]"
            }]
          }
          {
            key: "components"
            name: "Components"
            type: "json"
            description: "JSON array of component products"
          }
          {
            key: "original_price"
            name: "Original Price"
            type: "number_decimal"
          }
          {
            key: "discounted_price"
            name: "Discounted Price"
            type: "number_decimal"
          }
          {
            key: "savings_percentage"
            name: "Savings %"
            type: "number_integer"
          }
          {
            key: "featured_image"
            name: "Featured Image"
            type: "file_reference"
            validations: [{
              name: "file_type_options"
              value: "[\"Image\"]"
            }]
          }
          {
            key: "status"
            name: "Status"
            type: "single_line_text_field"
          }
          {
            key: "internal_id"
            name: "Internal Bundle ID"
            type: "single_line_text_field"
            description: "Reference to ShopiBundle database"
          }
        ]
        access: {
          storefront: READ
          admin: READ_WRITE
        }
      }) {
        metaobjectDefinition {
          id
          type
        }
        userErrors {
          field
          message
        }
      }
    }
  `);

  console.log('Bundle metaobject definition created:', bundleDefinition);
}
```

### 6.4 Theme App Extension

```liquid
{% comment %}
  extensions/theme-app-extension/blocks/bundle-selector.liquid

  Bundle selector block for product pages
{% endcomment %}

{% schema %}
{
  "name": "Bundle Selector",
  "target": "section",
  "stylesheet": "bundle-selector.css",
  "javascript": "bundle-selector.js",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Section Heading",
      "default": "Frequently Bought Together"
    },
    {
      "type": "select",
      "id": "layout",
      "label": "Layout",
      "options": [
        { "value": "horizontal", "label": "Horizontal" },
        { "value": "vertical", "label": "Vertical" },
        { "value": "grid", "label": "Grid" }
      ],
      "default": "horizontal"
    },
    {
      "type": "checkbox",
      "id": "show_savings",
      "label": "Show Savings Badge",
      "default": true
    },
    {
      "type": "color",
      "id": "accent_color",
      "label": "Accent Color",
      "default": "#008060"
    }
  ]
}
{% endschema %}

<div class="shopibundle-container"
     data-product-id="{{ product.id }}"
     data-shop="{{ shop.permanent_domain }}">

  <h3 class="shopibundle-heading">{{ block.settings.heading }}</h3>

  <div class="shopibundle-loading">
    <div class="shopibundle-spinner"></div>
    <p>Loading bundles...</p>
  </div>

  <div class="shopibundle-bundles" style="display: none;">
    <!-- Populated by JavaScript -->
  </div>

  <template id="shopibundle-template">
    <div class="shopibundle-bundle" data-bundle-id="">
      <div class="shopibundle-products">
        <!-- Products inserted here -->
      </div>

      {% if block.settings.show_savings %}
      <div class="shopibundle-savings">
        <span class="shopibundle-savings-badge">
          Save <span class="savings-percent"></span>%
        </span>
      </div>
      {% endif %}

      <div class="shopibundle-pricing">
        <span class="shopibundle-original-price"></span>
        <span class="shopibundle-discounted-price"></span>
      </div>

      <button class="shopibundle-add-btn" type="button">
        Add Bundle to Cart
      </button>
    </div>
  </template>
</div>

<style>
  .shopibundle-container {
    margin: 2rem 0;
    padding: 1.5rem;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
  }

  .shopibundle-heading {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .shopibundle-bundle {
    display: flex;
    flex-direction: {{ block.settings.layout == 'vertical' ? 'column' : 'row' }};
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .shopibundle-savings-badge {
    background: {{ block.settings.accent_color }};
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .shopibundle-original-price {
    text-decoration: line-through;
    color: #666;
  }

  .shopibundle-discounted-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: {{ block.settings.accent_color }};
  }

  .shopibundle-add-btn {
    background: {{ block.settings.accent_color }};
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .shopibundle-add-btn:hover {
    opacity: 0.9;
  }

  .shopibundle-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #e5e5e5;
    border-top-color: {{ block.settings.accent_color }};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
```

```javascript
// extensions/theme-app-extension/assets/bundle-selector.js

(function() {
  'use strict';

  const PROXY_URL = '/apps/shopibundle/proxy';

  class ShopiBundleSelector {
    constructor(container) {
      this.container = container;
      this.productId = container.dataset.productId;
      this.shop = container.dataset.shop;
      this.loadingEl = container.querySelector('.shopibundle-loading');
      this.bundlesEl = container.querySelector('.shopibundle-bundles');
      this.template = container.querySelector('#shopibundle-template');

      this.init();
    }

    async init() {
      try {
        const bundles = await this.fetchBundles();

        if (bundles.length === 0) {
          this.container.style.display = 'none';
          return;
        }

        this.renderBundles(bundles);
        this.loadingEl.style.display = 'none';
        this.bundlesEl.style.display = 'block';

        // Track impressions
        bundles.forEach(bundle => this.trackEvent(bundle.id, 'impression'));
      } catch (error) {
        console.error('ShopIBundle: Failed to load bundles', error);
        this.container.style.display = 'none';
      }
    }

    async fetchBundles() {
      const response = await fetch(
        `${PROXY_URL}/bundles?product_id=${this.productId}&shop=${this.shop}`
      );

      if (!response.ok) throw new Error('Failed to fetch bundles');

      const data = await response.json();
      return data.bundles || [];
    }

    renderBundles(bundles) {
      this.bundlesEl.innerHTML = '';

      bundles.forEach(bundle => {
        const node = this.template.content.cloneNode(true);
        const bundleEl = node.querySelector('.shopibundle-bundle');

        bundleEl.dataset.bundleId = bundle.id;

        // Render products
        const productsEl = node.querySelector('.shopibundle-products');
        bundle.components.forEach((comp, index) => {
          const productHtml = `
            <div class="shopibundle-product">
              <img src="${comp.imageUrl}" alt="${comp.title}" width="60" height="60">
              <span class="shopibundle-product-title">${comp.title}</span>
              ${comp.quantity > 1 ? `<span class="shopibundle-qty">x${comp.quantity}</span>` : ''}
            </div>
            ${index < bundle.components.length - 1 ? '<span class="shopibundle-plus">+</span>' : ''}
          `;
          productsEl.insertAdjacentHTML('beforeend', productHtml);
        });

        // Set pricing
        const savingsEl = node.querySelector('.savings-percent');
        if (savingsEl) savingsEl.textContent = bundle.pricing.savingsPercentage;

        node.querySelector('.shopibundle-original-price').textContent =
          this.formatMoney(bundle.pricing.originalPrice);
        node.querySelector('.shopibundle-discounted-price').textContent =
          this.formatMoney(bundle.pricing.discountedPrice);

        // Add to cart handler
        const addBtn = node.querySelector('.shopibundle-add-btn');
        addBtn.addEventListener('click', () => this.addToCart(bundle));

        // Click tracking
        bundleEl.addEventListener('click', (e) => {
          if (e.target !== addBtn) {
            this.trackEvent(bundle.id, 'click');
          }
        });

        this.bundlesEl.appendChild(node);
      });
    }

    async addToCart(bundle) {
      const items = bundle.components.map(comp => ({
        id: comp.variantId || comp.productId,
        quantity: comp.quantity,
      }));

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });

        if (response.ok) {
          this.trackEvent(bundle.id, 'add_to_cart');

          // Trigger cart update (theme-specific)
          document.dispatchEvent(new CustomEvent('cart:refresh'));

          // Show success feedback
          this.showFeedback('Bundle added to cart!');
        }
      } catch (error) {
        console.error('Failed to add bundle to cart:', error);
        this.showFeedback('Failed to add bundle. Please try again.', true);
      }
    }

    async trackEvent(bundleId, eventType) {
      try {
        await fetch(`${PROXY_URL}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shop: this.shop,
            bundleId,
            productId: this.productId,
            eventType,
            sessionId: this.getSessionId(),
          }),
        });
      } catch (e) {
        // Silent fail for analytics
      }
    }

    getSessionId() {
      let sessionId = sessionStorage.getItem('shopibundle_session');
      if (!sessionId) {
        sessionId = 'sb_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('shopibundle_session', sessionId);
      }
      return sessionId;
    }

    formatMoney(cents) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(cents / 100);
    }

    showFeedback(message, isError = false) {
      const feedback = document.createElement('div');
      feedback.className = `shopibundle-feedback ${isError ? 'error' : 'success'}`;
      feedback.textContent = message;
      this.container.appendChild(feedback);

      setTimeout(() => feedback.remove(), 3000);
    }
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.shopibundle-container').forEach(container => {
      new ShopiBundleSelector(container);
    });
  });
})();
```

---

## 7. Development Roadmap

### 7.1 Sprint Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEVELOPMENT ROADMAP                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Phase 1: Foundation (Sprints 1-2)     ████████░░░░░░░░░░░░  20%            │
│  Phase 2: Core Features (Sprints 3-5)  ░░░░░░░░░░░░░░░░░░░░   0%            │
│  Phase 3: Advanced (Sprints 6-8)       ░░░░░░░░░░░░░░░░░░░░   0%            │
│  Phase 4: Polish (Sprints 9-10)        ░░░░░░░░░░░░░░░░░░░░   0%            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Detailed Sprint Breakdown

#### **Sprint 1-2: Foundation & Migration** (4 weeks)

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Database schema migration | P0 | 3 days | Pending |
| New API v2 structure setup | P0 | 2 days | Pending |
| Bundle Engine core implementation | P0 | 5 days | Pending |
| Pricing Engine implementation | P0 | 4 days | Pending |
| Migrate existing bundles to new schema | P0 | 3 days | Pending |
| Unit tests for engines | P1 | 3 days | Pending |

**Deliverables:**
- [ ] New database schema deployed
- [ ] Bundle & Pricing engines functional
- [ ] Existing data migrated
- [ ] API v2 endpoints for CRUD

---

#### **Sprint 3-4: Inventory & Core Bundle Types** (4 weeks)

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Inventory sync system | P0 | 5 days | Pending |
| Webhook handlers for inventory | P0 | 3 days | Pending |
| Fixed bundle type (complete) | P0 | 3 days | Pending |
| BOGO bundle type | P0 | 4 days | Pending |
| Tiered pricing implementation | P0 | 4 days | Pending |
| Admin UI for new bundle types | P1 | 5 days | Pending |

**Deliverables:**
- [ ] Real-time inventory synchronization
- [ ] Fixed, BOGO, and Tiered bundles working
- [ ] Updated admin dashboard

---

#### **Sprint 5-6: Mix & Match + Storefront** (4 weeks)

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Mix & Match bundle type | P0 | 5 days | Pending |
| Component groups system | P0 | 3 days | Pending |
| Build-your-own box type | P1 | 5 days | Pending |
| Theme app extension | P0 | 5 days | Pending |
| Storefront proxy optimization | P1 | 3 days | Pending |
| Mobile-responsive bundle UI | P1 | 3 days | Pending |

**Deliverables:**
- [ ] Mix & Match bundles functional
- [ ] Theme extension blocks deployed
- [ ] Storefront integration working

---

#### **Sprint 7-8: Advanced Features** (4 weeks)

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Subscription bundle integration | P1 | 5 days | Pending |
| Gift bundle features | P2 | 3 days | Pending |
| Enhanced analytics dashboard | P1 | 5 days | Pending |
| A/B testing improvements | P2 | 3 days | Pending |
| Checkout UI extension | P1 | 5 days | Pending |
| Performance optimization | P1 | 4 days | Pending |

**Deliverables:**
- [ ] Subscription bundles with selling plans
- [ ] Gift bundles with messaging
- [ ] Comprehensive analytics
- [ ] Checkout extension

---

#### **Sprint 9-10: Polish & Launch** (4 weeks)

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Error handling & edge cases | P0 | 5 days | Pending |
| Documentation & help content | P1 | 3 days | Pending |
| Onboarding flow | P1 | 3 days | Pending |
| Performance testing & optimization | P0 | 4 days | Pending |
| Security audit | P0 | 3 days | Pending |
| Beta testing with merchants | P0 | 5 days | Pending |
| App store listing preparation | P1 | 2 days | Pending |

**Deliverables:**
- [ ] Production-ready application
- [ ] Documentation complete
- [ ] App store listing ready

---

### 7.3 Feature Priority Matrix

```
                          IMPACT
                    Low    Med    High
              ┌─────────┬─────────┬─────────┐
         Low  │         │ Gift    │ BOGO    │
              │         │ Bundles │ Bundles │
    EFFORT    ├─────────┼─────────┼─────────┤
         Med  │ A/B     │ Tiered  │ Mix &   │
              │ Testing │ Pricing │ Match   │
              ├─────────┼─────────┼─────────┤
        High  │         │ Checkout│ Subscr- │
              │         │ UI Ext  │ iptions │
              └─────────┴─────────┴─────────┘
```

### 7.4 MVP vs Enhanced Features

#### **MVP (Must Have for Launch)**

1. ✅ Fixed bundles with automatic discounts
2. ✅ Inventory synchronization
3. ✅ Basic bundle analytics
4. ✅ Theme extension for bundle display
5. ✅ BOGO bundle type
6. ✅ Tiered/volume pricing

#### **Enhanced (Post-MVP)**

1. 🔄 Mix & Match bundles
2. 🔄 Build-your-own box
3. 🔄 Subscription bundles
4. 🔄 Gift bundles with messaging
5. 🔄 Advanced A/B testing
6. 🔄 Checkout UI extension
7. 🔄 AI recommendation improvements

---

## 8. Technical Risks & Mitigations

### 8.1 Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Inventory sync delays | Medium | High | Implement webhook + polling fallback |
| Shopify API rate limits | High | Medium | Implement request queuing with Redis |
| Complex pricing calculations | Medium | Medium | Comprehensive unit tests + edge case handling |
| Theme compatibility issues | High | Medium | Multiple layout options + CSS isolation |
| Database performance at scale | Low | High | Proper indexing + read replicas |
| Discount stacking conflicts | Medium | High | Clear rules engine + merchant controls |

### 8.2 Technical Debt Management

1. **Code Quality**
   - ESLint + Prettier enforced
   - TypeScript strict mode
   - Minimum 80% test coverage for engines

2. **Documentation**
   - API documentation with OpenAPI/Swagger
   - Architecture decision records (ADRs)
   - Inline code documentation

3. **Monitoring**
   - Error tracking with Sentry
   - Performance monitoring with Vercel Analytics
   - Custom metrics for bundle operations

### 8.3 Scalability Considerations

```typescript
// lib/config/performance.ts

export const PERFORMANCE_CONFIG = {
  // Caching
  BUNDLE_CACHE_TTL: 300, // 5 minutes
  PRODUCT_CACHE_TTL: 600, // 10 minutes
  INVENTORY_CACHE_TTL: 60, // 1 minute

  // Rate Limiting
  API_RATE_LIMIT: 100, // requests per minute
  SHOPIFY_RATE_LIMIT_BUFFER: 0.8, // Stay at 80% of limit

  // Batch Processing
  MAX_BATCH_SIZE: 50,
  WEBHOOK_PROCESSING_DELAY: 100, // ms between webhook batches

  // Background Jobs
  INVENTORY_SYNC_INTERVAL: 300000, // 5 minutes
  ANALYTICS_AGGREGATION_INTERVAL: 3600000, // 1 hour

  // Database
  CONNECTION_POOL_SIZE: 10,
  QUERY_TIMEOUT: 30000, // 30 seconds
};
```

---

## 9. Next Steps

### Immediate Actions (This Week)

1. **Review and approve this architecture document**
2. **Set up development environment**
   - Create new branch for v2 development
   - Set up Redis instance (Upstash)
   - Configure CI/CD pipeline

3. **Begin Sprint 1 tasks**
   - Start database schema migration
   - Implement Bundle Engine skeleton
   - Set up API v2 route structure

### Questions for Product Decision

1. Should we support bundle-as-product (creating actual Shopify products) for all bundle types or just fixed/subscription?
2. What's the priority for subscription bundles vs mix-and-match?
3. Do we need multi-currency support in MVP?
4. Should discounts stack with other store discounts by default?

---

**Document Version:** 1.0
**Last Updated:** January 2026
**Author:** Claude (AI Assistant)
**Status:** Ready for Review


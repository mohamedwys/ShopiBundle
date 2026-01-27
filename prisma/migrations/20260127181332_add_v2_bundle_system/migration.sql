-- CreateEnum
CREATE TYPE "BundleType" AS ENUM ('FIXED', 'MIX_MATCH', 'TIERED', 'BOGO', 'BUILD_YOUR_OWN', 'SUBSCRIPTION', 'GIFT');

-- CreateEnum
CREATE TYPE "BundleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SCHEDULED', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PriceAdjustmentType" AS ENUM ('NONE', 'FIXED_AMOUNT', 'PERCENTAGE', 'FIXED_PRICE');

-- CreateEnum
CREATE TYPE "PricingRuleType" AS ENUM ('BUNDLE_DISCOUNT', 'VOLUME_TIER', 'BOGO', 'MEMBER_PRICE', 'TIME_LIMITED', 'FIRST_PURCHASE');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FIXED_PRICE', 'FREE_ITEM');

-- CreateEnum
CREATE TYPE "InventoryMethod" AS ENUM ('COMPONENT_BASED', 'BUNDLE_SPECIFIC', 'UNLIMITED');

-- CreateTable
CREATE TABLE "auto_bundle_rules" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collections" TEXT[],
    "tags" TEXT[],
    "minPrice" TEXT NOT NULL,
    "maxPrice" TEXT NOT NULL,
    "minProducts" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auto_bundle_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "type" "BundleType" NOT NULL DEFAULT 'FIXED',
    "status" "BundleStatus" NOT NULL DEFAULT 'DRAFT',
    "shopifyProductId" TEXT,
    "shopifyMetaobjectId" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "featuredImage" TEXT,
    "images" TEXT[],
    "currencyCode" TEXT NOT NULL DEFAULT 'USD',
    "tags" TEXT[],
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleComponent" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "shopifyProductId" TEXT NOT NULL,
    "shopifyVariantId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "groupId" TEXT,
    "minQuantity" INTEGER NOT NULL DEFAULT 0,
    "maxQuantity" INTEGER NOT NULL DEFAULT 1,
    "priceAdjustment" DECIMAL(10,2),
    "priceAdjustmentType" "PriceAdjustmentType" NOT NULL DEFAULT 'NONE',
    "cachedTitle" TEXT,
    "cachedPrice" DECIMAL(10,2),
    "cachedCompareAtPrice" DECIMAL(10,2),
    "cachedImageUrl" TEXT,
    "cachedSku" TEXT,
    "cachedInventory" INTEGER,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BundleComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundlePricingRule" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ruleType" "PricingRuleType" NOT NULL DEFAULT 'BUNDLE_DISCOUNT',
    "conditions" JSONB NOT NULL DEFAULT '{}',
    "discountType" "DiscountType" NOT NULL DEFAULT 'PERCENTAGE',
    "discountValue" DECIMAL(10,2) NOT NULL,
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BundlePricingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleDiscount" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "shopifyDiscountId" TEXT NOT NULL,
    "discountCode" TEXT,
    "discountType" TEXT NOT NULL DEFAULT 'automatic',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BundleDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleInventory" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "trackingMethod" "InventoryMethod" NOT NULL DEFAULT 'COMPONENT_BASED',
    "bundleQuantity" INTEGER,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 10,
    "availableQuantity" INTEGER NOT NULL DEFAULT 0,
    "reservedQuantity" INTEGER NOT NULL DEFAULT 0,
    "allowOversell" BOOLEAN NOT NULL DEFAULT false,
    "autoSyncEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastCalculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BundleInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleAnalytics" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "addToCarts" INTEGER NOT NULL DEFAULT 0,
    "orders" INTEGER NOT NULL DEFAULT 0,
    "unitsSold" INTEGER NOT NULL DEFAULT 0,
    "revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "averageOrderValue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BundleAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleEvent" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "sessionId" TEXT,
    "customerId" TEXT,
    "orderId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "revenue" DECIMAL(10,2),
    "metadata" JSONB,
    "source" TEXT,
    "deviceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BundleEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventorySyncLog" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "syncType" TEXT NOT NULL,
    "previousQuantity" INTEGER NOT NULL,
    "newQuantity" INTEGER NOT NULL,
    "triggerProductId" TEXT,
    "success" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventorySyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auto_bundle_rules_shop_idx" ON "auto_bundle_rules"("shop");

-- CreateIndex
CREATE INDEX "Bundle_shop_status_idx" ON "Bundle"("shop", "status");

-- CreateIndex
CREATE INDEX "Bundle_shop_type_idx" ON "Bundle"("shop", "type");

-- CreateIndex
CREATE INDEX "Bundle_createdAt_idx" ON "Bundle"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Bundle_shop_slug_key" ON "Bundle"("shop", "slug");

-- CreateIndex
CREATE INDEX "BundleComponent_bundleId_idx" ON "BundleComponent"("bundleId");

-- CreateIndex
CREATE INDEX "BundleComponent_shopifyProductId_idx" ON "BundleComponent"("shopifyProductId");

-- CreateIndex
CREATE INDEX "BundleComponent_groupId_idx" ON "BundleComponent"("groupId");

-- CreateIndex
CREATE INDEX "BundlePricingRule_bundleId_isActive_idx" ON "BundlePricingRule"("bundleId", "isActive");

-- CreateIndex
CREATE INDEX "BundlePricingRule_priority_idx" ON "BundlePricingRule"("priority");

-- CreateIndex
CREATE INDEX "BundleDiscount_shopifyDiscountId_idx" ON "BundleDiscount"("shopifyDiscountId");

-- CreateIndex
CREATE UNIQUE INDEX "BundleDiscount_bundleId_shopifyDiscountId_key" ON "BundleDiscount"("bundleId", "shopifyDiscountId");

-- CreateIndex
CREATE UNIQUE INDEX "BundleInventory_bundleId_key" ON "BundleInventory"("bundleId");

-- CreateIndex
CREATE INDEX "BundleInventory_bundleId_idx" ON "BundleInventory"("bundleId");

-- CreateIndex
CREATE INDEX "BundleAnalytics_date_idx" ON "BundleAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "BundleAnalytics_bundleId_date_key" ON "BundleAnalytics"("bundleId", "date");

-- CreateIndex
CREATE INDEX "BundleEvent_shop_bundleId_idx" ON "BundleEvent"("shop", "bundleId");

-- CreateIndex
CREATE INDEX "BundleEvent_eventType_idx" ON "BundleEvent"("eventType");

-- CreateIndex
CREATE INDEX "BundleEvent_createdAt_idx" ON "BundleEvent"("createdAt");

-- CreateIndex
CREATE INDEX "InventorySyncLog_shop_bundleId_idx" ON "InventorySyncLog"("shop", "bundleId");

-- CreateIndex
CREATE INDEX "InventorySyncLog_createdAt_idx" ON "InventorySyncLog"("createdAt");

-- CreateIndex
CREATE INDEX "session_shop_idx" ON "session"("shop");

-- AddForeignKey
ALTER TABLE "BundleComponent" ADD CONSTRAINT "BundleComponent_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundlePricingRule" ADD CONSTRAINT "BundlePricingRule_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleDiscount" ADD CONSTRAINT "BundleDiscount_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleInventory" ADD CONSTRAINT "BundleInventory_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleAnalytics" ADD CONSTRAINT "BundleAnalytics_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleEvent" ADD CONSTRAINT "BundleEvent_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

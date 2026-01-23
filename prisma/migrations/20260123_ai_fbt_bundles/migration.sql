-- AI-generated FBT bundles
CREATE TABLE "ai_fbt_bundles" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "bundledProductIds" TEXT[] NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "support" DOUBLE PRECISION NOT NULL,
    "lift" DOUBLE PRECISION NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'AI',
    "variantGroupId" TEXT,
    "bundleMetaobjectId" TEXT,
    "discountId" TEXT,
    "isManualOverride" BOOLEAN NOT NULL DEFAULT false,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_fbt_bundles_pkey" PRIMARY KEY ("id")
);

-- Event tracking for AI bundles
CREATE TABLE "ai_bundle_events" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "variantGroupId" TEXT,
    "sessionId" TEXT,
    "customerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "ai_bundle_events_pkey" PRIMARY KEY ("id")
);

-- A/B test variant assignments
CREATE TABLE "ai_bundle_ab_assignments" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantGroupId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_bundle_ab_assignments_pkey" PRIMARY KEY ("id")
);

-- AI FBT configuration per shop
CREATE TABLE "ai_fbt_config" (
    "shop" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "minSupport" DOUBLE PRECISION NOT NULL DEFAULT 0.01,
    "minConfidence" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "minLift" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "maxBundlesPerProduct" INTEGER NOT NULL DEFAULT 3,
    "lookbackDays" INTEGER NOT NULL DEFAULT 90,
    "lastGeneratedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_fbt_config_pkey" PRIMARY KEY ("shop")
);

-- Indexes
CREATE INDEX "ai_fbt_bundles_shop_productId_idx" ON "ai_fbt_bundles"("shop", "productId");
CREATE INDEX "ai_fbt_bundles_shop_isActive_idx" ON "ai_fbt_bundles"("shop", "isActive");
CREATE INDEX "ai_bundle_events_shop_bundleId_idx" ON "ai_bundle_events"("shop", "bundleId");
CREATE INDEX "ai_bundle_events_shop_eventType_idx" ON "ai_bundle_events"("shop", "eventType");
CREATE INDEX "ai_bundle_events_createdAt_idx" ON "ai_bundle_events"("createdAt");
CREATE INDEX "ai_bundle_ab_assignments_sessionId_productId_idx" ON "ai_bundle_ab_assignments"("sessionId", "productId");
CREATE INDEX "ai_bundle_ab_assignments_expiresAt_idx" ON "ai_bundle_ab_assignments"("expiresAt");

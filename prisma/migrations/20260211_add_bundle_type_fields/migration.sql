-- AlterTable: Add new bundle type fields
-- These columns support the new bundle types: SUBSCRIPTION, GIFT, MIX_MATCH, BUILD_YOUR_OWN

-- Selling plan group reference for SUBSCRIPTION bundles
ALTER TABLE "Bundle" ADD COLUMN "sellingPlanGroupId" TEXT;

-- Type-specific JSON settings
ALTER TABLE "Bundle" ADD COLUMN "selectionRules" JSONB;
ALTER TABLE "Bundle" ADD COLUMN "giftSettings" JSONB;
ALTER TABLE "Bundle" ADD COLUMN "subscriptionSettings" JSONB;

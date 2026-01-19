-- Migration: Add support for multiple auto bundle rules
-- Run this migration with: npx prisma db push or npx prisma migrate dev

-- Create new auto_bundle_rules table
CREATE TABLE IF NOT EXISTS "auto_bundle_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collections" TEXT[] NOT NULL,
    "tags" TEXT[] NOT NULL,
    "minPrice" TEXT NOT NULL,
    "maxPrice" TEXT NOT NULL,
    "minProducts" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create index for shop
CREATE INDEX IF NOT EXISTS "auto_bundle_rules_shop_idx" ON "auto_bundle_rules"("shop");

-- Migrate existing data from auto_bundle_data to auto_bundle_rules
-- This will convert the single auto bundle per shop to a rule
INSERT INTO "auto_bundle_rules" ("id", "shop", "name", "collections", "tags", "minPrice", "maxPrice", "minProducts", "discount", "isActive", "createdAt", "updatedAt")
SELECT
    md5(random()::text || clock_timestamp()::text)::text as "id",
    "shop",
    'Migrated Auto Bundle' as "name",
    "collections",
    "tags",
    "minPrice",
    "maxPrice",
    "minProducts",
    "discount",
    true as "isActive",
    CURRENT_TIMESTAMP as "createdAt",
    CURRENT_TIMESTAMP as "updatedAt"
FROM "auto_bundle_data"
ON CONFLICT DO NOTHING;

-- Note: auto_bundle_data table is kept for backwards compatibility
-- but will not be used in new code

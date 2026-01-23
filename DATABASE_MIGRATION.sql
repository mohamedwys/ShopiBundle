-- =====================================================
-- SHOPIFY OAUTH FIX - DATABASE MIGRATION
-- Run this SQL on your PostgreSQL database
-- =====================================================

-- Create oauth_state table for cookieless OAuth flow
CREATE TABLE IF NOT EXISTS "oauth_state" (
    "state" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_state_pkey" PRIMARY KEY ("state")
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "oauth_state_shop_idx" ON "oauth_state"("shop");
CREATE INDEX IF NOT EXISTS "oauth_state_createdAt_idx" ON "oauth_state"("createdAt");

-- Add index to session table if not exists (performance optimization)
CREATE INDEX IF NOT EXISTS "session_shop_idx" ON "session"("shop");

-- Verify tables were created
SELECT 'oauth_state table created successfully' AS status
WHERE EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'oauth_state'
);

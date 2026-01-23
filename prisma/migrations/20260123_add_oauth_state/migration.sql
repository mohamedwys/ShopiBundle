-- CreateTable
CREATE TABLE "oauth_state" (
    "state" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_state_pkey" PRIMARY KEY ("state")
);

-- CreateIndex
CREATE INDEX "oauth_state_shop_idx" ON "oauth_state"("shop");

-- CreateIndex
CREATE INDEX "oauth_state_createdAt_idx" ON "oauth_state"("createdAt");

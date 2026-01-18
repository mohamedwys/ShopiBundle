-- CreateTable
CREATE TABLE "active_stores" (
    "shop" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT false,

    CONSTRAINT "active_stores_pkey" PRIMARY KEY ("shop")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "shop" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auto_bundle_data" (
    "shop" TEXT NOT NULL,
    "collections" TEXT[],
    "tags" TEXT[],
    "minPrice" TEXT NOT NULL,
    "maxPrice" TEXT NOT NULL,
    "minProducts" TEXT NOT NULL,
    "discount" TEXT NOT NULL,

    CONSTRAINT "auto_bundle_data_pkey" PRIMARY KEY ("shop")
);

-- CreateTable
CREATE TABLE "bundle_discount_id" (
    "bundleId" TEXT NOT NULL,
    "bundleName" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "shop" TEXT NOT NULL,

    CONSTRAINT "bundle_discount_id_pkey" PRIMARY KEY ("bundleId")
);

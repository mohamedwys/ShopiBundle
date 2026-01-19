-- AlterTable
ALTER TABLE "active_stores" ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "lastErrorAt" TIMESTAMP(3),
ADD COLUMN     "setupError" TEXT;

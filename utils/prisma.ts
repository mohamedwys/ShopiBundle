import { PrismaClient } from "@prisma/client";

// PrismaClient configuration for serverless environments (Vercel)
// This ensures consistent connection handling across function invocations
// See: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use singleton pattern in BOTH development and production for serverless
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Always cache in global to prevent connection issues in serverless
globalForPrisma.prisma = prisma;

export default prisma;

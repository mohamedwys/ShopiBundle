/**
 * APP_UNINSTALLED Webhook Handler
 *
 * Performs comprehensive cleanup of ALL app-owned data when a merchant
 * uninstalls the app. This covers three categories:
 *
 * PHASE 1 — Shopify Resource Cleanup (best-effort, needs valid session)
 *   - Metaobjects of type "product-bundles" (storefront bundle data)
 *   - Automatic discounts created by the app
 *   NOTE: The access token may already be revoked by the time this fires.
 *   All Shopify API calls are best-effort. Function-based discounts will
 *   auto-deactivate when the Function extension is uninstalled.
 *
 * PHASE 2 — Database Cleanup (guaranteed)
 *   Deletes ALL shop records across every table, in correct dependency order:
 *   - Bundle (CASCADE → BundleComponent, BundlePricingRule, BundleDiscount,
 *     BundleInventory, BundleAnalytics, BundleEvent)
 *   - BundleOrder, InventorySyncLog
 *   - AI: ai_fbt_bundles, ai_bundle_events, ai_bundle_ab_assignments, ai_fbt_config
 *   - Legacy: auto_bundle_data, auto_bundle_rules, bundle_discount_id
 *   - Billing: MonthlyRevenue, ShopSettings
 *   - Auth: oauth_state
 *
 * PHASE 3 — Session & Store Status (always last)
 *   - Delete sessions (last, since Phase 1 needs the access token)
 *   - Mark active_stores as inactive
 *
 * Design principles:
 *   - Idempotent: running twice on the same shop is safe
 *   - Partial failure: each operation is independent; failures are logged
 *     but don't block subsequent cleanup steps
 *   - Never throws: the webhook always succeeds to prevent Shopify retries
 *     piling up on a broken handler
 *   - Prevents data leaks on reinstall: all PII and business data is removed
 */

import prisma from "@/utils/prisma";
import clientProvider from "@/utils/clientProvider";

// ============================================
// GraphQL Queries & Mutations
// ============================================

/** Paginated query for all metaobjects of our bundle type */
const QUERY_ALL_METAOBJECTS = `
  query GetAllBundleMetaobjects($type: String!, $first: Int!, $after: String) {
    metaobjects(type: $type, first: $first, after: $after) {
      edges {
        node {
          id
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const DELETE_METAOBJECT_MUTATION = `
  mutation DeleteBundleMetaobject($id: ID!) {
    metaobjectDelete(id: $id) {
      deletedId
      userErrors {
        field
        message
      }
    }
  }
`;

const DELETE_DISCOUNT_MUTATION = `
  mutation DeleteBundleDiscount($id: ID!) {
    discountAutomaticDelete(id: $id) {
      deletedAutomaticDiscountId
      userErrors {
        field
        message
      }
    }
  }
`;

// ============================================
// Main Handler
// ============================================

const appUninstallHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: string
) => {
  console.log(`[Uninstall] Starting cleanup for shop: ${shop}`);
  const errors: string[] = [];

  // ------------------------------------------
  // PHASE 1: Collect Shopify resource IDs from DB
  // (must happen before DB cleanup)
  // ------------------------------------------
  const discountIds = await collectDiscountIds(shop);
  const metaobjectIds = await collectMetaobjectIds(shop);

  console.log(
    `[Uninstall] Found ${discountIds.size} discounts, ${metaobjectIds.size} metaobjects in DB for ${shop}`
  );

  // ------------------------------------------
  // PHASE 2: Best-effort Shopify resource cleanup
  // (must happen before session deletion)
  // ------------------------------------------
  await cleanupShopifyResources(shop, discountIds, metaobjectIds, errors);

  // ------------------------------------------
  // PHASE 3: Guaranteed database cleanup
  // ------------------------------------------
  await cleanupDatabase(shop, errors);

  // ------------------------------------------
  // PHASE 4: Session & store status (always last)
  // ------------------------------------------
  await safeDelete(
    () => prisma.session.deleteMany({ where: { shop } }),
    "session",
    shop,
    errors
  );

  await safeOperation(
    () =>
      prisma.active_stores.upsert({
        where: { shop },
        update: { isActive: false },
        create: { shop, isActive: false },
      }),
    "active_stores upsert",
    shop,
    errors
  );

  // ------------------------------------------
  // Summary
  // ------------------------------------------
  if (errors.length > 0) {
    console.warn(
      `[Uninstall] Completed with ${errors.length} error(s) for ${shop}:`,
      errors
    );
  } else {
    console.log(`[Uninstall] Cleanup completed successfully for ${shop}`);
  }
};

// ============================================
// Phase 1: Collect Shopify Resource IDs
// ============================================

/**
 * Collect all Shopify discount IDs from every DB table that stores them.
 * Three sources:
 *   - BundleDiscount (V2 bundles) → shopifyDiscountId
 *   - bundle_discount_id (legacy V1) → discountId
 *   - ai_fbt_bundles (AI system) → discountId
 */
async function collectDiscountIds(shop: string): Promise<Set<string>> {
  const ids = new Set<string>();

  try {
    // V2: BundleDiscount references Bundle which has shop
    const v2Discounts = await prisma.bundleDiscount.findMany({
      where: { bundle: { shop } },
      select: { shopifyDiscountId: true },
    });
    for (const d of v2Discounts) {
      if (d.shopifyDiscountId) ids.add(d.shopifyDiscountId);
    }
  } catch (e: any) {
    console.warn(`[Uninstall] Failed to collect V2 discount IDs: ${e.message}`);
  }

  try {
    // Legacy V1: bundle_discount_id has shop directly
    const legacyDiscounts = await prisma.bundle_discount_id.findMany({
      where: { shop },
      select: { discountId: true },
    });
    for (const d of legacyDiscounts) {
      if (d.discountId) ids.add(d.discountId);
    }
  } catch (e: any) {
    console.warn(`[Uninstall] Failed to collect legacy discount IDs: ${e.message}`);
  }

  try {
    // AI: ai_fbt_bundles has shop + optional discountId
    const aiBundles = await prisma.ai_fbt_bundles.findMany({
      where: { shop, discountId: { not: null } },
      select: { discountId: true },
    });
    for (const b of aiBundles) {
      if (b.discountId) ids.add(b.discountId);
    }
  } catch (e: any) {
    console.warn(`[Uninstall] Failed to collect AI discount IDs: ${e.message}`);
  }

  return ids;
}

/**
 * Collect all Shopify metaobject IDs from DB tables.
 * Two sources:
 *   - Bundle (V2) → shopifyMetaobjectId
 *   - ai_fbt_bundles (AI) → bundleMetaobjectId
 */
async function collectMetaobjectIds(shop: string): Promise<Set<string>> {
  const ids = new Set<string>();

  try {
    const bundles = await prisma.bundle.findMany({
      where: { shop, shopifyMetaobjectId: { not: null } },
      select: { shopifyMetaobjectId: true },
    });
    for (const b of bundles) {
      if (b.shopifyMetaobjectId) ids.add(b.shopifyMetaobjectId);
    }
  } catch (e: any) {
    console.warn(`[Uninstall] Failed to collect V2 metaobject IDs: ${e.message}`);
  }

  try {
    const aiBundles = await prisma.ai_fbt_bundles.findMany({
      where: { shop, bundleMetaobjectId: { not: null } },
      select: { bundleMetaobjectId: true },
    });
    for (const b of aiBundles) {
      if (b.bundleMetaobjectId) ids.add(b.bundleMetaobjectId);
    }
  } catch (e: any) {
    console.warn(`[Uninstall] Failed to collect AI metaobject IDs: ${e.message}`);
  }

  return ids;
}

// ============================================
// Phase 2: Shopify Resource Cleanup
// ============================================

/**
 * Delete all app-owned Shopify resources (metaobjects and discounts).
 *
 * This is best-effort because the access token may already be revoked
 * when the APP_UNINSTALLED webhook fires. Function-based discounts will
 * auto-deactivate when the extension is removed, so missing discount
 * cleanup is not a critical failure.
 *
 * Metaobjects, however, persist after uninstall and should be cleaned
 * to prevent stale storefront data and duplicates on reinstall.
 */
async function cleanupShopifyResources(
  shop: string,
  discountIds: Set<string>,
  dbMetaobjectIds: Set<string>,
  errors: string[]
) {
  let client: any;
  try {
    const result = await clientProvider.offline.graphqlClient({ shop });
    client = result.client;
  } catch (error: any) {
    console.warn(
      `[Uninstall] Cannot get Shopify client for ${shop}: ${error.message}. ` +
        `Shopify resources will not be cleaned up. Function discounts will auto-deactivate.`
    );
    errors.push(`Shopify client unavailable: ${error.message}`);
    return;
  }

  // --- Delete metaobjects ---
  // First, query Shopify for ALL metaobjects of our type.
  // This catches any that might not be tracked in our DB
  // (e.g., from failed creates that wrote to Shopify but didn't save the ID).
  const shopifyMetaobjectIds = await queryAllMetaobjectIds(client, shop, errors);

  // Merge DB-known IDs with Shopify-queried IDs (deduplicated)
  const allMetaobjectIds: string[] = [];
  dbMetaobjectIds.forEach((id) => allMetaobjectIds.push(id));
  shopifyMetaobjectIds.forEach((id) => {
    if (!dbMetaobjectIds.has(id)) allMetaobjectIds.push(id);
  });

  console.log(
    `[Uninstall] Deleting ${allMetaobjectIds.length} metaobjects for ${shop}` +
      ` (${dbMetaobjectIds.size} from DB, ${shopifyMetaobjectIds.size} from Shopify)`
  );

  for (let i = 0; i < allMetaobjectIds.length; i++) {
    const metaId = allMetaobjectIds[i];
    await retryOnRateLimit(
      () => deleteMetaobject(client, metaId),
      `metaobject ${metaId}`,
      shop,
      errors
    );
  }

  // --- Delete discounts ---
  const discountIdArray: string[] = [];
  discountIds.forEach((id) => discountIdArray.push(id));
  console.log(`[Uninstall] Deleting ${discountIdArray.length} discounts for ${shop}`);

  for (let i = 0; i < discountIdArray.length; i++) {
    const discId = discountIdArray[i];
    await retryOnRateLimit(
      () => deleteDiscount(client, discId),
      `discount ${discId}`,
      shop,
      errors
    );
  }
}

/**
 * Query Shopify for all metaobjects of type "product-bundles".
 * Paginates through all results (up to 250 per page).
 */
async function queryAllMetaobjectIds(
  client: any,
  shop: string,
  errors: string[]
): Promise<Set<string>> {
  const ids = new Set<string>();
  let hasNextPage = true;
  let cursor: string | null = null;
  let pageCount = 0;
  const MAX_PAGES = 20; // Safety limit: 20 pages × 250 = 5000 metaobjects max

  try {
    while (hasNextPage && pageCount < MAX_PAGES) {
      const response: any = await client.request(QUERY_ALL_METAOBJECTS, {
        variables: {
          type: "product-bundles",
          first: 250,
          after: cursor,
        },
      });

      const metaobjects = response.data?.metaobjects;
      if (!metaobjects) break;

      for (const edge of metaobjects.edges) {
        ids.add(edge.node.id);
      }

      hasNextPage = metaobjects.pageInfo.hasNextPage;
      cursor = metaobjects.pageInfo.endCursor;
      pageCount++;
    }
  } catch (error: any) {
    console.warn(
      `[Uninstall] Failed to query metaobjects from Shopify for ${shop}: ${error.message}`
    );
    errors.push(`Shopify metaobject query: ${error.message}`);
  }

  return ids;
}

/**
 * Delete a single metaobject. Ignores "not found" errors (already deleted).
 */
async function deleteMetaobject(client: any, id: string): Promise<void> {
  const response: any = await client.request(DELETE_METAOBJECT_MUTATION, {
    variables: { id },
  });

  const result = response.data?.metaobjectDelete;
  if (result?.userErrors?.length > 0) {
    const errorMessages = result.userErrors.map((e: any) => e.message).join(", ");
    // "not found" means it's already deleted — idempotent
    if (errorMessages.toLowerCase().includes("not found")) return;
    throw new Error(errorMessages);
  }
}

/**
 * Delete a single automatic discount. Ignores "not found" errors (already deleted).
 */
async function deleteDiscount(client: any, id: string): Promise<void> {
  const response: any = await client.request(DELETE_DISCOUNT_MUTATION, {
    variables: { id },
  });

  const result = response.data?.discountAutomaticDelete;
  if (result?.userErrors?.length > 0) {
    const errorMessages = result.userErrors.map((e: any) => e.message).join(", ");
    // "not found" / "does not exist" means already deleted — idempotent
    if (
      errorMessages.toLowerCase().includes("not found") ||
      errorMessages.toLowerCase().includes("does not exist")
    ) {
      return;
    }
    throw new Error(errorMessages);
  }
}

// ============================================
// Phase 3: Database Cleanup
// ============================================

/**
 * Delete ALL shop data from every database table.
 *
 * Deletion order rationale:
 * 1. Bundle (CASCADE handles 6 child tables) — core V2 data
 * 2. Standalone order/log tables (no FK constraints to Bundle)
 * 3. AI system tables (no FK constraints between them)
 * 4. Legacy V1 tables
 * 5. Billing tables
 * 6. Auth tables
 *
 * Each delete is independent: if one fails, the rest still execute.
 * All operations use deleteMany which is idempotent (0 matches = success).
 */
async function cleanupDatabase(shop: string, errors: string[]) {
  console.log(`[Uninstall] Starting database cleanup for ${shop}`);

  // --- V2 Bundle System ---
  // Delete Bundle records. Prisma CASCADE handles:
  //   BundleComponent, BundlePricingRule, BundleDiscount,
  //   BundleInventory, BundleAnalytics, BundleEvent
  await safeDelete(
    () => prisma.bundle.deleteMany({ where: { shop } }),
    "Bundle (+ cascaded children)",
    shop,
    errors
  );

  // --- Standalone order/log tables (no FK to Bundle) ---
  await safeDelete(
    () => prisma.bundleOrder.deleteMany({ where: { shop } }),
    "BundleOrder",
    shop,
    errors
  );

  await safeDelete(
    () => prisma.inventorySyncLog.deleteMany({ where: { shop } }),
    "InventorySyncLog",
    shop,
    errors
  );

  // --- AI System ---
  await safeDelete(
    () => prisma.ai_bundle_events.deleteMany({ where: { shop } }),
    "ai_bundle_events",
    shop,
    errors
  );

  await safeDelete(
    () => prisma.ai_bundle_ab_assignments.deleteMany({ where: { shop } }),
    "ai_bundle_ab_assignments",
    shop,
    errors
  );

  await safeDelete(
    () => prisma.ai_fbt_bundles.deleteMany({ where: { shop } }),
    "ai_fbt_bundles",
    shop,
    errors
  );

  await safeDelete(
    () => prisma.ai_fbt_config.delete({ where: { shop } }).catch(ignoreNotFound),
    "ai_fbt_config",
    shop,
    errors
  );

  // --- Legacy V1 ---
  await safeDelete(
    () => prisma.auto_bundle_rules.deleteMany({ where: { shop } }),
    "auto_bundle_rules",
    shop,
    errors
  );

  await safeDelete(
    () => prisma.auto_bundle_data.delete({ where: { shop } }).catch(ignoreNotFound),
    "auto_bundle_data",
    shop,
    errors
  );

  await safeDelete(
    () => prisma.bundle_discount_id.deleteMany({ where: { shop } }),
    "bundle_discount_id",
    shop,
    errors
  );

  // --- Billing ---
  await safeDelete(
    () => prisma.monthlyRevenue.deleteMany({ where: { shop } }),
    "MonthlyRevenue",
    shop,
    errors
  );

  await safeDelete(
    () => prisma.shopSettings.delete({ where: { shop } }).catch(ignoreNotFound),
    "ShopSettings",
    shop,
    errors
  );

  // --- Auth ---
  await safeDelete(
    () => prisma.oauth_state.deleteMany({ where: { shop } }),
    "oauth_state",
    shop,
    errors
  );

  console.log(`[Uninstall] Database cleanup finished for ${shop}`);
}

// ============================================
// Helpers
// ============================================

/**
 * Execute a delete operation safely. Logs errors but never throws.
 */
async function safeDelete(
  operation: () => Promise<any>,
  tableName: string,
  shop: string,
  errors: string[]
): Promise<void> {
  try {
    const result = await operation();
    const count = result?.count ?? 1;
    if (count > 0) {
      console.log(`[Uninstall] Deleted ${count} ${tableName} record(s) for ${shop}`);
    }
  } catch (error: any) {
    const msg = `Failed to delete ${tableName} for ${shop}: ${error.message}`;
    console.error(`[Uninstall] ${msg}`);
    errors.push(msg);
  }
}

/**
 * Execute any operation safely. Logs errors but never throws.
 */
async function safeOperation(
  operation: () => Promise<any>,
  label: string,
  shop: string,
  errors: string[]
): Promise<void> {
  try {
    await operation();
  } catch (error: any) {
    const msg = `Failed ${label} for ${shop}: ${error.message}`;
    console.error(`[Uninstall] ${msg}`);
    errors.push(msg);
  }
}

/**
 * Retry a Shopify API operation with exponential backoff on rate limits.
 * Skips silently on "not found" errors (resource already deleted = idempotent).
 * Max 3 retries with 1s, 2s, 4s backoff.
 */
async function retryOnRateLimit(
  operation: () => Promise<void>,
  resourceLabel: string,
  shop: string,
  errors: string[],
  maxRetries: number = 3
): Promise<void> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await operation();
      return;
    } catch (error: any) {
      const statusCode = error?.response?.statusCode || error?.code;
      const isRateLimit = statusCode === 429 || error.message?.includes("Throttled");

      if (isRateLimit && attempt < maxRetries) {
        const backoff = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.warn(
          `[Uninstall] Rate limited deleting ${resourceLabel} for ${shop}, ` +
            `retrying in ${backoff}ms (attempt ${attempt + 1}/${maxRetries})`
        );
        await sleep(backoff);
        continue;
      }

      // Not a rate limit or exhausted retries — log and move on
      const msg = `Failed to delete ${resourceLabel} for ${shop}: ${error.message}`;
      console.error(`[Uninstall] ${msg}`);
      errors.push(msg);
      return;
    }
  }
}

/**
 * Ignore Prisma "Record not found" errors for delete() on @id fields.
 * deleteMany doesn't throw on 0 matches, but delete() does.
 */
function ignoreNotFound(error: any): void {
  if (error?.code === "P2025") return; // Prisma: Record to delete does not exist
  throw error;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default appUninstallHandler;

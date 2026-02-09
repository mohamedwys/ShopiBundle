import { NextApiHandler } from "next";
import clientProvider from "@/utils/clientProvider";

/**
 * Proxy route for the React bundle widget.
 * Returns a complete BundleConfig object that the widget can render directly.
 *
 * Query params:
 *   - handle: Bundle slug/handle (for shortcode-based display)
 *   - product_id: Shopify product ID (for auto-injection)
 *   - shop: Shop domain
 *   - locale: Customer locale (optional)
 *   - currency: Currency code (optional)
 */
const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { handle, product_id, shop } = req.query;
    const shopDomain = shop || req.headers["x-shopify-shop-domain"];

    if (!shopDomain) {
      return res.status(400).json({ success: false, error: "Missing shop" });
    }

    if (!handle && !product_id) {
      return res.status(400).json({
        success: false,
        error: "Missing handle or product_id",
      });
    }

    // Get offline client for the shop
    let client;
    try {
      const result = await clientProvider.offline.graphqlClient({
        shop: shopDomain as string,
      });
      client = result.client;
    } catch (sessionError: any) {
      console.warn(`No session for shop ${shopDomain}: ${sessionError.message}`);
      return res.status(200).json({ success: false, error: "No session" });
    }

    // Query bundles from metaobjects
    const query = `
      query GetBundles($first: Int!, $type: String!) {
        metaobjects(type: $type, first: $first) {
          edges {
            node {
              id
              handle
              fields {
                key
                value
              }
            }
          }
        }
      }
    `;

    const response: any = await client.request(query, {
      variables: {
        type: "product-bundles",
        first: 50,
      },
    });

    const normalizedProductId = product_id?.toString() || "";
    const normalizedHandle = handle?.toString() || "";
    let matchedBundle: any = null;

    for (const edge of response.data.metaobjects.edges) {
      const bundle = edge.node;
      const fields: Record<string, string> = {};

      for (const field of bundle.fields) {
        fields[field.key] = field.value;
      }

      // Match by handle
      if (normalizedHandle && bundle.handle === normalizedHandle) {
        matchedBundle = { ...fields, _handle: bundle.handle, _id: bundle.id };
        break;
      }

      // Match by product_id
      if (normalizedProductId && fields.products) {
        let products: string[] = [];
        try {
          products = JSON.parse(fields.products);
        } catch {
          products = [fields.products];
        }

        const hasProduct = products.some(
          (pid: string) =>
            pid.includes(normalizedProductId) ||
            normalizedProductId.includes(pid)
        );

        if (hasProduct) {
          matchedBundle = { ...fields, _handle: bundle.handle, _id: bundle.id };
          break;
        }
      }
    }

    if (!matchedBundle) {
      return res.status(200).json({ success: false, error: "No bundle found" });
    }

    // Parse products and fetch their data
    let productIds: string[] = [];
    try {
      productIds = JSON.parse(matchedBundle.products || "[]");
    } catch {
      productIds = [];
    }

    // Fetch product details via GraphQL
    const productsData = await fetchProducts(client, productIds);

    // Build the widget config
    const discount = parseFloat(matchedBundle.discount || "0");
    const bundleType = matchedBundle.bundle_type || "fixed";

    const config = buildWidgetConfig({
      id: matchedBundle._handle,
      title: matchedBundle.bundle_title || matchedBundle.bundle_name || "Bundle Deal",
      description: matchedBundle.description || "",
      type: bundleType,
      discount,
      products: productsData,
      metadata: matchedBundle,
    });

    // Set cache headers (cache for 5 minutes on CDN, revalidate)
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

    return res.status(200).json({
      success: true,
      config,
    });
  } catch (error) {
    console.error("Error in bundle-widget proxy:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

/**
 * Fetch product details from Shopify
 */
async function fetchProducts(client: any, productIds: string[]): Promise<any[]> {
  if (productIds.length === 0) return [];

  // Build GraphQL IDs
  const gids = productIds.map((id) =>
    id.startsWith("gid://") ? id : `gid://shopify/Product/${id}`
  );

  const query = `
    query GetProducts($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            maxVariantPrice {
              amount
            }
          }
          availableForSale
          totalInventory
          variants(first: 20) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                }
                availableForSale
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response: any = await client.request(query, {
      variables: { ids: gids },
    });

    return (response.data.nodes || []).filter(Boolean).map((product: any) => ({
      productId: product.id,
      handle: product.handle,
      title: product.title,
      price: parseFloat(product.priceRange.minVariantPrice.amount),
      compareAtPrice: product.compareAtPriceRange?.maxVariantPrice?.amount
        ? parseFloat(product.compareAtPriceRange.maxVariantPrice.amount)
        : undefined,
      imageUrl: product.featuredImage?.url || "",
      imageAlt: product.featuredImage?.altText || product.title,
      available: product.availableForSale,
      inventoryQuantity: product.totalInventory,
      variantId: product.variants.edges[0]?.node.id || "",
      quantity: 1,
      isRequired: true,
      variants: product.variants.edges.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        price: parseFloat(edge.node.price.amount),
        compareAtPrice: edge.node.compareAtPrice?.amount
          ? parseFloat(edge.node.compareAtPrice.amount)
          : undefined,
        available: edge.node.availableForSale,
        inventoryQuantity: edge.node.quantityAvailable,
        options: edge.node.selectedOptions.map((opt: any) => ({
          name: opt.name,
          value: opt.value,
        })),
        imageUrl: edge.node.image?.url || "",
      })),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Build widget config from bundle and product data.
 * Generates appropriate tiers based on bundle type.
 */
function buildWidgetConfig(params: {
  id: string;
  title: string;
  description: string;
  type: string;
  discount: number;
  products: any[];
  metadata: Record<string, any>;
}) {
  const { id, title, description, type, discount, products, metadata } = params;

  // Determine currency from first product
  const currency = "USD";

  // Build tiers based on bundle type
  let tiers;
  let bundleType;

  switch (type) {
    case "volume":
    case "TIERED":
      bundleType = "volume";
      tiers = buildVolumeTiers(discount, products);
      break;
    case "bogo":
    case "BOGO":
      bundleType = "bogo";
      tiers = buildBogoTiers(products);
      break;
    case "fbt":
    case "MIX_MATCH":
      bundleType = "fbt";
      tiers = buildFbtTiers(discount);
      break;
    default:
      bundleType = "fixed";
      tiers = buildFixedTiers(discount, products);
      break;
  }

  return {
    id,
    type: bundleType,
    title,
    subtitle: description || undefined,
    description: undefined,
    tiers,
    products,
    visual: {
      layout: tiers.length <= 3 ? "list" : "list",
      colorScheme: "default",
      badgeStyle: "pill",
      showPerUnitPrice: bundleType === "volume",
      showSavingsAmount: true,
      showSavingsPercent: true,
      showCompareAtPrice: true,
      showProgressBar: bundleType === "volume" && tiers.length > 1,
      showProductImages: bundleType !== "volume",
      imageSize: "medium",
    },
    analytics: {
      enabled: true,
      trackingEndpoint: "/apps/proxy/ai/events/track",
    },
    settings: {
      currency,
      currencySymbol: "$",
      locale: "en",
      moneyFormat: "${{amount}}",
      addToCartBehavior: "drawer",
      showQuantitySelector: false,
      maxQuantity: 10,
      allowVariantSelection: true,
      outOfStockBehavior: "disable",
    },
  };
}

/**
 * Generate volume discount tiers (1x, 2x, 3x)
 */
function buildVolumeTiers(baseDiscount: number, products: any[]) {
  const tiers = [
    {
      id: "tier-1",
      label: "1 Pack",
      subtitle: "Standard price",
      quantity: 1,
      discountType: "percentage" as const,
      discountValue: 0,
      isDefault: false,
    },
    {
      id: "tier-2",
      label: "2 Pack",
      subtitle: "Most popular",
      quantity: 2,
      discountType: "percentage" as const,
      discountValue: Math.max(baseDiscount, 10),
      isDefault: true,
      badge: "Most Popular",
      badgeColor: "#ff6b35",
    },
    {
      id: "tier-3",
      label: "3 Pack",
      subtitle: "Best value",
      quantity: 3,
      discountType: "percentage" as const,
      discountValue: Math.max(baseDiscount * 1.5, 15),
      isDefault: false,
      badge: "Best Value",
      badgeColor: "#008060",
    },
  ];

  return tiers;
}

/**
 * Generate BOGO tiers
 */
function buildBogoTiers(products: any[]) {
  return [
    {
      id: "tier-single",
      label: "Buy 1",
      subtitle: "Single item",
      quantity: 1,
      discountType: "percentage" as const,
      discountValue: 0,
      isDefault: false,
    },
    {
      id: "tier-bogo",
      label: "Buy 1, Get 1 FREE",
      subtitle: "Best deal",
      quantity: 1,
      discountType: "free" as const,
      discountValue: 1,
      isDefault: true,
      badge: "BOGO FREE",
      badgeColor: "#d72c0d",
    },
  ];
}

/**
 * Generate FBT tiers (single tier for the bundle)
 */
function buildFbtTiers(discount: number) {
  return [
    {
      id: "tier-fbt",
      label: "Buy Together & Save",
      subtitle: `Save ${discount}% when bought together`,
      quantity: 1,
      discountType: "percentage" as const,
      discountValue: discount,
      isDefault: true,
      badge: discount >= 15 ? "Great Deal" : undefined,
      badgeColor: "#008060",
    },
  ];
}

/**
 * Generate fixed bundle tiers with upsell options
 */
function buildFixedTiers(discount: number, products: any[]) {
  const tiers = [
    {
      id: "tier-bundle",
      label: `Bundle (${products.length} items)`,
      subtitle: `Save ${discount}%`,
      quantity: 1,
      discountType: "percentage" as const,
      discountValue: discount,
      isDefault: true,
      badge: discount >= 10 ? "Bundle & Save" : undefined,
      badgeColor: "#2c6ecb",
    },
  ];

  // If discount is significant, add a higher tier option
  if (discount >= 5 && products.length >= 2) {
    tiers.unshift({
      id: "tier-single",
      label: "Buy Separately",
      subtitle: "No discount",
      quantity: 1,
      discountType: "percentage" as const,
      discountValue: 0,
      isDefault: false,
      badge: undefined,
      badgeColor: "",
    });
  }

  return tiers;
}

export default handler;

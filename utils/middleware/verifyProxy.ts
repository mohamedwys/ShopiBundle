import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Shopify App Proxy signature verification middleware.
 *
 * When Shopify forwards a request through the App Proxy, it appends
 * query parameters including a `signature` HMAC. This middleware:
 *
 * 1. Extracts all query params except `signature`
 * 2. Sorts them alphabetically by key
 * 3. Concatenates as `key=value` pairs
 * 4. Computes HMAC-SHA256 with the app secret
 * 5. Compares to the provided signature using timing-safe comparison
 * 6. Validates the timestamp is within tolerance (5 minutes)
 * 7. Sets `req.user_shop` to the verified shop domain
 *
 * Shopify docs: https://shopify.dev/docs/apps/online-store/app-proxy
 *
 * IMPORTANT: After verification, all downstream handlers MUST use
 * `req.user_shop` (not `req.query.shop`) for the shop domain.
 * This prevents cross-shop data access attacks where a malicious
 * actor replays a valid signature with a different shop parameter.
 */

/** Maximum age of a proxy request signature in milliseconds (5 minutes) */
const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000;

const verifyProxy = async (
  req: NextApiRequest & { user_shop?: string },
  res: NextApiResponse,
  next: () => Promise<void>
) => {
  try {
    const secret = process.env.SHOPIFY_API_SECRET;
    if (!secret) {
      console.error("[verifyProxy] SHOPIFY_API_SECRET not set");
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    const { signature, ...params } = req.query;

    if (!signature || typeof signature !== "string") {
      return res.status(401).json({
        success: false,
        message: "Missing proxy signature",
      });
    }

    // Validate timestamp freshness
    const timestamp = params.timestamp;
    if (timestamp) {
      const requestTime = parseInt(String(timestamp), 10) * 1000; // Shopify sends seconds
      const now = Date.now();
      const age = Math.abs(now - requestTime);

      if (isNaN(requestTime) || age > TIMESTAMP_TOLERANCE_MS) {
        return res.status(401).json({
          success: false,
          message: "Request expired",
        });
      }
    }

    // Build the query string for HMAC verification
    // Sort params alphabetically by key, concatenate as key=value
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => {
        const value = params[key];
        // Handle array values (Next.js parses repeated params as arrays)
        const strValue = Array.isArray(value) ? value.join(",") : String(value || "");
        return `${key}=${strValue}`;
      })
      .join("");

    const calculatedSignature = crypto
      .createHmac("sha256", secret)
      .update(sortedParams, "utf-8")
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks
    let isValid: boolean;
    try {
      isValid = crypto.timingSafeEqual(
        Buffer.from(calculatedSignature, "utf-8"),
        Buffer.from(signature, "utf-8")
      );
    } catch {
      // Buffer length mismatch means signatures don't match
      isValid = false;
    }

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Signature verification failed",
      });
    }

    // Validate shop parameter exists in the signed payload
    const shop = params.shop;
    if (!shop || typeof shop !== "string") {
      return res.status(401).json({
        success: false,
        message: "Missing shop in signed parameters",
      });
    }

    // Validate shop domain format (must be *.myshopify.com)
    if (!isValidShopDomain(String(shop))) {
      return res.status(401).json({
        success: false,
        message: "Invalid shop domain",
      });
    }

    // Set the verified shop domain on the request.
    // Downstream handlers MUST use this instead of req.query.shop
    // to prevent cross-shop data access.
    req.user_shop = String(shop);

    await next();
  } catch (e: any) {
    console.error("[verifyProxy] Error during verification:", e.message);
    return res.status(401).json({
      success: false,
      message: "Signature verification failed",
    });
  }
};

/**
 * Validate that a shop domain matches the expected Shopify format.
 * Must be a valid *.myshopify.com domain.
 */
function isValidShopDomain(shop: string): boolean {
  // Shopify shop domains: alphanumeric + hyphens, ending with .myshopify.com
  return /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop);
}

export default verifyProxy;

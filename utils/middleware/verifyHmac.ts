import crypto from "crypto";

/**
 * Middleware to verify Shopify webhook HMAC signatures.
 * Uses crypto.timingSafeEqual for timing-attack resistance.
 *
 * Note: GDPR handlers (customers_data_request, customers_redact, shop_redact)
 * implement their own HMAC verification directly and do NOT use this middleware.
 */
const verifyHmac = async (req: any, res: any, next: () => Promise<void>) => {
  try {
    const secret = process.env.SHOPIFY_API_SECRET;
    if (!secret) {
      console.error("[verifyHmac] SHOPIFY_API_SECRET not set");
      return res.status(401).json({ success: false, message: "Server configuration error" });
    }

    const hmac = req.headers["x-shopify-hmac-sha256"];
    if (!hmac) {
      return res.status(401).json({ success: false, message: "Missing HMAC header" });
    }

    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const generatedHash = crypto
      .createHmac("sha256", secret)
      .update(body, "utf8")
      .digest("base64");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedHash, "utf8"),
      Buffer.from(hmac, "utf8")
    );

    if (isValid) {
      await next();
    } else {
      return res.status(401).json({ success: false, message: "HMAC verification failed" });
    }
  } catch (e: any) {
    console.error("[verifyHmac] Error during verification:", e.message);
    return res.status(401).json({ success: false, message: "HMAC verification failed" });
  }
};

export default verifyHmac;

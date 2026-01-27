import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      shop,
      bundleId,
      productId,
      eventType,
      variantGroupId,
      sessionId,
      customerId,
      metadata,
    } = req.body;

    if (!shop || !bundleId || !productId || !eventType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const validEvents = ["impression", "click", "add_to_cart", "purchase"];
    if (!validEvents.includes(eventType)) {
      return res.status(400).json({ error: "Invalid event type" });
    }

    const event = await prisma.ai_bundle_events.create({
      data: {
        shop,
        bundleId,
        productId,
        eventType,
        variantGroupId: variantGroupId || null,
        sessionId: sessionId || null,
        customerId: customerId || null,
        metadata: metadata || null,
      },
    });

    return res.status(200).json({ success: true, event });
  } catch (error: any) {
    console.error("Track event error:", error);
    return res.status(500).json({
      error: "Failed to track event",
      message: error.message,
    });
  }
}

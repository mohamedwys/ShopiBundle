import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { shop } = req.query;

    if (!shop || typeof shop !== 'string') {
      return res.status(400).json({ error: "Shop parameter required" });
    }

    // Check sessions in database
    const sessions = await prisma.session.findMany({
      where: {
        shop: {
          contains: shop,
        },
      },
      select: {
        id: true,
        shop: true,
        content: false, // Don't expose sensitive data
      },
    });

    // Check active stores
    const store = await prisma.active_stores.findUnique({
      where: { shop },
    });

    return res.status(200).json({
      shop,
      sessionsFound: sessions.length,
      sessions: sessions.map(s => s.id),
      store: store ? {
        isActive: store.isActive,
        scope: store.scope,
        setupError: store.setupError,
        lastError: store.lastError,
      } : null,
    });
  } catch (error: any) {
    console.error("Debug sessions error:", error);
    return res.status(500).json({
      error: error?.message || "Unknown error",
    });
  }
};

export default handler;
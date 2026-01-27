import withMiddleware from "@/utils/middleware/withMiddleware";
import shopify from "@/utils/shopify";
import { NextApiHandler } from "next";
import { getDiscountData } from "@/utils/shopifyQueries";
import prisma from "@/utils/prisma";

export type getDiscountData = {
  automaticDiscount: {
    title: string;
    shortSummary: string;
    asyncUsageCount: number;
    createdAt: string;
  };
};

const handler: NextApiHandler = async (req, res) => {
  //Reject anything that's not a POST
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  // Use the session provided by verifyRequest middleware
  const session = req.user_session;

  if (!session) {
    console.error('✗ No session found in request context');
    return res.status(401).json({ error: "Unauthorized", message: "No session found" });
  }

  try {
    // Create GraphQL client with the validated session
    const client = new shopify.clients.Graphql({ session });

    const bundles = await prisma.bundle_discount_id.findMany();
    let data = [];

    for (let bundle of bundles) {
      const response: getDiscountData | null = await getDiscountData(
        client,
        bundle.discountId
      );

      if (response !== null) {
        data.push({
          bundleName: bundle.bundleName,
          title: response.automaticDiscount.title,
          createdAt: response.automaticDiscount.createdAt,
          summary: response.automaticDiscount.shortSummary,
          sales: response.automaticDiscount.asyncUsageCount,
        });
      }
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Exception while getting analytics data:", error);
    return res.status(500).send("message: Error while getting analytics data");
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withMiddleware("verifyRequest")(handler);

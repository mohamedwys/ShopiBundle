import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { NextApiHandler } from "next";
import prisma from "@/utils/prisma";
import { discountToggle } from "@/utils/shopifyQueries";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  const { client } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });

  const { ruleId, isActive } = JSON.parse(req.body);

  try {
    // Find the discount associated with this rule
    const discountData = await prisma.bundle_discount_id.findUnique({
      where: {
        bundleId: `auto-rule-${ruleId}`,
      },
    });

    // Toggle the Shopify discount if it exists
    if (discountData) {
      await discountToggle(client, discountData.discountId, isActive);
    }

    // Update the rule status in database
    const rule = await prisma.auto_bundle_rules.update({
      where: {
        id: ruleId,
      },
      data: {
        isActive: isActive,
      },
    });

    return res.status(200).json({ success: true, rule });
  } catch (error) {
    console.error("Exception while toggling auto bundle rule:", error);
    return res
      .status(500)
      .send("message: Error while toggling auto bundle rule");
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withMiddleware("verifyRequest")(handler);

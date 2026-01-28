import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { NextApiHandler } from "next";
import prisma from "@/utils/prisma";
import { discountDelete } from "@/utils/shopifyQueries";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  const { client, shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: false,
  });

  const { ruleId } = JSON.parse(req.body);

  try {
    // Find the discount associated with this rule
    const discountData = await prisma.bundle_discount_id.findUnique({
      where: {
        bundleId: `auto-rule-${ruleId}`,
      },
    });

    // Delete the discount if it exists
    if (discountData) {
      await discountDelete(client, [discountData.discountId]);
      await prisma.bundle_discount_id.delete({
        where: {
          bundleId: `auto-rule-${ruleId}`,
        },
      });
    }

    // Delete the rule
    await prisma.auto_bundle_rules.delete({
      where: {
        id: ruleId,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Exception while deleting auto bundle rule:", error);
    return res
      .status(500)
      .send("message: Error while deleting auto bundle rule");
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withMiddleware("verifyRequest")(handler);

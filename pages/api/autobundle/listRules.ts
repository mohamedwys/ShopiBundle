import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { NextApiHandler } from "next";
import prisma from "@/utils/prisma";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  const { shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });

  try {
    const rules = await prisma.auto_bundle_rules.findMany({
      where: {
        shop: shop,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(rules);
  } catch (error) {
    console.error("Exception while fetching auto bundle rules:", error);
    return res
      .status(500)
      .send("message: Error while fetching auto bundle rules");
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withMiddleware("verifyRequest")(handler);

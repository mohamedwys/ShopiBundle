import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { NextApiHandler } from "next";
import { deleteBundles, discountDelete } from "@/utils/shopifyQueries";
import prisma from "@/utils/prisma";

const handler: NextApiHandler = async (req, res) => {
  //Reject anything that's not a POST
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  const { client, shop, session } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: false,
  });

  try {
    const data = JSON.parse(req.body);
    // delete bundles
    const response: boolean = await deleteBundles(client, data.ids);
    if (response) {
      // delete discounts
      let deleteDiscountIds = [];

      for (const id of data.ids) {
        try {
          const deletedDiscountId = await prisma.bundle_discount_id.delete({
            where: {
              bundleId: id,
            },
          });
          if (deletedDiscountId?.discountId) {
            deleteDiscountIds.push(deletedDiscountId.discountId);
          }
        } catch (deleteError) {
          // Log but continue - bundle may not have discount record
          console.warn(`No discount record found for bundle ${id}, skipping discount deletion`);
        }
      }

      // Only delete discounts if we have any
      if (deleteDiscountIds.length > 0) {
        await discountDelete(client, deleteDiscountIds);
      }

      return res.status(200).send("message: Bundle deleted succesfully");
    }
    return res.status(400).send("message: Bad request");
  } catch (error) {
    console.error("Exception while getting bundles:", error);
    return res.status(500).send("message: Error while deleting bundles");
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withMiddleware("verifyRequest")(handler);

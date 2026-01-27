import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { NextApiHandler } from "next";
import { discountUpdate, editBundle } from "@/utils/shopifyQueries";
import { EditedBundleData } from "@/utils/shopifyQueries/editBundle";
import prisma from "@/utils/prisma";

const handler: NextApiHandler = async (req, res) => {
  //Reject anything that's not a POST
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  const { client, shop, session } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });

  try {
    // update bundle data
    const data: any = JSON.parse(req.body);
    const resposne: boolean = await editBundle(client, data);
    if (resposne) {
      // get discount Id
      const discountData = await prisma.bundle_discount_id.findUnique({
        where: {
          bundleId: data.id,
        },
      });

      // Check if discount data exists
      if (!discountData) {
        console.error(`No discount record found for bundle: ${data.id}`);
        return res.status(404).send("message: Bundle discount record not found");
      }

      // If products changed, update the discount with new products
      if (data.products && data.products.length > 0) {
        const { discountDelete, discountCreate } = await import(
          "@/utils/shopifyQueries"
        );

        // Delete old discount
        await discountDelete(client, [discountData.discountId]);

        // Create new discount with updated products
        const newDiscountId = await discountCreate(client, {
          title: `Bundle Discount - ${data.bundleName}`,
          discount: data.discount,
          products: data.products,
          minProducts: String(data.products.length),
        });

        // Update database with new discount ID
        await prisma.bundle_discount_id.update({
          where: {
            bundleId: data.id,
          },
          data: {
            bundleName: data.bundleName,
            discountId: newDiscountId,
          },
        });
      } else {
        // Only update discount percentage if products didn't change
        await discountUpdate(client, discountData.discountId, data.discount);

        await prisma.bundle_discount_id.update({
          where: {
            bundleId: data.id,
          },
          data: {
            bundleName: data.bundleName,
          },
        });
      }

      return res.status(200).send("message: Bundle saved successfully");
    }
    return res.status(400).send("message: Bad request");
  } catch (error) {
    console.error("Exception while saving edited bundle:", error);
    return res.status(500).send("message: Error while saving edited bundle");
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withMiddleware("verifyRequest")(handler);

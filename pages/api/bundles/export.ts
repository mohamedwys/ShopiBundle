import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { NextApiHandler } from "next";
import prisma from "@/utils/prisma";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(400).send({ text: "Method not allowed" });
  }

  const { client, shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });

  try {
    const format = req.query.format || "json";

    // Get all bundles for the shop
    const query = `
      query GetAllBundles($type: String!, $first: Int!) {
        metaobjects(type: $type, first: $first) {
          edges {
            node {
              id
              handle
              fields {
                key
                value
              }
            }
          }
        }
      }
    `;

    const response: any = await client.request(query, {
      variables: {
        type: "product-bundles",
        first: 250,
      },
    });

    const bundles = [];

    for (const edge of response.data.metaobjects.edges) {
      const bundle = edge.node;
      const fields: any = {};

      for (const field of bundle.fields) {
        fields[field.key] = field.value;
      }

      // Get discount info
      const discountInfo = await prisma.bundle_discount_id.findUnique({
        where: {
          bundleId: bundle.id,
        },
      });

      bundles.push({
        id: bundle.id,
        handle: bundle.handle,
        name: fields.bundle_name,
        title: fields.bundle_title,
        description: fields.description,
        discount: fields.discount,
        products: JSON.parse(fields.products || "[]"),
        created_at: fields.created_at,
        discountId: discountInfo?.discountId || null,
      });
    }

    if (format === "csv") {
      // Export as CSV
      const headers = [
        "ID",
        "Handle",
        "Name",
        "Title",
        "Description",
        "Discount",
        "Products",
        "Created At",
      ];
      const rows = bundles.map((b) => [
        b.id,
        b.handle,
        b.name,
        b.title,
        b.description,
        b.discount,
        b.products.join(";"),
        b.created_at,
      ]);

      const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=bundles-export-${Date.now()}.csv`
      );
      return res.status(200).send(csv);
    } else {
      // Export as JSON
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=bundles-export-${Date.now()}.json`
      );
      return res.status(200).json({ bundles, exportedAt: new Date().toISOString() });
    }
  } catch (error) {
    console.error("Error exporting bundles:", error);
    return res.status(500).send("message: Error while exporting bundles");
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withMiddleware("verifyRequest")(handler);

import withMiddleware from "@/utils/middleware/withMiddleware";
import clientProvider from "@/utils/clientProvider";
import { NextApiHandler } from "next";
import prisma from "@/utils/prisma";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  const { client, shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });

  try {
    const { startDate, endDate } = JSON.parse(req.body);

    const bundles = await prisma.bundle_discount_id.findMany({
      where: {
        shop: shop,
      },
    });

    let analyticsData = [];
    let totalRevenue = 0;
    let totalOrders = 0;

    for (let bundle of bundles) {
      // Get discount data with usage stats
      const discountQuery = `
        query GetDiscountAnalytics($id: ID!) {
          automaticDiscount: automaticDiscountNode(id: $id) {
            automaticDiscount {
              ... on DiscountAutomaticBasic {
                title
                shortSummary
                asyncUsageCount
                createdAt
              }
            }
          }
        }
      `;

      const discountResponse: any = await client.request(discountQuery, {
        variables: {
          id: bundle.discountId,
        },
      });

      const discount = discountResponse?.data?.automaticDiscount?.automaticDiscount;
      if (!discount) continue;

      const usageCount = discount.asyncUsageCount || 0;

      // Get orders containing bundle items to calculate revenue
      let bundleRevenue = 0;
      let conversionRate = 0;

      try {
        // Query orders with bundle line items
        const ordersQuery = `
          query GetBundleOrders($query: String!, $first: Int!) {
            orders(first: $first, query: $query) {
              edges {
                node {
                  id
                  name
                  totalPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  lineItems(first: 50) {
                    edges {
                      node {
                        id
                        name
                        quantity
                        originalTotalSet {
                          shopMoney {
                            amount
                          }
                        }
                        customAttributes {
                          key
                          value
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const dateFilter = startDate && endDate
          ? ` AND created_at:>='${startDate}' AND created_at:<='${endDate}'`
          : "";

        const ordersResponse: any = await client.request(ordersQuery, {
          variables: {
            query: `status:any${dateFilter}`,
            first: 250, // Increased limit for better accuracy
          },
        });

        // Calculate revenue from orders containing bundle items
        if (ordersResponse?.data?.orders?.edges) {
          for (const orderEdge of ordersResponse.data.orders.edges) {
            const order = orderEdge.node;
            let hasBundleItem = false;
            let bundleItemsTotal = 0;

            for (const lineItemEdge of order.lineItems.edges) {
              const lineItem = lineItemEdge.node;
              const bundleAttr = lineItem.customAttributes?.find(
                (attr: any) => attr.key === "_bundle_id" && attr.value === bundle.bundleName
              );

              if (bundleAttr) {
                hasBundleItem = true;
                bundleItemsTotal += parseFloat(lineItem.originalTotalSet.shopMoney.amount);
              }
            }

            if (hasBundleItem) {
              bundleRevenue += bundleItemsTotal;
            }
          }
        }

        // Calculate conversion rate (simplified - would need view tracking for accuracy)
        conversionRate = usageCount > 0 ? (usageCount / (usageCount + 100)) * 100 : 0; // Placeholder formula
      } catch (error) {
        console.error(`Error fetching orders for bundle ${bundle.bundleName}:`, error);
      }

      analyticsData.push({
        bundleId: bundle.bundleId,
        bundleName: bundle.bundleName,
        createdAt: discount.createdAt,
        summary: discount.shortSummary,
        sales: usageCount,
        revenue: bundleRevenue.toFixed(2),
        averageOrderValue: usageCount > 0 ? (bundleRevenue / usageCount).toFixed(2) : "0.00",
        conversionRate: conversionRate.toFixed(2),
      });

      totalRevenue += bundleRevenue;
      totalOrders += usageCount;
    }

    const response = {
      bundles: analyticsData,
      summary: {
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders,
        averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00",
        totalBundles: bundles.length,
      },
    };

    return res.status(200).json(JSON.stringify(response));
  } catch (error) {
    console.error("Exception while getting enhanced analytics:", error);
    return res.status(500).send("message: Error while getting enhanced analytics");
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withMiddleware("verifyRequest")(handler);

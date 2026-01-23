import { GraphqlClient } from "@shopify/shopify-api";

export interface Order {
  id: string;
  name: string;
  createdAt: string;
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        product: {
          id: string;
        } | null;
        quantity: number;
      };
    }>;
  };
}

export interface OrdersQuery {
  data: {
    orders: {
      edges: Array<{
        node: Order;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
}

export async function getOrders(
  client: GraphqlClient,
  startDate: string,
  cursor?: string | null,
  limit: number = 250
): Promise<{ orders: Order[]; hasNextPage: boolean; endCursor: string | null }> {
  const query = `
    query GetOrders($query: String!, $first: Int!, $after: String) {
      orders(first: $first, after: $after, query: $query) {
        edges {
          node {
            id
            name
            createdAt
            lineItems(first: 100) {
              edges {
                node {
                  id
                  quantity
                  product {
                    id
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const { body } = await client.query<OrdersQuery>({
    data: {
      query,
      variables: {
        query: `created_at:>=${startDate} AND financial_status:paid`,
        first: limit,
        after: cursor,
      },
    },
  });

  const edges = body.data?.orders?.edges || [];
  const orders = edges.map((edge) => edge.node);
  const pageInfo = body.data?.orders?.pageInfo || {
    hasNextPage: false,
    endCursor: null,
  };

  return {
    orders,
    hasNextPage: pageInfo.hasNextPage,
    endCursor: pageInfo.endCursor,
  };
}

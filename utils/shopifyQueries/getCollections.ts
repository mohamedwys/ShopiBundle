import { GraphqlClient } from "@shopify/shopify-api";

export type GetCollectionsQuery = {
  data: {
    collections: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          productsCount: {
            count: number;
          };
        };
      }>;
    };
  };
};

export async function getCollections(client: GraphqlClient) {
  const { body } = await client.query<GetCollectionsQuery>({
    data: {
      query: `query {
        collections(first: 250) {
          edges {
            node {
              id
              title
              handle
              productsCount {
                count
              }
            }
          }
        }
      }`,
    },
  });

  // Transform to flatten productsCount for backward compatibility
  return {
    edges: body.data.collections.edges.map(edge => ({
      node: {
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        productsCount: edge.node.productsCount.count,
      }
    }))
  };
}

import { GraphqlClient } from "@shopify/shopify-api";

export type GetBundleQuery = {
  data: {
    metaobject: {
      id: string;
      fields: Array<{
        key: string;
        value: string;
      }>;
    };
  };
};

export async function getBundle(client: GraphqlClient, id: string) {
  const { body } = await client.query<GetBundleQuery>({
    data: {
      query: `query ($id: ID!) {
        metaobject(id: $id) {
          id
          fields {
            key
            value
          }
        }
      }`,
      variables: {
        id: id,
      },
    },
  });
  return body.data?.metaobject;
}

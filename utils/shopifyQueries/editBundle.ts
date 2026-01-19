import { GraphqlClient } from "@shopify/shopify-api";

export interface EditedBundleData {
  id: string;
  bundleName: string;
  bundleTitle: string;
  description: string;
  discount: string;
  products?: string[];
}

export interface BundleUpdateQuery {
  data: {
    metaobjectUpdate: {
      metaobject?: {
        id: string;
        fields: Array<{
          key: string;
          value: string;
        }>;
      };
      userErrors: [];
    };
  };
}

export async function editBundle(
  client: GraphqlClient,
  data: EditedBundleData
) {
  const fields: any[] = [
    {
      key: "bundle_name",
      value: data.bundleName,
    },
    {
      key: "bundle_title",
      value: data.bundleTitle,
    },
    {
      key: "description",
      value: data.description,
    },
    {
      key: "discount",
      value: data.discount,
    },
  ];

  // Add products field if provided
  if (data.products && data.products.length > 0) {
    fields.push({
      key: "products",
      value: JSON.stringify(data.products),
    });
  }

  const { body } = await client.query<BundleUpdateQuery>({
    data: {
      query: `mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
          metaobjectUpdate(id: $id, metaobject: $metaobject) {
            metaobject {
              id
              fields {
                key
                value
              }
            }
            userErrors {
              field
              message
              code
            }
          }
        }`,
      variables: {
        id: data.id,
        metaobject: {
          fields: fields,
        },
      },
    },
  });

  return body.data?.metaobjectUpdate.metaobject != null;
}

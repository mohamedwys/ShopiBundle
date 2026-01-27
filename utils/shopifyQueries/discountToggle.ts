import { GraphqlClient } from "@shopify/shopify-api";

/**
 * Toggles an automatic discount by setting its end date.
 * To deactivate: sets endsAt to now
 * To activate: removes endsAt and sets startsAt to now
 */
export async function discountToggle(
  client: GraphqlClient,
  id: string,
  isActive: boolean
) {
  const now = new Date().toISOString();

  // If activating, remove end date and set start date to now
  // If deactivating, set end date to now (effectively disabling it)
  const discountInput = isActive
    ? {
        startsAt: now,
        endsAt: null,
      }
    : {
        endsAt: now,
      };

  const { body } = await client.query<{
    data: {
      discountAutomaticBasicUpdate: {
        automaticDiscountNode: { id: string } | null;
        userErrors: Array<{ field: string; code: string; message: string }>;
      };
    };
  }>({
    data: {
      query: `mutation discountAutomaticBasicUpdate($id: ID!, $automaticBasicDiscount: DiscountAutomaticBasicInput!) {
        discountAutomaticBasicUpdate(id: $id, automaticBasicDiscount: $automaticBasicDiscount) {
          automaticDiscountNode {
            id
          }
          userErrors {
            field
            code
            message
          }
        }
      }`,
      variables: {
        id: id,
        automaticBasicDiscount: discountInput,
      },
    },
  });

  if (body.data?.discountAutomaticBasicUpdate.userErrors.length > 0) {
    console.error(
      "Error toggling discount:",
      body.data.discountAutomaticBasicUpdate.userErrors
    );
    return false;
  }

  return body.data?.discountAutomaticBasicUpdate.automaticDiscountNode !== null;
}

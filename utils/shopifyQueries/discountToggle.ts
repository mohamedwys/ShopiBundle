import { GraphqlClient } from "@shopify/shopify-api";

/**
 * Toggles a Function-based automatic discount by setting its end date.
 * To deactivate: sets endsAt to now
 * To activate: removes endsAt and sets startsAt to now
 */
export async function discountToggle(
  client: GraphqlClient,
  id: string,
  isActive: boolean
) {
  const now = new Date().toISOString();

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
      discountAutomaticAppUpdate: {
        automaticAppDiscount: { discountId: string } | null;
        userErrors: Array<{ field: string; code: string; message: string }>;
      };
    };
  }>({
    data: {
      query: `mutation discountAutomaticAppUpdate($id: ID!, $automaticAppDiscount: DiscountAutomaticAppInput!) {
        discountAutomaticAppUpdate(id: $id, automaticAppDiscount: $automaticAppDiscount) {
          automaticAppDiscount {
            discountId
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
        automaticAppDiscount: discountInput,
      },
    },
  });

  if (body.data?.discountAutomaticAppUpdate.userErrors.length > 0) {
    console.error(
      "Error toggling discount:",
      body.data.discountAutomaticAppUpdate.userErrors
    );
    return false;
  }

  return body.data?.discountAutomaticAppUpdate.automaticAppDiscount !== null;
}

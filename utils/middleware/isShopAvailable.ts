import prisma from "../prisma";

const isShopAvailable = async (context) => {
  const shop = context.query.shop;

  if (shop) {
    try {
      const isShopAvailable = await prisma.active_stores.findUnique({
        where: { shop: shop },
      });

      if (!isShopAvailable || !isShopAvailable?.isActive) {
        console.log(`Shop ${shop} not found or not active, redirecting to auth`);
        // Use relative URL instead of full URL to avoid issues with env var
        return {
          redirect: {
            destination: `/api?shop=${shop}`,  // Fixed: /api not /api/auth
            permanent: false,
          },
        };
      }

      console.log(`Shop ${shop} is active, allowing access`);
      return {
        props: {
          user_shop: context.query.shop,
        },
      };
    } catch (error) {
      console.error('Error checking shop availability:', error);
      // If database check fails, redirect to auth
      return {
        redirect: {
          destination: `/api?shop=${shop}`,  // Fixed: /api not /api/auth
          permanent: false,
        },
      };
    }
  }

  // No shop parameter - this is normal during initial page load with App Bridge
  // Return props to allow the page to render
  return { props: { data: "ok" } };
};

export default isShopAvailable;

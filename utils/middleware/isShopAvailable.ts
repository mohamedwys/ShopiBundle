import prisma from "../prisma";

const isShopAvailable = async (context) => {
  // For embedded apps, shop might come from host parameter, not query
  let shop = context.query.shop;

  // If no shop in query, try to extract from host parameter (embedded apps)
  if (!shop && context.query.host) {
    try {
      // Host parameter is base64 encoded and contains shop info
      const decodedHost = Buffer.from(context.query.host as string, 'base64').toString('utf-8');
      // Format: admin.shopify.com/store/{shop-name}
      const match = decodedHost.match(/\/store\/([^\/]+)/);
      if (match) {
        shop = `${match[1]}.myshopify.com`;
      }
    } catch (error) {
      console.error('Error decoding host parameter:', error);
    }
  }

  // If we have a shop parameter, validate it
  if (shop) {
    try {
      const isShopAvailable = await prisma.active_stores.findUnique({
        where: { shop: shop },
      });

      if (!isShopAvailable || !isShopAvailable?.isActive) {
        console.log(`Shop ${shop} not found or not active, redirecting to auth`);
        return {
          redirect: {
            destination: `/api?shop=${shop}`,
            permanent: false,
          },
        };
      }

      console.log(`Shop ${shop} is active, allowing access`);
      return {
        props: {
          user_shop: shop,
        },
      };
    } catch (error) {
      console.error('Error checking shop availability:', error);
      // If database check fails, allow the page to load
      // The client-side auth will handle it
      return {
        props: {
          user_shop: shop,
          dbError: true,
        },
      };
    }
  }

  // No shop parameter - this is normal during initial page load with App Bridge
  // Allow the page to render, client-side will handle auth
  console.log('No shop parameter found, allowing page to load (client-side auth)');
  return { props: { data: "ok" } };
};

export default isShopAvailable;

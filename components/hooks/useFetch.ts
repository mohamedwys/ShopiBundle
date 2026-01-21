import { useAppBridge } from "@/components/providers/AppBridgeProvider";
import { getSessionToken } from "@shopify/app-bridge/utilities";

function useFetch() {
  const { app, isReady } = useAppBridge();

  return async (uri: RequestInfo, options?: RequestInit) => {
    // Wait for App Bridge to be ready
    if (!isReady) {
      console.warn('⚠️ App Bridge not ready yet - waiting...');
      // Return null instead of throwing - let component handle it
      return null;
    }

    if (!app) {
      console.error('❌ App Bridge not initialized - cannot get session token');
      // Return null instead of throwing - let component handle it
      return null;
    }

    // Get session token from App Bridge 3.x
    let token = "";
    try {
      token = await getSessionToken(app);
      console.log('✓ Session token obtained from App Bridge');
    } catch (error) {
      console.error("❌ Error getting session token:", error);
      // Return null instead of throwing - let component handle it
      return null;
    }

    if (!token) {
      console.error('❌ Session token is empty');
      // Return null instead of throwing - let component handle it
      return null;
    }

    const headers = {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(uri, {
        ...options,
        headers,
      });

      if (
        response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
      ) {
        const authUrlHeader = response.headers.get(
          "X-Shopify-API-Request-Failure-Reauthorize-Url"
        );

        console.log('Reauthorization required - redirecting...');

        // Use window.location for reauthorization redirect
        const redirectUrl = authUrlHeader || `/exitframe`;

        // For embedded apps, use top-level redirect
        if (window.top) {
          window.top.location.href = redirectUrl;
        } else {
          window.location.href = redirectUrl;
        }

        return null;
      }

      return response;
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }
  };
}

export default useFetch;
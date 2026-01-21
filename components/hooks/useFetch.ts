function useFetch() {
  return async (uri: RequestInfo, options?: RequestInit) => {
    // Get session token from the shopify app bridge
    let token = "";

    // Try to get token from window.shopify (App Bridge injected by Shopify)
    if (window?.shopify?.idToken) {
      try {
        // In App Bridge 4.x, the token is available directly
        token = await window.shopify.idToken();
        console.log('✓ Session token obtained from window.shopify');
      } catch (error) {
        console.error("Error getting session token from window.shopify:", error);
      }
    } else {
      console.warn('window.shopify.idToken not available - App Bridge may not be loaded');
      console.warn('This may cause authentication issues. Check console for errors.');
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
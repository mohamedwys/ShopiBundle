function useFetch() {
  return async (uri: RequestInfo, options?: RequestInit) => {
    // Get session token from the shopify app bridge
    let token = "";
    
    if (window?.shopify?.idToken) {
      try {
        // In App Bridge 4.x, the token is available directly
        token = await window.shopify.idToken();
      } catch (error) {
        console.error("Error getting session token:", error);
      }
    }

    const headers = {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

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
  };
}

export default useFetch;
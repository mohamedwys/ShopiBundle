import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";

const TEST_QUERY = `
{
  shop {
    name
  }
}`;

const verifyRequest = async (req, res, next) => {
  try {
    // Step 1: Check for Bearer token in Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('✗ No Bearer token found in Authorization header');
      return res.status(401).json({
        error: "Unauthorized",
        message: "Missing Bearer token in Authorization header"
      });
    }

    // Step 2: Extract the token
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      console.error('✗ Bearer token is empty');
      return res.status(401).json({
        error: "Unauthorized",
        message: "Bearer token is empty"
      });
    }

    // Step 3: Decode the session token to get shop info
    let payload;
    try {
      payload = await shopify.session.decodeSessionToken(token);
    } catch (decodeError) {
      console.error('✗ Failed to decode session token:', decodeError.message);
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid session token"
      });
    }

    const shop = payload.dest.replace('https://', '');

    console.log(`✓ JWT token decoded successfully for shop: ${shop}`);

    // Step 4: Get the OFFLINE session for this shop
    // Offline sessions are persistent and used for API operations
    const offlineSessionId = shopify.session.getOfflineId(shop);
    console.log(`Looking up offline session: ${offlineSessionId}`);

    const session = await sessionHandler.loadSession(offlineSessionId);

    if (!session) {
      console.error(`✗ No offline session found for shop: ${shop}`);

      // Return 403 with reauthorization headers
      res.status(403);
      res.setHeader("X-Shopify-API-Request-Failure-Reauthorize", "1");
      res.setHeader(
        "X-Shopify-API-Request-Failure-Reauthorize-Url",
        `/exitframe/${shop}`
      );
      return res.end();
    }

    if (!session.accessToken) {
      console.error(`✗ Offline session exists but has no access token for shop: ${shop}`);

      // Return 403 with reauthorization headers
      res.status(403);
      res.setHeader("X-Shopify-API-Request-Failure-Reauthorize", "1");
      res.setHeader(
        "X-Shopify-API-Request-Failure-Reauthorize-Url",
        `/exitframe/${shop}`
      );
      return res.end();
    }

    console.log(`✓ Offline session found for shop: ${shop}`);

    // Step 5: Validate session with a test query
    try {
      const client = new shopify.clients.Graphql({ session });
      await client.query({ data: TEST_QUERY });
      console.log(`✓ Session validation successful (test query passed)`);
    } catch (testError) {
      console.error('✗ Session validation failed (test query):', testError.message);
      console.error('This usually means the access token is invalid or expired.');

      // If the token is invalid (401 from Shopify), delete the session to force reinstall
      if (testError.message && testError.message.includes('401')) {
        console.log(`🗑️  Deleting invalid session for shop: ${shop}`);
        try {
          await sessionHandler.deleteSession(offlineSessionId);
          console.log(`✓ Invalid session deleted - user will need to reinstall`);
        } catch (deleteError) {
          console.error('Error deleting session:', deleteError);
        }
      }

      // Return 403 with reauthorization headers
      res.status(403);
      res.setHeader("X-Shopify-API-Request-Failure-Reauthorize", "1");
      res.setHeader(
        "X-Shopify-API-Request-Failure-Reauthorize-Url",
        `/exitframe/${shop}`
      );
      return res.end();
    }

    // Step 6: Session is valid - set up request context
    req.user_session = session;
    req.shop = shop;

    // Set CSP header
    res.setHeader(
      "Content-Security-Policy",
      `frame-ancestors https://${session.shop} https://admin.shopify.com;`
    );

    // Proceed to the actual handler
    await next();

  } catch (error) {
    console.error('✗ Unexpected error in verifyRequest middleware:', error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred during authentication"
    });
  }
};

export default verifyRequest;

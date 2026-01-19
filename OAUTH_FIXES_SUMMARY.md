# Shopify OAuth and Session Management Fixes

## Problems Identified

1. **Configuration Mismatch**: `useOnlineTokens: true` in shopify.ts conflicted with offline OAuth flow
2. **Session Storage Issues**: Sessions were being created but not properly validated
3. **Session Retrieval Issues**: Poor error handling made debugging difficult
4. **Cookie Handling**: Embedded apps tried to use cookies instead of session tokens
5. **401 Unauthorized Errors**: GraphQL client couldn't authenticate due to missing/invalid sessions

## Fixes Applied

### 1. Fixed Shopify API Configuration (utils/shopify.ts:20)
**Before:**
```javascript
useOnlineTokens: true,
```

**After:**
```javascript
useOnlineTokens: false,
```

**Impact:**
- Enables proper offline token handling for persistent API access
- Fixes cookie issues in embedded apps
- Aligns configuration with OAuth flow that requests offline sessions

### 2. Enhanced OAuth Callback (pages/api/auth/callback.ts:24-60)
**Added:**
- Validation that session has accessToken before storing
- Validation that session has shop domain
- Warning if online session received instead of offline
- Verification that stored session can be retrieved with accessToken
- Better logging with session details (truncated accessToken for security)

**Impact:**
- Catches OAuth failures early before they cause downstream issues
- Ensures only valid sessions with accessTokens are stored
- Makes debugging OAuth issues much easier

### 3. Enhanced Session Handler (utils/sessionHandler.ts:5-97)
**Added:**
- Pre-storage validation (session.id, session.shop, session.accessToken)
- Comprehensive logging for store and load operations
- Warning when session missing accessToken
- Better error messages with context

**Impact:**
- Prevents invalid sessions from being stored
- Makes session issues visible in logs immediately
- Helps diagnose session format problems

### 4. Enhanced Client Provider (utils/clientProvider.ts:12-55)
**Added:**
- Detailed logging of session lookup process
- Validation that loaded session has accessToken
- Better error messages explaining what went wrong
- Guidance to reinstall app when session invalid

**Impact:**
- Makes it clear when and why session lookup fails
- Helps identify session ID format issues
- Provides actionable error messages for users

### 5. Enhanced Test Endpoint (pages/api/test-bundles.ts)
**Added:**
- Session validation before attempting GraphQL call
- Check for expected session ID format
- Early return with detailed error if session missing or invalid
- Comprehensive logging of the test process

**Impact:**
- Can diagnose session issues without triggering GraphQL 401 errors
- Shows exactly what session ID is expected vs what exists
- Provides clear feedback on session status

### 6. Created Debug Endpoint (pages/api/debug-session.ts)
**New file** that provides:
- Expected offline session ID for a shop
- All sessions stored for a shop
- Session details (isOnline, hasAccessToken, scope, expires)
- Recommendations on what to do next
- Safe display of accessToken (first 10 chars only)

**Impact:**
- Single endpoint to diagnose all session issues
- Can compare expected vs actual session IDs
- Shows if wrong session type (online vs offline) was stored
- Helps identify if reinstall is needed

## Session ID Format

Offline sessions use the format: `offline_{shop}`

For example:
- Shop: `galactiva.myshopify.com`
- Session ID: `offline_galactiva.myshopify.com`

The previous error message mentioned `galactiva.myshopify.com_122010698009`, which suggests an online session ID format (includes user ID). This was caused by the `useOnlineTokens: true` misconfiguration.

## Testing the Fixes

### 1. Test OAuth Flow
Visit: `https://shopi-bundle.vercel.app/api?shop=galactiva.myshopify.com`

Expected outcome:
- OAuth flow completes
- Offline session stored with format `offline_galactiva.myshopify.com`
- Session has valid accessToken
- Console logs show "✓ Session stored successfully" and "✓ Session verified in database with accessToken"

### 2. Test Session Status
Visit: `https://shopi-bundle.vercel.app/api/debug-session?shop=galactiva.myshopify.com`

Expected outcome:
```json
{
  "success": true,
  "offlineSessionFound": true,
  "offlineSessionDetails": {
    "hasAccessToken": true,
    "isOnline": false
  },
  "recommendation": "Offline session found with valid accessToken. Everything looks good!"
}
```

### 3. Test Bundle Fetching
Visit: `https://shopi-bundle.vercel.app/api/test-bundles`

Expected outcome:
```json
{
  "success": true,
  "shop": "galactiva.myshopify.com",
  "sessionId": "offline_galactiva.myshopify.com",
  "bundles": { ... }
}
```

### 4. Test getBundles API
POST to: `https://shopi-bundle.vercel.app/api/getBundles`
With headers:
```
Authorization: Bearer {session_token_from_app_bridge}
```

Expected outcome:
- Status 200
- Returns bundle data
- No 401 Unauthorized errors

## Files Modified

1. `utils/shopify.ts` - Fixed useOnlineTokens configuration
2. `pages/api/auth/callback.ts` - Added session validation
3. `utils/sessionHandler.ts` - Enhanced logging and validation
4. `utils/clientProvider.ts` - Better error handling and logging
5. `pages/api/test-bundles.ts` - Enhanced diagnostics
6. `pages/api/debug-session.ts` - New diagnostic endpoint

## Next Steps

1. **Reinstall the app** on galactiva.myshopify.com to create a fresh offline session with the new configuration
2. **Test the OAuth flow** to ensure offline session is created properly
3. **Test API endpoints** to ensure they can access bundles without 401 errors
4. **Monitor logs** for any remaining session issues

## Prevention

To prevent similar issues in the future:

1. Always use `useOnlineTokens: false` for apps that need persistent API access
2. Always validate sessions have accessToken before using them
3. Use comprehensive logging to make issues visible immediately
4. Use the debug endpoints to diagnose session issues quickly
5. Ensure OAuth flow configuration matches app requirements (online vs offline tokens)

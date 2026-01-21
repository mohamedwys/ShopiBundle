# Troubleshooting 401 Unauthorized Errors

## Problem Description

You're seeing this error in the logs:

```
[error] Error in getBundles API: Received an error response (401 Unauthorized) from Shopify:
{
  "networkStatusCode": 401,
  "message": "GraphQL Client: Unauthorized",
  ...
}
```

This happens even though:
- ✓ Session exists in database
- ✓ Session has an access token
- ✓ Token has correct format (shpat_...)

## Root Cause

**The access token stored in the database is INVALID.**

This can happen due to:

1. **Token was revoked** - Shopify invalidated the token (e.g., app was uninstalled then reinstalled)
2. **API version mismatch** - Token was created with a different API version than currently configured
3. **Scope mismatch** - Token was created with different scopes than currently configured
4. **Corrupted token** - Token was corrupted during storage or retrieval
5. **Token expiration** - Though offline tokens shouldn't expire, something went wrong

## Quick Fix (Recommended)

### Step 1: Validate the Token

Visit this URL to check if your token is valid:
```
https://shopi-bundle.vercel.app/api/debug/validate-token?shop=galactiva.myshopify.com
```

This will:
- Test the token against Shopify's API
- Show if it's working or invalid
- Provide specific recommendations

### Step 2: Delete Invalid Session

If the token is invalid, delete the session:
```
https://shopi-bundle.vercel.app/api/debug/force-delete-session?shop=galactiva.myshopify.com&confirm=yes
```

### Step 3: Uninstall App

1. Go to your Shopify admin
2. Navigate to: Apps → Installed Apps
3. Find "ShopiBundle"
4. Click the "..." menu → Uninstall
5. Confirm uninstallation

### Step 4: Wait 30 Seconds

Shopify needs time to fully process the uninstallation.

### Step 5: Reinstall App

Visit this URL to start fresh installation:
```
https://shopi-bundle.vercel.app/api?shop=galactiva.myshopify.com
```

This will:
- Start the OAuth flow
- Generate a NEW valid access token
- Store it in the database
- Create fresh session with correct API version and scopes

---

## Detailed Diagnostics

### Check 1: Session Status

```bash
curl "https://shopi-bundle.vercel.app/api/debug/check-session?shop=galactiva.myshopify.com"
```

Look for:
- `hasAccessToken: true`
- `tokenLength: 38` or `100+`
- `tokenPrefix: "shpat_..."` or `"shpca_..."`
- `tokenLooksValid: true`

### Check 2: Token Validation

```bash
curl "https://shopi-bundle.vercel.app/api/debug/validate-token?shop=galactiva.myshopify.com"
```

This actually tests the token with Shopify. Look for:
- `tokenValidation.valid: true` ✅ (Token works!)
- `tokenValidation.valid: false` ❌ (Token is invalid - needs reinstall)

### Check 3: Environment Configuration

```bash
curl "https://shopi-bundle.vercel.app/api/diagnostic?shop=galactiva.myshopify.com"
```

Verify:
- `apiVersion: "2025-10"`
- `apiKeyMatch: true`
- All environment variables are set correctly

---

## Understanding the Error

### What's Happening?

1. **Frontend** (pages/index.tsx):
   - Gets session token from App Bridge ✅
   - Calls `/api/getBundles` with Bearer token ✅

2. **Backend** (pages/api/getBundles.ts):
   - Decodes session token to get shop domain ✅
   - Loads offline session from database ✅
   - Gets access token from session ✅
   - Creates GraphQL client with access token ✅
   - Makes request to Shopify GraphQL API ❌ **401 Unauthorized**

3. **Shopify API**:
   - Receives request with access token
   - Validates token → **INVALID**
   - Returns 401 Unauthorized

### Why Is Token Invalid?

The most common reason is **API version mismatch**:

- **Old scenario**:
  - App was installed with API version `2026-04` (invalid version)
  - Token was generated for `2026-04`

- **Current scenario**:
  - Environment now uses `2025-10` (correct version)
  - Code tries to use token with `2025-10`
  - Shopify sees version mismatch → **REJECTS TOKEN**

### Why Can't We Just Update the Token?

Access tokens are **immutable and bound to their creation context**:
- You cannot change the API version of an existing token
- You cannot upgrade scopes on an existing token
- The only solution is to **generate a new token** via OAuth

---

## Prevention

To prevent this issue in the future:

### 1. Verify Environment Variables Before Deployment

Always check these are correct in Vercel:

```bash
SHOPIFY_API_VERSION=2025-10         # ← Must be valid Shopify API version
SHOPIFY_API_SCOPES=write_metaobjects,read_metaobjects,write_metaobject_definitions,read_products,write_discounts,read_orders
SHOPIFY_API_KEY=15673a82b49113d07a0f066fd048267e
NEXT_PUBLIC_SHOPIFY_API_KEY=15673a82b49113d07a0f066fd048267e
SHOPIFY_API_SECRET=<your-secret>
```

### 2. Match API Version in All Places

Ensure consistency:
- `shopify.app.toml` → `api_version = "2025-10"`
- Vercel env var → `SHOPIFY_API_VERSION=2025-10`
- Both must match!

### 3. After Changing Configuration

If you ever change:
- API version
- Scopes
- API key

**You MUST reinstall the app** to regenerate tokens with new settings.

### 4. Use Diagnostic Endpoints

Before deploying changes, test with:
- `/api/diagnostic`
- `/api/debug/check-session`
- `/api/debug/validate-token`

---

## Common Questions

### Q: Why does the session exist but token is invalid?

**A:** The session and token are separate things:
- **Session** = Database record containing token + metadata
- **Token** = Secret key that Shopify validates

The session can exist in your database with a token, but that token might be invalid in Shopify's system.

### Q: Can I just update the token in the database?

**A:** No! Access tokens can only be generated through Shopify's OAuth flow. You cannot create or modify them manually.

### Q: Will reinstalling delete my bundles?

**A:** It depends on how bundles are stored:
- If stored as **metaobjects** in Shopify → Safe, won't be deleted
- If stored in **app database** → Should be safe, but test first
- Always backup important data before reinstalling

### Q: How often should I regenerate tokens?

**A:** Offline tokens should never expire, but you need to regenerate if:
- You change API version
- You change scopes
- You change API key
- Token becomes corrupted
- 401 errors occur

### Q: Can I test token validation without reinstalling?

**A:** Yes! Use the validation endpoint:
```
/api/debug/validate-token?shop=YOUR_SHOP.myshopify.com
```

This tests the token without modifying anything.

---

## Advanced: Manual Token Inspection

If you want to inspect the raw token in the database:

```sql
-- Connect to your PostgreSQL database
SELECT
  id,
  shop,
  LENGTH(content) as content_length,
  substring(content, 1, 200) as content_preview
FROM session
WHERE shop = 'galactiva.myshopify.com';
```

Look for the `accessToken` field in the JSON content. Check:
- Length (should be 38+ characters)
- Prefix (should start with `shpat_` or `shpca_`)
- No corruption (no null bytes, control characters, etc.)

---

## Summary

**Current Issue**: 401 Unauthorized from Shopify API

**Root Cause**: Invalid access token in database

**Solution**: Delete session + Reinstall app

**Steps**:
1. `/api/debug/validate-token?shop=...` (confirm token is invalid)
2. `/api/debug/force-delete-session?shop=...&confirm=yes` (delete old token)
3. Uninstall app from Shopify admin
4. Wait 30 seconds
5. `/api?shop=...` (reinstall app)

**Time Required**: ~2 minutes

**Expected Result**: Fresh valid token, all API calls work

---

## Need More Help?

If issues persist after following these steps:

1. Run all diagnostic endpoints and save outputs:
   - `/api/diagnostic?shop=...`
   - `/api/debug/check-session?shop=...`
   - `/api/debug/validate-token?shop=...`

2. Check browser console for errors (F12 → Console)

3. Check Vercel function logs:
   - Vercel Dashboard → Your Project → Functions → Real-time Logs

4. Provide all above information for further debugging

---

## File Locations

If you need to modify code:

- **Session handling**: `utils/sessionHandler.ts`
- **GraphQL client**: `utils/clientProvider.ts`
- **Shopify config**: `utils/shopify.ts`
- **Bundle fetching**: `pages/api/getBundles.ts`
- **OAuth callback**: `pages/api/auth/callback.ts`
- **Diagnostics**: `pages/api/debug/*.ts`

---

## Related Issues

- If you see "No session found" → Session doesn't exist (install app)
- If you see "Token too short" → Corrupted token (delete + reinstall)
- If you see "Invalid token prefix" → Wrong token format (delete + reinstall)
- If you see "Scope mismatch" → Scopes changed (reinstall to update)

All lead to the same solution: **Reinstall the app** 🔄

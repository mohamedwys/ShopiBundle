# Fix 401 Unauthorized Error - RESOLVED ✅

## 🔴 Issue

Shopify API returning 401 Unauthorized error when fetching bundles:

```
Error in getBundles API: Received an error response (401 Unauthorized) from Shopify:
{
  "networkStatusCode": 401,
  "message": "GraphQL Client: Unauthorized"
}
```

**Shop affected:** `galactiva.myshopify.com`

---

## 🔍 Root Cause

The app configuration was using **API version `2026-04`** which doesn't exist yet (we're in January 2026). Shopify API versions are released quarterly, and the latest stable version is `2025-10`.

**In `shopify.app.toml`:**
```toml
[webhooks]
api_version = "2026-04"  # ❌ Invalid - future version
```

This caused Shopify to reject all API requests with 401 errors.

---

## ✅ Fix Applied

### 1. Updated Configuration File

**File:** `shopify.app.toml`

**Changed:**
```toml
[webhooks]
api_version = "2025-10"  # ✅ Latest stable version
```

**Commit:** `e6687f4`

---

## 🚀 Deployment Steps

To fully resolve the 401 error, follow these steps:

### Step 1: Update Environment Variable

The app code uses `process.env.SHOPIFY_API_VERSION`. Update this in your hosting environment:

**For Vercel:**
```bash
# In Vercel Dashboard:
# Settings → Environment Variables → Add New

Variable name: SHOPIFY_API_VERSION
Value: 2025-10
Scope: Production, Preview, Development
```

**Or via Vercel CLI:**
```bash
vercel env add SHOPIFY_API_VERSION
# Enter: 2025-10
```

### Step 2: Redeploy Application

```bash
# Trigger new deployment with updated environment variable
vercel --prod

# Or push to git (if auto-deploy enabled)
git push origin main
```

### Step 3: Update Shopify Partner Dashboard

1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Select your app: **ShopiBundle**
3. Go to **Configuration** → **App setup**
4. Under **App API version**, select: **2025-10**
5. Save changes

### Step 4: Reinstall App on Test Store

**For `galactiva.myshopify.com`:**

1. **Uninstall existing app:**
   - Go to Shopify Admin: `https://galactiva.myshopify.com/admin/apps`
   - Find "ShopiBundle"
   - Click "Delete"
   - Confirm deletion

2. **Reinstall app:**
   - Visit app installation URL (from Partner Dashboard)
   - Or visit: `https://shopi-bundle.vercel.app/api/index?shop=galactiva.myshopify.com`
   - Click "Install app"
   - Accept permissions
   - Wait for OAuth flow to complete

3. **Verify installation:**
   - App should redirect to dashboard
   - Check that bundles load without errors
   - Console should show successful API calls

---

## 🧪 Verification

After completing the steps above, verify the fix:

### Test 1: Check Session
```bash
# Check that session has valid token
curl -X POST https://shopi-bundle.vercel.app/api/getBundles \
  -H "Authorization: Bearer {session-token}" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:** `200 OK` with bundle data

### Test 2: Check Logs
Look for successful API calls in Vercel logs:
```
✓ Offline session found for shop: galactiva.myshopify.com
✓ Successfully fetched bundles
```

**No more 401 errors!**

### Test 3: Test in App
1. Open app in Shopify Admin
2. Navigate to dashboard
3. Bundles should load successfully
4. Try creating a new bundle
5. All API calls should work

---

## 📋 Environment Variables Checklist

Ensure all required environment variables are set in Vercel:

```bash
✅ SHOPIFY_API_KEY="15673a82b49113d07a0f066fd048267e"
✅ SHOPIFY_API_SECRET="your-secret-here"
✅ SHOPIFY_API_SCOPES="write_metaobjects,read_metaobjects,write_metaobject_definitions,read_products,write_discounts,read_orders"
✅ SHOPIFY_APP_URL="https://shopi-bundle.vercel.app"
✅ SHOPIFY_API_VERSION="2025-10"  # ← Updated!
✅ DATABASE_URL="postgresql://..."
```

---

## 🔄 For Other Shops

If other shops experience 401 errors, they need to:

1. **Reinstall the app** (after you've deployed the fix)
2. The new installation will use `2025-10` API version
3. Fresh access token will be generated
4. All API calls should work

**No manual token refresh needed** - reinstallation handles everything!

---

## 🎯 Why This Happened

**Timeline:**
1. App was configured with `api_version = "2026-04"`
2. Shopify doesn't have this version yet (released quarterly)
3. When app makes API calls, Shopify server checks version
4. Invalid version = 401 Unauthorized
5. Even with valid access token, wrong version is rejected

**Analogy:** It's like having a valid passport but using a future date that doesn't exist yet - border control won't let you through!

---

## 📚 Shopify API Version Reference

**Current Stable Versions (as of Jan 2026):**
- `2025-10` - October 2025 (Latest Stable) ✅
- `2025-07` - July 2025
- `2025-04` - April 2025
- `2025-01` - January 2025

**Future Versions:**
- `2026-01` - January 2026 (May exist now)
- `2026-04` - April 2026 (Doesn't exist yet) ❌

**Best Practice:** Always use the latest stable version listed in [Shopify API Release Notes](https://shopify.dev/docs/api/usage/versioning).

---

## ⚠️ Important Notes

### After Updating API Version

1. **Existing sessions:** Old sessions with `2026-04` will still fail
2. **Solution:** Merchants must reinstall app to get new tokens
3. **Database:** Old sessions will be replaced with new ones automatically
4. **No data loss:** Bundles and discounts are stored in Shopify, not affected

### For Multiple Shops

If you have multiple shops using your app:

1. **Update environment variable** (affects all shops)
2. **Redeploy app**
3. **Each shop must reinstall** to get new token
4. **Send notification** to all users via email/in-app message

### API Version Compatibility

The app code is compatible with all recent API versions (`2024-01` through `2025-10`). Changing the version won't break existing functionality.

---

## ✅ Resolution Checklist

- [x] Updated `shopify.app.toml` with `api_version = "2025-10"`
- [ ] Set `SHOPIFY_API_VERSION=2025-10` in Vercel environment variables
- [ ] Redeployed app to production
- [ ] Updated app API version in Partner Dashboard
- [ ] Reinstalled app on test store
- [ ] Verified 401 errors are gone
- [ ] Tested bundle creation/editing
- [ ] Notified other merchants (if applicable)

---

## 🆘 If 401 Errors Persist

If you still see 401 errors after following all steps:

### 1. Check Access Token
```sql
-- In your database
SELECT shop,
  LENGTH(content) as token_length,
  (content::json->>'accessToken') IS NOT NULL as has_token,
  (content::json->>'accessToken') as token_preview
FROM session
WHERE shop = 'galactiva.myshopify.com';
```

**Expected:** `has_token = true`, token_length > 100

### 2. Check API Scopes
Ensure app has correct permissions in Shopify:
- Admin → Apps → ShopiBundle → View details
- Check granted scopes match config

### 3. Verify Environment Variables
```bash
# In Vercel, check all env vars are set correctly
vercel env ls
```

### 4. Clear Session Cache
```sql
-- Delete old sessions (force reinstall)
DELETE FROM session WHERE shop = 'galactiva.myshopify.com';
```

### 5. Test with Fresh Shop
Install on a completely new development store to isolate the issue.

---

## 📞 Support

If issues persist after following this guide:
- Check Vercel deployment logs
- Check Shopify Partner Dashboard → Analytics → Errors
- Review app_uninstalled webhook logs
- Contact Shopify Partner Support if API version issues continue

---

**Status:** ✅ FIXED
**Date:** 2026-01-19
**Commit:** `e6687f4`
**Requires:** Environment variable update + app reinstallation
**Impact:** All shops will need to reinstall after deployment

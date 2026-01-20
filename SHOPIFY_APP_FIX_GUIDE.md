# 🚨 CRITICAL: Invalid Shopify Token Issue

## Problem Identified

Your app is receiving an **invalid 38-character token** with prefix `shpua_` from Shopify during OAuth.

```
Current Token: shpua_...fc29 (38 chars) ❌
Expected Token: shpat_... or shpca_... (100+ chars) ✅
```

This is **NOT a valid Shopify access token format**.

## Root Cause

The `shpua_` prefix indicates one of these issues:

1. **Wrong App Type**: Your Shopify Partners app may be configured as the wrong type
2. **Mismatched Credentials**: API Key/Secret in Vercel don't match the app in Partners Dashboard
3. **OAuth Configuration Error**: Redirect URLs or scopes misconfigured
4. **Legacy App**: App was created with old settings that need updating

## Diagnostic Steps

### Step 1: Verify Credentials Match

Visit: `https://shopi-bundle.vercel.app/api/debug/check-credentials`

This will show if your Vercel environment variables match your `shopify.app.toml`.

**Expected:**
```json
{
  "match": {
    "keysMatch": true
  }
}
```

If `keysMatch: false`, you need to update your Vercel environment variables.

### Step 2: Check Shopify Partners Dashboard

Go to: https://partners.shopify.com/organizations

1. Find your app: **ShopiBundle**
2. Check **App setup** → **Configuration**

Verify:
- ✅ **App URL**: `https://shopi-bundle.vercel.app`
- ✅ **Allowed redirection URL(s)**:
  - `https://shopi-bundle.vercel.app/api/auth/callback`
  - `https://shopi-bundle.vercel.app/api/auth/tokens` (if needed)
- ✅ **API version**: `2025-10`
- ✅ **Access scopes**: Match what's in your `shopify.app.toml`

### Step 3: Verify App Type

In Shopify Partners Dashboard:

**Check if app is:**
- ☑️ **Public app** (for App Store distribution)
- ☑️ **Custom app** (for specific stores)
- ⚠️ **Legacy/unlisted app** (might cause issues)

**If it's a custom app**, you may need to regenerate credentials or create a new public app.

## Solutions (Try in Order)

### Solution 1: Regenerate App Credentials

In Shopify Partners Dashboard:

1. Go to **App setup** → **App credentials**
2. Click **Rotate API secret key**
3. Copy the new **API secret key**
4. Update Vercel environment variable:
   - `SHOPIFY_API_SECRET` = new secret key
5. Redeploy and reinstall app

### Solution 2: Verify and Update Redirect URLs

In Shopify Partners Dashboard:

1. Go to **App setup** → **URLs**
2. Ensure **Allowed redirection URL(s)** includes:
   ```
   https://shopi-bundle.vercel.app/api/auth/callback
   ```
3. Remove any incorrect or unused URLs
4. Save changes
5. Reinstall app

### Solution 3: Create Fresh App in Partners Dashboard

If the above don't work, the app configuration may be corrupted:

1. Go to https://partners.shopify.com
2. Create **NEW app**
3. Choose **Public app** or **Custom app**
4. Configure:
   - **App URL**: `https://shopi-bundle.vercel.app`
   - **Redirect URL**: `https://shopi-bundle.vercel.app/api/auth/callback`
   - **API version**: `2025-10`
   - **Scopes**: `write_metaobjects,read_metaobjects,write_metaobject_definitions,read_products,write_discounts,read_orders`
5. Copy the **new API key** and **API secret**
6. Update Vercel environment variables:
   - `SHOPIFY_API_KEY` = new API key
   - `SHOPIFY_API_SECRET` = new API secret
7. Update `shopify.app.toml` → `client_id` = new API key
8. Redeploy and reinstall

### Solution 4: Use Shopify CLI to Reconfigure

If you have the Shopify CLI installed:

```bash
cd /home/user/ShopiBundle

# Login to partners account
shopify auth logout
shopify auth login

# Link to correct app
shopify app config link

# This will update shopify.app.toml with correct credentials

# Push configuration
shopify app deploy
```

## Verification

After trying any solution:

1. **Delete old session**:
   ```
   https://shopi-bundle.vercel.app/api/debug/force-delete-session?shop=galactiva.myshopify.com&confirm=yes
   ```

2. **Reinstall app** on test store

3. **Check token**:
   ```
   https://shopi-bundle.vercel.app/api/debug/check-session?shop=galactiva.myshopify.com
   ```

4. **Expected result**:
   ```json
   {
     "session": {
       "tokenLength": 100+,
       "tokenPrefix": "shpat_..." or "shpca_...",
       "tokenLooksValid": true
     }
   }
   ```

## Still Not Working?

If you still get `shpua_` prefix after trying all solutions, share:

1. Screenshot of Shopify Partners Dashboard → App setup → Configuration
2. Vercel environment variables (hide the actual secret values)
3. The output of: `/api/debug/check-credentials`

This will help identify if there's a deeper configuration issue.

---

## Technical Details

**Valid Shopify Token Formats:**
- `shpat_` - Admin API access token (standard for apps)
- `shpca_` - Custom app access token
- Length: 100-150+ characters
- Format: `shpat_[random_alphanumeric]`

**Invalid Format (Current):**
- `shpua_` - Unknown/invalid prefix
- Length: 38 characters
- This will ALWAYS result in 401 Unauthorized errors

The code changes already implemented will prevent this invalid token from causing silent failures. Once you get a valid token, all 401 errors will be resolved.

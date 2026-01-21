# CRITICAL: Custom App vs Public App Issue

## 🚨 Problem Identified

Your validation check revealed a **38-character API secret**, which is the **smoking gun** that proves your app is configured as a **CUSTOM APP** in Shopify Partners Dashboard.

```json
{
  "apiSecretLength": 38,
  "expectedLength": 32,
  "issue": "CUSTOM APP detected"
}
```

**This is why you're getting invalid `shpua_` tokens!**

---

## Understanding the Issue

### Custom Apps vs Public Apps

Shopify has two main types of apps with **completely different authentication mechanisms**:

#### 1. Custom Apps (Your Current Configuration ❌)
- **Purpose:** Internal use within a single store
- **Created:** Directly in the Shopify Admin of a specific store
- **API Credentials:** 38-character access token (starts with `shpua_`)
- **Authentication:** Direct access token (no OAuth flow)
- **OAuth:** NOT supported for custom apps
- **Use Case:** Backend scripts, internal tools, single-store automation
- **Cannot:** Be installed on multiple stores
- **Cannot:** Use OAuth flow with authorization screens

#### 2. Public Apps (What You Need ✅)
- **Purpose:** Multi-store distribution (App Store or private distribution)
- **Created:** In Shopify Partners Dashboard
- **API Credentials:** 32-character hex API key + 32-character hex secret
- **Authentication:** OAuth 2.0 flow
- **OAuth:** Fully supported (required)
- **Access Tokens:** 100+ character tokens starting with `shpat_` or `shpca_`
- **Use Case:** Embedded apps, App Store apps, multi-store SaaS
- **Can:** Be installed on unlimited stores
- **Can:** Use OAuth with authorization screens

---

## Why Your App is Failing

Your code is designed for a **Public App** (OAuth flow), but you're using credentials from a **Custom App**.

### The Authentication Mismatch

```
Your App Code:
├─ Implements OAuth flow
├─ Expects shpat_/shpca_ tokens (100+ chars)
├─ Uses embedded app features
└─ Designed for multi-store usage

Your Shopify Configuration:
├─ Custom App type
├─ Returns shpua_ tokens (38 chars)
├─ No OAuth support
└─ Single-store only
    ↓
  MISMATCH = 401 Errors
```

### Token Comparison

| Property | Custom App Token (❌ Current) | Public App Token (✅ Needed) |
|----------|------------------------------|----------------------------|
| **Prefix** | `shpua_` | `shpat_` or `shpca_` |
| **Length** | 38 characters | 100-150 characters |
| **Obtained via** | Store Admin settings | OAuth callback |
| **Valid for** | Single store forever | Shop-specific (offline) |
| **Works with OAuth** | ❌ No | ✅ Yes |
| **Works with embedded apps** | ❌ No | ✅ Yes |

---

## How This Happened

### Scenario 1: Created Custom App Instead of Public App
You (or someone) likely:
1. Went to a Shopify store's Admin → Settings → Apps and sales channels
2. Created a "Custom app" for that store
3. Copied the credentials from there
4. Used those credentials in your public OAuth app code

### Scenario 2: Credentials from Wrong Source
The app might have been created correctly as a Public App, but:
1. Someone accidentally copied credentials from a Custom App
2. Or copied an access token instead of API credentials

---

## The Solution: Create a Public App

**You CANNOT convert a Custom App to a Public App.** You must create a new one.

### Step 1: Go to Shopify Partners Dashboard

1. Visit: https://partners.shopify.com
2. Log in with your partner account
3. Navigate to: **Apps** section

**IMPORTANT:** You need a Shopify Partners account (free). If you don't have one, create it at https://partners.shopify.com/signup

### Step 2: Create New Public App

1. Click **"Create app"**
2. Select **"Create app manually"**
3. **App name:** `ShopiBundle` (or any name)
4. Choose **"Public app"** type ⚠️ THIS IS CRITICAL

**DO NOT** select:
- ❌ Custom app
- ❌ Sales channel
- ❌ Any other type

### Step 3: Configure App Settings

After creating, go to **Configuration** tab:

#### App URL
```
https://shopi-bundle.vercel.app
```
**(No trailing slash!)**

#### Allowed redirection URL(s)
```
https://shopi-bundle.vercel.app/api/auth/callback
```
**(Only this URL, no others!)**

#### App capabilities
- ✅ **Embedded app** (enable this)

#### API scopes
Select these scopes:
- ✅ `write_metaobjects`
- ✅ `read_metaobjects`
- ✅ `write_metaobject_definitions`
- ✅ `read_products`
- ✅ `write_discounts`
- ✅ `read_orders`

#### API version
```
2025-10
```
(or latest stable version)

### Step 4: Get Your New Credentials

1. Go to **"App credentials"** (or "Overview") tab
2. You'll see:
   - **API key** (Client ID) - Should be **32 hexadecimal characters**
   - **API secret key** - Should be **32 hexadecimal characters**

**Verify the length!**
```bash
# API Key should be 32 chars like:
15673a82b49113d07a0f066fd048267e

# API Secret should be 32 chars like:
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# NOT 38 chars like:
shpua_01234567890123456789012345678901
```

### Step 5: Update Your Environment Variables

In Vercel (or wherever you deploy):

1. Go to your project settings
2. Update environment variables:

```bash
SHOPIFY_API_KEY=<your-new-32-char-api-key>
SHOPIFY_API_SECRET=<your-new-32-char-api-secret>
SHOPIFY_APP_URL=https://shopi-bundle.vercel.app
SHOPIFY_API_VERSION=2025-10
SHOPIFY_API_SCOPES=write_metaobjects,read_metaobjects,write_metaobject_definitions,read_products,write_discounts,read_orders
```

**Also update `shopify.app.toml`:**
```toml
client_id = "<your-new-32-char-api-key>"
```

### Step 6: Redeploy

```bash
# Commit changes
git add shopify.app.toml
git commit -m "Update to Public App credentials"
git push

# Redeploy on Vercel (or your platform)
```

### Step 7: Clean Up Old Sessions

Delete any existing sessions from the old custom app:

```bash
curl "https://shopi-bundle.vercel.app/api/debug/force-delete-session?shop=yourstore.myshopify.com&confirm=yes"
```

### Step 8: Verify Configuration

```bash
curl https://shopi-bundle.vercel.app/api/debug/validate-config
```

**Expected result:**
```json
{
  "status": "OK",
  "configuration": {
    "apiSecretLength": 32,  // ✅ Should be 32 now!
    "callbackUrl": "https://shopi-bundle.vercel.app/api/auth/callback"
  }
}
```

### Step 9: Reinstall App

1. Visit: `https://shopi-bundle.vercel.app/api?shop=yourstore.myshopify.com`
2. Complete OAuth authorization
3. App should now receive valid `shpat_` tokens!

### Step 10: Verify Token

```bash
curl "https://shopi-bundle.vercel.app/api/debug/check-session?shop=yourstore.myshopify.com"
```

**Expected result:**
```json
{
  "session": {
    "tokenLength": 108,  // ✅ 100+ characters
    "tokenPrefix": "shpat_",  // ✅ Correct prefix
    "tokenLooksValid": true  // ✅ Valid!
  }
}
```

---

## Why This Matters

### What Doesn't Work with Custom Apps
- ❌ OAuth authorization flow
- ❌ Multi-store installation
- ❌ Embedded app features
- ❌ App Store distribution
- ❌ Session token authentication
- ❌ Modern app bridge features

### What Works with Public Apps
- ✅ OAuth authorization flow
- ✅ Multi-store installation
- ✅ Embedded app features
- ✅ App Store distribution (if approved)
- ✅ Session token authentication
- ✅ Full Shopify App Bridge support
- ✅ Webhooks
- ✅ Billing API

---

## Common Questions

### Q: Can I just rotate the credentials on my Custom App?
**A:** No. The app type determines the authentication mechanism. Custom Apps will always return 38-char `shpua_` tokens. You must create a Public App.

### Q: Can I convert my Custom App to a Public App?
**A:** No. Shopify doesn't allow app type conversion. You must create a new app.

### Q: Will I lose my data?
**A:** No. Your database and code remain unchanged. You're only changing which Shopify app configuration the code connects to.

### Q: Do I need to change my code?
**A:** No! Your code is already correct for a Public App. You just need to use Public App credentials.

### Q: What if I need the old Custom App?
**A:** You can keep both. Custom Apps are store-specific and won't interfere with your new Public App.

### Q: Can I use Custom App for development and Public App for production?
**A:** No. The authentication mechanisms are incompatible. Use a Public App for both, and install it on a development store for testing.

---

## Quick Reference

### Custom App (❌ What You Have)
```
Created in:  Store Admin → Settings → Apps and sales channels
Token:       shpua_01234567890123456789012345678901 (38 chars)
API Secret:  38 characters
OAuth:       Not supported
```

### Public App (✅ What You Need)
```
Created in:  Partners Dashboard → Apps → Create app
Token:       shpat_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6... (100+ chars)
API Key:     32 hex characters
API Secret:  32 hex characters
OAuth:       Fully supported
```

---

## Validation Commands

After creating your Public App:

```bash
# 1. Validate configuration
curl https://shopi-bundle.vercel.app/api/debug/validate-config

# 2. Check OAuth readiness
curl "https://shopi-bundle.vercel.app/api/debug/oauth-readiness?shop=yourstore.myshopify.com"

# 3. Should return: "status": "OK" and "apiSecretLength": 32
```

---

## Next Steps

1. ✅ Create Public App in Partners Dashboard (see Step 2 above)
2. ✅ Get new 32-character credentials
3. ✅ Update environment variables
4. ✅ Update shopify.app.toml
5. ✅ Redeploy application
6. ✅ Delete old sessions
7. ✅ Reinstall app and verify tokens

Your code is already fixed and ready. You just need the correct app configuration in Shopify Partners Dashboard!

---

## Support Resources

- **Shopify Partners:** https://partners.shopify.com
- **Create Partner Account:** https://partners.shopify.com/signup
- **App Type Documentation:** https://shopify.dev/docs/apps/build/authentication-authorization
- **OAuth Documentation:** https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant

---

## Summary

**The Problem:** Your app uses Custom App credentials (38-char secret, `shpua_` tokens)

**The Solution:** Create a Public App in Partners Dashboard (32-char secret, `shpat_` tokens)

**The Result:** Valid OAuth tokens and working API calls! ✅

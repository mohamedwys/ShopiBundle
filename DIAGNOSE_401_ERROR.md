# Diagnose & Fix 401 Unauthorized Error - Complete Guide

## 🔍 Step 1: Diagnose the Issue

I've created debug endpoints to identify the exact problem. Run these checks:

### Check 1: Environment Configuration

Visit this URL in your browser:
```
https://shopi-bundle.vercel.app/api/debug/config
```

**Look for:**
```json
{
  "config": {
    "SHOPIFY_API_VERSION": "2026-04"  // ❌ If this is 2026-04, that's the problem!
  },
  "warning": "⚠️ API version 2026-04 is invalid! Change to 2025-10"
}
```

### Check 2: Session Details

Visit this URL:
```
https://shopi-bundle.vercel.app/api/debug/check-session?shop=galactiva.myshopify.com
```

**Expected output:**
```json
{
  "environment": {
    "apiVersion": "2026-04",  // ❌ Problem here
    "isCorrect": false,
    "warning": "⚠️ Environment variable SHOPIFY_API_VERSION is still 2026-04!"
  },
  "diagnosis": [
    "❌ API version in environment is 2026-04 (invalid)"
  ],
  "solution": [
    "1. Update Vercel env var SHOPIFY_API_VERSION to 2025-10",
    "2. Redeploy application",
    "3. Reinstall app on shop"
  ]
}
```

---

## ✅ Step 2: Fix the Issue

### Problem Identified

The **runtime environment variable** `SHOPIFY_API_VERSION` is still set to `2026-04`, even though we updated `shopify.app.toml`.

**Why this happens:**
- `shopify.app.toml` is only for Shopify CLI configuration
- The actual app code uses `process.env.SHOPIFY_API_VERSION` (see `utils/shopify.ts:53`)
- This environment variable is set in Vercel, not in the codebase

---

## 🛠️ Fix: 3 Required Steps

### Step 1: Update Vercel Environment Variable

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/your-username/shopi-bundle
2. Click **Settings** → **Environment Variables**
3. Find `SHOPIFY_API_VERSION`
4. Click **Edit** (or Add if it doesn't exist)
5. Change value from `2026-04` to `2025-10`
6. Select all environments: **Production**, **Preview**, **Development**
7. Click **Save**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Update environment variable
vercel env rm SHOPIFY_API_VERSION production
vercel env add SHOPIFY_API_VERSION production
# When prompted, enter: 2025-10

# Repeat for preview and development
vercel env add SHOPIFY_API_VERSION preview
# Enter: 2025-10

vercel env add SHOPIFY_API_VERSION development
# Enter: 2025-10
```

#### Option C: Via Environment Variable UI

If you're using a different host (not Vercel), set:
```
SHOPIFY_API_VERSION=2025-10
```

---

### Step 2: Redeploy Application

After updating the environment variable, trigger a new deployment:

```bash
# Option A: Trigger redeploy via Vercel dashboard
# Go to Deployments → Click "..." → Redeploy

# Option B: Via CLI
vercel --prod

# Option C: Push a commit to trigger auto-deploy
git commit --allow-empty -m "Trigger redeploy with updated API version"
git push origin main
```

**Wait for deployment to complete!** Check the Vercel logs to confirm:
```
✓ Building...
✓ Deploying...
✓ Ready! https://shopi-bundle.vercel.app
```

---

### Step 3: Verify Environment Variable

After redeployment, verify the fix worked:

Visit: `https://shopi-bundle.vercel.app/api/debug/config`

**Expected result:**
```json
{
  "config": {
    "SHOPIFY_API_VERSION": "2025-10"  // ✓ Should be 2025-10 now!
  },
  "warning": "✓ API version is correct"
}
```

---

### Step 4: Reinstall App on Shop

**CRITICAL:** Even after fixing the environment variable, the existing session token in the database was created with the old API version. You MUST reinstall the app to generate a new token.

#### For galactiva.myshopify.com:

1. **Uninstall the app:**
   ```
   Visit: https://galactiva.myshopify.com/admin/settings/apps
   Find: ShopiBundle
   Click: "Uninstall"
   Confirm: Yes, uninstall
   ```

2. **Clear the session from database (optional but recommended):**
   ```sql
   DELETE FROM session WHERE shop = 'galactiva.myshopify.com';
   DELETE FROM active_stores WHERE shop = 'galactiva.myshopify.com';
   ```

3. **Reinstall the app:**
   ```
   Visit: https://shopi-bundle.vercel.app/api/index?shop=galactiva.myshopify.com
   Click: "Install app"
   Grant permissions
   Wait for redirect to dashboard
   ```

4. **Verify the fix:**
   - App dashboard should load
   - Bundles should display without errors
   - No more 401 errors in logs

---

## 🧪 Step 3: Verify the Fix

Run these checks to confirm everything is working:

### Check 1: Config Status
```bash
curl https://shopi-bundle.vercel.app/api/debug/config
```

**Expected:** `"SHOPIFY_API_VERSION": "2025-10"`

### Check 2: Session Status
```bash
curl "https://shopi-bundle.vercel.app/api/debug/check-session?shop=galactiva.myshopify.com"
```

**Expected:**
```json
{
  "environment": {
    "apiVersion": "2025-10",
    "isCorrect": true
  },
  "session": {
    "hasAccessToken": true
  },
  "diagnosis": ["✓ Configuration looks correct"]
}
```

### Check 3: Test API Call
```bash
# This should now return bundles without 401 error
curl -X POST https://shopi-bundle.vercel.app/api/getBundles \
  -H "Authorization: Bearer {session-token}" \
  -d '{}'
```

**Expected:** `200 OK` with bundle data

### Check 4: Test in App
1. Open: `https://galactiva.myshopify.com/admin/apps`
2. Click: ShopiBundle
3. Dashboard should load
4. Bundles list should display
5. No 401 errors in console

---

## 🎯 Why This Happens

### The Full Picture

```
┌─────────────────────────────────────────────────────────────┐
│                    shopify.app.toml                         │
│                  api_version = "2026-04"                    │
│   (Only used by Shopify CLI and Partner Dashboard)         │
└─────────────────────────────────────────────────────────────┘
                            ↓
                  ❌ DOES NOT AFFECT RUNTIME
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  utils/shopify.ts:53                        │
│   apiVersion: process.env.SHOPIFY_API_VERSION              │
│   (This is what the app actually uses!)                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│            Vercel Environment Variable                      │
│         SHOPIFY_API_VERSION = "2026-04" ❌                  │
│   (This is where you need to change it!)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
                  When app makes API calls
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Shopify API Server                       │
│   Receives request with API version: 2026-04               │
│   Checks: Does version 2026-04 exist? NO                   │
│   Returns: 401 Unauthorized ❌                              │
└─────────────────────────────────────────────────────────────┘
```

### Timeline of Events

1. **Initial setup:** App was configured with `SHOPIFY_API_VERSION=2026-04`
2. **Session created:** Access token generated with invalid API version
3. **API calls fail:** Shopify rejects requests with 401 error
4. **We update shopify.app.toml:** ✓ But this doesn't affect runtime
5. **Environment variable still wrong:** ❌ Still set to 2026-04
6. **Session still invalid:** ❌ Token was created with wrong version
7. **Need to:**
   - Update environment variable ✅
   - Redeploy app ✅
   - Reinstall app to regenerate token ✅

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Only Updating shopify.app.toml
**Why it fails:** The app code doesn't read from this file at runtime

### ❌ Mistake 2: Updating Environment Variable But Not Redeploying
**Why it fails:** Old deployment still uses cached environment

### ❌ Mistake 3: Redeploying But Not Reinstalling App
**Why it fails:** Session token in database was created with old API version

### ✅ Correct: All Three Steps
1. Update environment variable
2. Redeploy application
3. Reinstall app on each shop

---

## 📊 Quick Reference: API Version Status

| API Version | Status | Use It? |
|-------------|--------|---------|
| 2024-01 | Deprecated | ❌ No |
| 2024-04 | Deprecated | ❌ No |
| 2024-07 | Deprecated | ❌ No |
| 2024-10 | Stable | ⚠️ Old |
| 2025-01 | Stable | ⚠️ Old |
| 2025-04 | Stable | ⚠️ Old |
| 2025-07 | Stable | ⚠️ Old |
| **2025-10** | **Latest Stable** | ✅ **Use this** |
| 2026-01 | May exist | ⚠️ Unverified |
| 2026-04 | Doesn't exist | ❌ **Invalid** |

**Recommendation:** Always use `2025-10` (latest stable as of Jan 2026)

---

## 🆘 If Issues Persist

### Still Getting 401 After Following All Steps?

1. **Check environment variable is actually updated:**
   ```bash
   curl https://shopi-bundle.vercel.app/api/debug/config | jq '.config.SHOPIFY_API_VERSION'
   # Should output: "2025-10"
   ```

2. **Check deployment used new environment variable:**
   - In Vercel: Deployments → Latest → View Function Logs
   - Look for initialization logs showing API version

3. **Verify session was regenerated:**
   ```bash
   curl "https://shopi-bundle.vercel.app/api/debug/check-session?shop=galactiva.myshopify.com"
   ```
   Check `hasAccessToken: true`

4. **Check for other API version references:**
   ```bash
   # In your codebase
   grep -r "2026-04" .
   # Should only find it in git history, not in active files
   ```

5. **Try on fresh development store:**
   - Install app on a new test store
   - If it works there, issue is with existing session

6. **Check Shopify API status:**
   - Visit: https://www.shopifystatus.com/
   - Ensure API is operational

---

## 📞 Need Help?

If you're still stuck:

1. **Run diagnostics:**
   ```bash
   curl https://shopi-bundle.vercel.app/api/debug/config
   curl "https://shopi-bundle.vercel.app/api/debug/check-session?shop=galactiva.myshopify.com"
   ```

2. **Share the output** - This will help identify the exact issue

3. **Check Vercel logs:**
   ```bash
   vercel logs
   ```
   Look for any errors during app initialization

4. **Verify database connection:**
   - Ensure DATABASE_URL is set correctly
   - Session table should exist
   - Check session record exists for the shop

---

## ✅ Success Checklist

Once fixed, you should see:

- [ ] `/api/debug/config` shows `SHOPIFY_API_VERSION: "2025-10"`
- [ ] `/api/debug/check-session` shows `"isCorrect": true`
- [ ] App dashboard loads without errors
- [ ] Bundles display correctly
- [ ] No 401 errors in Vercel logs
- [ ] Create bundle works
- [ ] Edit bundle works
- [ ] Analytics load

**All checkmarks?** 🎉 **Problem solved!**

---

**Last Updated:** 2026-01-19
**Status:** Comprehensive diagnostic and fix guide
**Required Actions:** Update env var → Redeploy → Reinstall app

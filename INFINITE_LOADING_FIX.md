# Infinite Loading Fix - Deployment Guide

## Problem Summary

The Shopify bundle app was stuck on a loading animation after login due to multiple critical issues:

1. **Missing `NEXT_PUBLIC_SHOPIFY_API_KEY` environment variable** - App Bridge couldn't initialize
2. **AppBridgeProvider required `host` query parameter** - Without it, the app would never exit loading state
3. **Prisma schema mismatch** - Code tried to update non-existent database fields
4. **No error handling for fetch responses** - Components would crash if authentication failed

---

## Code Changes Made

### 1. Updated Prisma Schema
**File**: `prisma/schema.prisma`

Added missing fields to `active_stores` model:
```prisma
model active_stores {
  shop        String    @id
  isActive    Boolean?  @default(false)
  setupError  String?      # NEW
  lastError   String?      # NEW
  lastErrorAt DateTime?    # NEW
}
```

### 2. Enhanced AppBridgeProvider
**File**: `components/providers/AppBridgeProvider.tsx`

- Added error state management
- Added debug logging
- Added timeout handling (5 seconds max)
- Added fallback for missing `host` parameter
- Added detailed error messages

### 3. Fixed ProductsTable
**File**: `components/ProductsTable.tsx`

- Added null check for fetch responses
- Wrapped fetch call in try-catch block
- Added error logging

### 4. Fixed AnalyticsTable
**File**: `components/AnalyticsTable.tsx`

- Added null check for fetch responses
- Wrapped fetch call in try-catch block
- Added error logging

---

## Deployment Steps

### Step 1: Update Vercel Environment Variables

**CRITICAL**: This is the most important step!

1. Go to your Vercel project: https://vercel.com/dashboard
2. Navigate to: **Settings → Environment Variables**
3. Add the following variable:

```
Key:   NEXT_PUBLIC_SHOPIFY_API_KEY
Value: 15673a82b49113d07a0f066fd048267e
Environment: All (Production, Preview, Development)
```

**Why this matters**: Next.js requires the `NEXT_PUBLIC_` prefix for any environment variable that needs to be available in the browser. The App Bridge script needs this to initialize.

### Step 2: Update Database Schema

Run Prisma migration to add the new fields:

```bash
# If using Prisma Migrate (recommended)
npx prisma migrate dev --name add_error_fields_to_active_stores

# OR if using db push (for prototyping)
npx prisma db push
```

This will add the `setupError`, `lastError`, and `lastErrorAt` fields to your `active_stores` table.

### Step 3: Deploy to Vercel

Push the code changes:

```bash
git add .
git commit -m "Fix: Resolve infinite loading issue with App Bridge initialization"
git push origin main
```

Vercel will automatically deploy. If you need to manually trigger:

```bash
# Force a new deployment
vercel --prod
```

### Step 4: Verify the Fix

1. **Clear browser cache and cookies** for your Shopify admin
2. Go to your Shopify admin: `https://[your-shop].myshopify.com/admin`
3. Navigate to: **Apps → ShopiBundle**
4. The app should now load properly and show the bundle management interface

#### What to Check:

**Browser Console (F12)**:
- Look for: `AppBridgeProvider init: { host: '...', shop: '...', apiKey: 'set' }`
- Should NOT see: `apiKey: 'missing'`

**Network Tab**:
- API calls to `/api/getBundles` should return 200
- Should NOT see 403 errors with reauthorization headers

**UI**:
- Loading spinner should disappear within 1-2 seconds
- Bundle table and analytics should display
- "Create Bundle" button should be visible

---

## Latest Updates (2026-01-18)

### Infinite Redirect Loop Fix

**Issue**: After deploying the initial fix, an infinite redirect loop occurred when the `host` parameter was missing.

**Root Cause**: AppBridgeProvider was checking query parameters before Next.js router was fully hydrated, causing premature redirects.

**Solution Applied**:
1. Wait for `router.isReady` before processing query parameters
2. Add sessionStorage counter to limit redirect attempts to 2
3. Redirect to Shopify admin URL (which reloads with proper parameters)
4. Show helpful error message after failed attempts

**Debug Page**: Access `/debug` to see diagnostic information about query parameters, environment variables, and app state.

---

## Troubleshooting

### Seeing "Missing host parameter, redirecting to auth" repeatedly?

This indicates an infinite redirect loop. The latest fix (commit ee6500f) resolves this by:
- Waiting for Next.js router to be fully ready
- Limiting redirect attempts to 2 using sessionStorage
- Breaking the loop and showing an error message after failed attempts

**If you're still seeing this**:
1. Clear browser cache and all site data for your app URL
2. Clear sessionStorage: Open browser console and run `sessionStorage.clear()`
3. Access the app ONLY through: Shopify Admin → Apps → ShopiBundle
4. DO NOT use bookmarked URLs or direct access

### Still seeing infinite loading?

**Check 1: Environment Variable**
```bash
# On Vercel, go to Settings → Environment Variables
# Verify NEXT_PUBLIC_SHOPIFY_API_KEY is set
```

**Check 2: Browser Console**
Open browser console (F12) and look for:
- `AppBridgeProvider init` log message
- Check if `apiKey: 'set'` or `apiKey: 'missing'`

**Check 3: Database**
```sql
-- Verify new fields exist
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'active_stores';

-- Should include: setupError, lastError, lastErrorAt
```

**Check 4: Force Reinstall**
1. Uninstall the app from Shopify admin
2. Delete shop data from database:
   ```sql
   DELETE FROM active_stores WHERE shop = 'your-shop.myshopify.com';
   DELETE FROM session WHERE shop = 'your-shop.myshopify.com';
   ```
3. Reinstall the app

### Error: "Missing required query parameters"

This means the app is being accessed directly without going through Shopify's app installation flow.

**Solution**: Always access the app through:
- Shopify Admin → Apps → ShopiBundle
- Or: `https://[shop].myshopify.com/admin/apps/[app-id]`

### Using the Debug Page

Access the debug page at: `https://shopi-bundle.vercel.app/debug`

The debug page shows:
- Query parameters (host, shop, embedded)
- Environment variable status
- Router ready state
- iframe detection
- App Bridge load status
- Redirect attempt count
- Full URL and referrer information

**Troubleshooting Actions Available**:
- Restart OAuth Flow - Begins a fresh authentication
- Clear Browser Storage - Removes cached data
- Reload Page - Forces a refresh

### Error: "App Bridge failed to load"

This means the CDN script didn't load within 5 seconds.

**Causes**:
- Network connectivity issues
- Ad blockers blocking Shopify CDN
- Corporate firewall blocking external scripts

**Solution**:
- Disable ad blockers
- Check network connection
- Try a different browser

### Database Error: Column 'setupError' doesn't exist

You forgot to run the Prisma migration!

**Solution**:
```bash
npx prisma db push
```

---

## Testing Checklist

- [ ] App loads without infinite spinner
- [ ] Bundle table displays existing bundles
- [ ] "Create Bundle" button is visible
- [ ] Analytics section shows data
- [ ] No console errors in browser
- [ ] API calls return 200 status
- [ ] Can create new bundle successfully
- [ ] Can edit existing bundle
- [ ] Can delete bundle
- [ ] Auto-bundle feature works

---

## Technical Details

### Why was App Bridge failing?

App Bridge requires:
1. Valid API key from environment variable
2. `host` parameter in URL (provided by Shopify when loading embedded app)
3. CDN script loaded from `https://cdn.shopify.com/shopifycloud/app-bridge.js`

The issue was that `NEXT_PUBLIC_SHOPIFY_API_KEY` was never set, so even though the script loaded, it couldn't initialize because `data-api-key` was `undefined`.

### What is the `host` parameter?

The `host` parameter is a base64-encoded string that contains:
- Shop domain
- App ID
- Timestamp

Shopify automatically includes this when loading embedded apps. If it's missing, the app redirects to the OAuth flow to get it.

### Why separate SHOPIFY_API_KEY and NEXT_PUBLIC_SHOPIFY_API_KEY?

- `SHOPIFY_API_KEY` - Server-side only, kept secret
- `NEXT_PUBLIC_SHOPIFY_API_KEY` - Public, exposed to browser for App Bridge

Both should have the same value, but Next.js requires the prefix for client-side variables.

---

## Environment Variables Reference

All required environment variables for Vercel:

```bash
# Shopify App Credentials
SHOPIFY_API_KEY=15673a82b49113d07a0f066fd048267e
SHOPIFY_API_SECRET=[your-secret-key]
NEXT_PUBLIC_SHOPIFY_API_KEY=15673a82b49113d07a0f066fd048267e  # NEW!

# App Configuration
SHOPIFY_APP_URL=https://shopi-bundle.vercel.app
SHOPIFY_API_SCOPES=write_metaobjects,read_metaobjects,write_metaobject_definitions,read_products,write_discounts,read_orders
SHOPIFY_API_VERSION=2026-04

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Encryption
ENCRYPTION_STRING=[your-encryption-key]
```

---

## Success Criteria

After deployment, the app should:
1. Load in under 2 seconds
2. Display bundle management UI
3. Allow CRUD operations on bundles
4. Show analytics data
5. Not show any loading spinner indefinitely

---

## Need Help?

If issues persist:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Try reinstalling the app in Shopify

## Monitoring

Add these checks to your monitoring:
- App Bridge initialization time
- API response times
- Error rates on `/api/getBundles`
- Session token expiration frequency

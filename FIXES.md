# Bundle Management App - Fixes and Testing Guide

## Issues Fixed

### 1. **Infinite Loading State** ✅
**Root Cause**: The AppBridgeProvider was waiting indefinitely for a `host` query parameter that might not be present, causing the app to never initialize.

**Files Modified**:
- `components/providers/AppBridgeProvider.tsx`
- `pages/index.tsx`

**Changes Made**:
- Added `isReady` and `error` states to AppBridgeContext
- Added automatic redirect to auth flow when host parameter is missing but shop parameter is present
- Added better error messages when App Bridge fails to initialize
- Added router.isReady check to prevent premature initialization attempts
- Added comprehensive console logging for debugging

### 2. **Missing Environment Variable Handling** ✅
**Root Cause**: Missing `NEXT_PUBLIC_SHOPIFY_API_KEY` caused silent failures.

**Changes Made**:
- Added explicit error handling when API key is missing
- Show user-friendly error messages with actionable steps
- Added validation and logging in AppBridgeProvider

### 3. **Poor Error Feedback** ✅
**Root Cause**: Users weren't getting helpful error messages or recovery options.

**Changes Made**:
- Updated index.tsx to use new `isReady` and `error` states from AppBridgeContext
- Added detailed console logging throughout the authentication flow
- Improved error messages with specific instructions for recovery
- Added "Retry" and "Reinstall App" buttons in error state

### 4. **App Bridge Script Loading** ✅
**Root Cause**: The Shopify App Bridge script wasn't explicitly loaded as a fallback.

**Files Modified**:
- `pages/_document.tsx`

**Changes Made**:
- Added App Bridge script tag to document head
- Shopify automatically injects this when embedded, but having it as fallback helps with testing

### 5. **useFetch Hook Improvements** ✅
**Root Cause**: The useFetch hook had no error handling or logging.

**Files Modified**:
- `components/hooks/useFetch.ts`

**Changes Made**:
- Added better error handling and logging
- Added warnings when window.shopify is not available
- Added try-catch for fetch errors
- Improved console logging for debugging

### 6. **New Diagnostic Endpoint** ✅
**New File**: `pages/api/diagnostic.ts`

A comprehensive diagnostic endpoint that checks:
- Environment variables configuration
- Database connectivity
- Session status and validity
- Active store status
- Auto bundle rules count
- Bundle discounts count

---

## Environment Variables Required

Ensure these are set in your Vercel deployment:

```bash
# Required
SHOPIFY_API_KEY=15673a82b49113d07a0f066fd048267e
NEXT_PUBLIC_SHOPIFY_API_KEY=15673a82b49113d07a0f066fd048267e
SHOPIFY_API_SECRET=<your-secret-here>
SHOPIFY_API_VERSION=2025-10
DATABASE_URL=<your-postgres-url>

# Optional
NODE_ENV=production
```

**CRITICAL**: Both `SHOPIFY_API_KEY` and `NEXT_PUBLIC_SHOPIFY_API_KEY` must have the same value.

---

## Testing Instructions

### Step 1: Verify Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all required variables are set (see list above)
3. If any changes were made, redeploy the application

### Step 2: Run Diagnostic Endpoint

1. Visit: `https://shopi-bundle.vercel.app/api/diagnostic?shop=YOUR_SHOP.myshopify.com`
2. Replace `YOUR_SHOP.myshopify.com` with your actual shop domain
3. Review the JSON response:
   - `status`: Should be "healthy" if all checks pass
   - `issues`: Array of any problems found
   - `recommendations`: Steps to fix issues

**Example Diagnostic Response** (Healthy):
```json
{
  "timestamp": "2026-01-21T10:00:00.000Z",
  "shop": "your-shop.myshopify.com",
  "status": "healthy",
  "checks": {
    "environment": {
      "hasApiKey": true,
      "hasApiSecret": true,
      "hasPublicApiKey": true,
      "apiVersion": "2025-10",
      "databaseUrl": "Set",
      "nodeEnv": "production",
      "apiKeyMatch": true
    },
    "database": {
      "connected": true,
      "provider": "PostgreSQL (via Prisma)"
    },
    "session": {
      "sessionId": "offline_your-shop.myshopify.com",
      "exists": true,
      "hasAccessToken": true,
      "tokenValid": true
    }
  },
  "issues": [],
  "recommendations": ["✓ All checks passed! App should be working correctly."]
}
```

### Step 3: Test App Installation

1. **Fresh Installation**:
   - Go to: `https://shopi-bundle.vercel.app/api?shop=YOUR_SHOP.myshopify.com`
   - This should start the OAuth flow
   - You should be redirected to Shopify's OAuth consent page
   - After approval, you should be redirected back to the app

2. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for these messages:
     - ✅ `Initializing App Bridge with: ...`
     - ✅ `✓ App Bridge initialized successfully`
     - ✅ `Fetching session token from App Bridge...`
     - ✅ `✓ Session token obtained`
     - ✅ `Fetching bundles from API...`
     - ✅ `✓ Bundles fetched successfully`

3. **Expected Behavior**:
   - App should load without infinite spinner
   - Should see either:
     - Bundle list (if bundles exist)
     - "No Bundles Found" message (if no bundles)
     - Clear error message with recovery options (if there's an issue)

### Step 4: Test Bundle Management Features

Once the app loads successfully, test these features:

#### Create Bundle
1. Navigate to the "Create Bundle" page
2. Fill in bundle details (name, title, description, discount)
3. Select products using the resource picker
4. Click "Create Bundle"
5. Verify bundle is created successfully

#### View Bundles
1. Go to the main page
2. Should see a list of all created bundles
3. Each bundle should show:
   - Bundle name
   - Discount percentage

#### Edit Bundle
1. Click on a bundle to edit
2. Modify bundle details
3. Save changes
4. Verify changes are saved

#### Delete Bundle
1. Select a bundle
2. Click delete
3. Confirm deletion
4. Verify bundle is removed

#### Auto Bundle Rules
1. Navigate to Auto Bundles page
2. Create a rule with:
   - Collections
   - Tags
   - Price ranges
3. Preview generated bundles
4. Enable/disable rules
5. Delete rules

### Step 5: Check Network Tab

1. Open Developer Tools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Look for these API calls:
   - `POST /api/getBundles` → Should return 200 OK
   - Other API endpoints should return appropriate status codes

### Step 6: Test Session Management

1. **Test Session Persistence**:
   - Refresh the page
   - App should load without requiring re-authentication
   - Bundles should load immediately

2. **Test Session Expiry** (if session is invalid):
   - Should see error message
   - "Reinstall App" button should trigger OAuth flow
   - After reinstallation, app should work

---

## Common Issues and Solutions

### Issue 1: "Missing required host parameter"
**Cause**: URL doesn't have host parameter
**Solution**:
- If you have shop parameter, app will auto-redirect to auth
- If not, visit: `/api?shop=YOUR_SHOP.myshopify.com`

### Issue 2: "App Bridge not initialized"
**Cause**: App Bridge failed to load or initialize
**Solution**:
- Check browser console for errors
- Verify `NEXT_PUBLIC_SHOPIFY_API_KEY` is set correctly in Vercel
- Try reinstalling the app

### Issue 3: API returns 401 Unauthorized
**Cause**: Missing or invalid session
**Solution**:
- Run diagnostic endpoint to check session
- If session is missing: Reinstall app
- If token is invalid: Delete session and reinstall
  - Visit: `/api/debug/force-delete-session?shop=YOUR_SHOP&confirm=yes`
  - Then reinstall

### Issue 4: "No offline session found"
**Cause**: App was never installed or session was deleted
**Solution**:
- Install or reinstall the app via OAuth flow
- Visit: `/api?shop=YOUR_SHOP.myshopify.com`

### Issue 5: Bundles don't load
**Cause**: Various possible causes
**Solution**:
1. Check browser console for errors
2. Check Network tab for failed API calls
3. Run diagnostic endpoint
4. Verify session exists and is valid
5. Check that bundle definition was created during installation

---

## Debugging Tools

### 1. Diagnostic Endpoint
```
/api/diagnostic?shop=YOUR_SHOP.myshopify.com
```
Comprehensive health check of the entire system.

### 2. Session Check Endpoint
```
/api/debug/check-session?shop=YOUR_SHOP.myshopify.com
```
Detailed session information and validation.

### 3. Force Delete Session
```
/api/debug/force-delete-session?shop=YOUR_SHOP&confirm=yes
```
Delete a corrupted session (requires reinstallation after).

### 4. Browser Console
- Check for console.log messages
- Look for errors or warnings
- Verify App Bridge initialization
- Monitor API calls

### 5. Network Tab
- Monitor all API requests
- Check response status codes
- Inspect request/response payloads
- Look for failed requests

---

## What Each Feature Should Do

### ✅ Core Bundle Management
- **View bundles**: Display all bundles in a clean list
- **Create bundle**: Form to create new bundle with products
- **Edit bundle**: Modify existing bundle details
- **Delete bundle**: Remove bundles with confirmation
- **Set pricing**: Fixed price or percentage discount

### ✅ Bundle Configuration
- **Select products**: Use Shopify's resource picker
- **Set quantities**: Specify quantity per product
- **Bundle types**: Fixed, mix & match, etc.
- **Add details**: Title, description, image

### ✅ Automatic Bundle Generation
- **Tag-based**: Auto-create bundles from product tags
- **Collection-based**: Auto-create from collections
- **Price range**: Auto-create by price brackets
- **Rules engine**: Set conditions for auto-generation

### ✅ Display & Visibility
- **Product pages**: Show available bundles
- **Cart**: Display bundle items in cart
- **Checkout**: Bundle items visible at checkout
- **Multi-language**: i18n support

### ✅ Analytics & Reporting
- **Sales metrics**: Track bundle sales
- **Popularity**: Most popular bundles
- **Revenue**: Revenue per bundle
- **Conversion**: Bundle conversion rates

---

## Files Modified Summary

1. **components/providers/AppBridgeProvider.tsx** - Enhanced initialization and error handling
2. **pages/index.tsx** - Improved loading states and error messages
3. **pages/_document.tsx** - Added App Bridge script
4. **components/hooks/useFetch.ts** - Better error handling
5. **pages/api/diagnostic.ts** - New comprehensive diagnostic endpoint

---

## Next Steps

After testing:

1. ✅ Verify all fixes work as expected
2. ✅ Test all bundle management features
3. ✅ Check that auto bundle rules work
4. ✅ Verify analytics are tracking correctly
5. ✅ Test in different browsers
6. ✅ Test with different shops

---

## Support

If issues persist after these fixes:

1. Run diagnostic endpoint and save the output
2. Check browser console and save any errors
3. Check Network tab for failed API calls
4. Check Vercel function logs for backend errors
5. Provide all above information for further debugging

---

## Summary of Changes

**Critical Fixes**:
- ✅ Fixed infinite loading state by improving App Bridge initialization
- ✅ Added proper error handling and user feedback
- ✅ Added automatic redirect to auth when parameters are missing
- ✅ Created diagnostic endpoint for troubleshooting
- ✅ Improved logging throughout the app

**Expected Outcome**:
- App should load within 2-3 seconds
- Clear error messages if something goes wrong
- Easy recovery options (Retry, Reinstall buttons)
- All bundle management features should work
- Better debugging capabilities

The app is now more robust and user-friendly! 🎉

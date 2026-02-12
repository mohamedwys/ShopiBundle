# Bundle Publish Fix - Error Resolution Guide

This document explains the two critical errors that were preventing bundle publishing, their root causes, and the implemented fixes.

---

## Overview of Errors

When attempting to publish a bundle, merchants were encountering two critical errors:

### Error 1: Missing Metaobject Field
```
Failed to create metaobject: Field definition "bundle_type" does not exist
```

### Error 2: Shopify Function Not Found
```
Failed to create discount: Function bundle-discount not found.
Ensure that it is released in the current app (312419745793),
and that the app is installed.
```

---

## Root Cause Analysis

### Error 1: Missing Metaobject Field "bundle_type"

**What the code expected:**
- The `shopify-integration.service.ts` (line 557) creates metaobjects with these fields:
  - `bundle_name`
  - `bundle_title`
  - `bundle_type` ⚠️
  - `description`
  - `created_at`
  - `discount`
  - `products`
  - `selection_rules` (optional)
  - `gift_settings` (optional)
  - `subscription_settings` (optional)

**What actually existed in Shopify:**
- The `createBundleDefinition.ts` only defined 6 fields:
  - `bundle_name`
  - `bundle_title`
  - `description`
  - `created_at`
  - `discount`
  - `products`

**Why it failed:**
- When creating a metaobject, Shopify validates that all field keys exist in the metaobject definition schema
- The code tried to set `bundle_type`, but the field was never added to the definition
- Shopify rejected the request with: "Field definition 'bundle_type' does not exist"

**Technical explanation:**
The metaobject definition acts as a schema. When you try to create or update a metaobject instance with a field that doesn't exist in the schema, Shopify returns an error. This is similar to trying to insert data into a database table column that doesn't exist.

---

### Error 2: Shopify Function "bundle-discount" Not Found

**What the code expected:**
- A deployed Shopify Function with handle `bundle-discount`
- The function code exists at `extensions/bundle-discount/`
- Configuration in `extensions/bundle-discount/shopify.extension.toml`

**What actually existed:**
- The function code exists locally but was **never deployed to Shopify**
- The function needs to be built and deployed via `shopify app deploy`

**Why it failed:**
- When creating a discount with `discountAutomaticAppCreate`, the code specifies `functionId: "bundle-discount"` (line 715 in `shopify-integration.service.ts`)
- Shopify looks for a deployed function with that handle in the app
- Since it was never deployed, Shopify returns: "Function bundle-discount not found"

**Technical explanation:**
Shopify Functions are serverless code that runs on Shopify's infrastructure at checkout time. They must be:
1. Built (TypeScript → JavaScript)
2. Deployed to Shopify via the CLI
3. Approved/released in the Partner Dashboard
4. Installed with the app

Simply having the code in your repository is not enough—the function must be deployed to Shopify's servers.

---

## Implemented Fixes

### Fix 1: Metaobject Definition Sync Endpoint

**Created:** `/pages/api/admin/sync-metaobject-definition.ts`

**What it does:**
1. Fetches the current `product-bundles` metaobject definition from Shopify
2. Compares existing fields with the required fields
3. Adds any missing fields via `metaobjectDefinitionUpdate` mutation
4. If the definition doesn't exist, creates it from scratch
5. Returns a detailed report of what was added

**Key features:**
- **Idempotent**: Safe to run multiple times—won't duplicate fields
- **No downtime**: Existing bundles continue to work during sync
- **Detailed reporting**: Shows exactly what fields were added vs already existed

**Expected fields added:**
- `bundle_type` (single_line_text_field)
- `selection_rules` (json)
- `gift_settings` (json)
- `subscription_settings` (json)

**API Usage:**
```bash
POST /api/admin/sync-metaobject-definition
Authorization: Bearer <session-token>
X-Shop-Domain: <shop-domain>
```

**Response example:**
```json
{
  "success": true,
  "data": {
    "message": "Metaobject definition updated successfully",
    "status": "updated",
    "definitionId": "gid://shopify/MetaobjectDefinition/123",
    "existingFields": ["bundle_name", "bundle_title", "description", "created_at", "discount", "products"],
    "addedFields": ["bundle_type", "selection_rules", "gift_settings", "subscription_settings"],
    "allFields": ["bundle_name", "bundle_title", "bundle_type", "description", "created_at", "discount", "products", "selection_rules", "gift_settings", "subscription_settings"]
  }
}
```

---

### Fix 2: Shopify Function Deployment Guide

**The function exists at:** `extensions/bundle-discount/`

**Function details:**
- **Handle:** `bundle-discount`
- **Type:** `function`
- **Target:** `purchase.product-discount.run`
- **Purpose:** Validates that ALL bundle products + quantities are in the cart before applying discount

**Deployment steps:**

#### Option A: Deploy via CLI (Recommended)

1. **Install Shopify CLI** (if not already installed):
   ```bash
   npm install -g @shopify/cli @shopify/app
   ```

2. **Authenticate with Partner account:**
   ```bash
   npm run shopify auth login
   ```

3. **Deploy the function:**
   ```bash
   npm run shopify app deploy
   ```

   This will:
   - Build the TypeScript function code
   - Upload it to Shopify
   - Register it with your app
   - Make it available for use in discounts

4. **Verify deployment:**
   ```bash
   npm run shopify app function list
   ```

   You should see `bundle-discount` in the list with status "DEPLOYED"

#### Option B: Deploy via Shopify Partner Dashboard

1. Go to your app in the Shopify Partner Dashboard
2. Navigate to "Extensions" → "Functions"
3. If the function appears but is not released:
   - Click "Create version"
   - Add release notes
   - Click "Release"
4. Install the updated app version in your test store

**Verification:**
After deployment, the function will be available for creating discounts. You can verify by:
1. Running: `GET /api/admin/validate-publish-readiness`
2. Checking that `checks.discountFunctionDeployed.passed === true`

---

### Fix 3: Pre-Publish Validation Service

**Created:** `/lib/services/publish-validation.service.ts`

**What it does:**
Validates that the shop is ready to publish bundles BEFORE attempting to create Shopify resources. This prevents cryptic errors and provides clear instructions for fixing issues.

**Checks performed:**
1. **Metaobject definition exists**: Verifies `product-bundles` definition is present
2. **All required fields exist**: Checks for all 10 required fields including `bundle_type`
3. **Shopify Function deployed**: Confirms `bundle-discount` function is available

**Integration:**
The validation service is called automatically in `bundle.service.ts` (line 671) before publishing:

```typescript
// PRE-PUBLISH VALIDATION
const client = createShopifyClient(shop);
const validationService = getPublishValidationService();
await validationService.validateOrThrow(client, shop);
```

If validation fails, the error message provides clear instructions:
```
Cannot publish bundle. Please fix the following issues:

1. Metaobject definition is missing required fields: bundle_type, selection_rules, gift_settings, subscription_settings. Please run: POST /api/admin/sync-metaobject-definition
2. Shopify Function "bundle-discount" is not deployed. Please run: npm run shopify app deploy

For more details, check: GET /api/admin/validate-publish-readiness
```

---

### Fix 4: Validation API Endpoint

**Created:** `/pages/api/admin/validate-publish-readiness.ts`

**What it does:**
Provides a standalone endpoint for checking if the shop is ready to publish bundles. Useful for:
- Pre-flight checks before publishing
- Admin dashboard health checks
- Troubleshooting publish failures

**API Usage:**
```bash
GET /api/admin/validate-publish-readiness
Authorization: Bearer <session-token>
X-Shop-Domain: <shop-domain>
```

**Response example (ready):**
```json
{
  "success": true,
  "data": {
    "ready": true,
    "checks": {
      "metaobjectDefinitionExists": {
        "name": "Metaobject Definition Exists",
        "passed": true,
        "message": "Metaobject definition exists",
        "details": {
          "definitionId": "gid://shopify/MetaobjectDefinition/123",
          "type": "product-bundles"
        }
      },
      "metaobjectFieldsComplete": {
        "name": "Metaobject Fields Complete",
        "passed": true,
        "message": "All required metaobject fields are present",
        "details": {
          "fieldCount": 10,
          "fields": ["bundle_name", "bundle_title", "bundle_type", ...]
        }
      },
      "discountFunctionDeployed": {
        "name": "Discount Function Deployed",
        "passed": true,
        "message": "Shopify Function \"bundle-discount\" is deployed",
        "details": {
          "functionId": "gid://shopify/Function/456",
          "handle": "bundle-discount",
          "apiType": "product_discounts"
        }
      },
      "sessionValid": {
        "name": "Session Valid",
        "passed": true,
        "message": "Session is valid"
      }
    },
    "errors": [],
    "warnings": []
  }
}
```

**Response example (not ready):**
```json
{
  "success": true,
  "data": {
    "ready": false,
    "checks": {
      "metaobjectDefinitionExists": { "passed": true, ... },
      "metaobjectFieldsComplete": {
        "passed": false,
        "message": "Missing 4 required fields: bundle_type, selection_rules, gift_settings, subscription_settings",
        "details": {
          "missingFields": ["bundle_type", "selection_rules", "gift_settings", "subscription_settings"]
        }
      },
      "discountFunctionDeployed": {
        "passed": false,
        "message": "Shopify Function \"bundle-discount\" not found"
      },
      "sessionValid": { "passed": true, ... }
    },
    "errors": [
      "Metaobject definition is missing fields: bundle_type, selection_rules, gift_settings, subscription_settings. Run POST /api/admin/sync-metaobject-definition to add them.",
      "Shopify Function \"bundle-discount\" is not deployed. Run \"npm run shopify app deploy\" to deploy it."
    ],
    "warnings": []
  }
}
```

---

## Testing Instructions

### Step 1: Fix Metaobject Definition

1. **Check current state:**
   ```bash
   curl -X GET https://shopi-bundle.vercel.app/api/admin/validate-publish-readiness \
     -H "Authorization: Bearer <token>" \
     -H "X-Shop-Domain: <shop>"
   ```

2. **Sync metaobject definition:**
   ```bash
   curl -X POST https://shopi-bundle.vercel.app/api/admin/sync-metaobject-definition \
     -H "Authorization: Bearer <token>" \
     -H "X-Shop-Domain: <shop>"
   ```

3. **Verify fields added:**
   Check the response for `addedFields` array. Should include `bundle_type`, `selection_rules`, `gift_settings`, `subscription_settings`.

---

### Step 2: Deploy Shopify Function

1. **Build the function:**
   ```bash
   cd extensions/bundle-discount
   npm run build
   ```

2. **Deploy to Shopify:**
   ```bash
   cd ../..
   npm run shopify app deploy
   ```

3. **Verify deployment:**
   ```bash
   npm run shopify app function list
   ```

   Look for `bundle-discount` with status "DEPLOYED"

4. **Verify via API:**
   ```bash
   curl -X GET https://shopi-bundle.vercel.app/api/admin/validate-publish-readiness \
     -H "Authorization: Bearer <token>" \
     -H "X-Shop-Domain: <shop>"
   ```

   Check that `checks.discountFunctionDeployed.passed === true`

---

### Step 3: Test Bundle Publishing

1. **Create a test bundle:**
   ```bash
   curl -X POST https://shopi-bundle.vercel.app/api/v2/bundles \
     -H "Authorization: Bearer <token>" \
     -H "X-Shop-Domain: <shop>" \
     -H "Content-Type: application/json" \
     -d '{
       "shop": "<shop>",
       "name": "Test Bundle",
       "title": "Test Bundle Title",
       "description": "Test description",
       "type": "FIXED",
       "discountPercent": 10,
       "components": [
         {
           "shopifyProductId": "gid://shopify/Product/123",
           "quantity": 1
         },
         {
           "shopifyProductId": "gid://shopify/Product/456",
           "quantity": 1
         }
       ]
     }'
   ```

2. **Publish the bundle:**
   ```bash
   curl -X POST https://shopi-bundle.vercel.app/api/v2/bundles/<bundle-id>/publish \
     -H "Authorization: Bearer <token>" \
     -H "X-Shop-Domain: <shop>"
   ```

3. **Expected results:**
   - ✅ No "bundle_type does not exist" error
   - ✅ No "Function bundle-discount not found" error
   - ✅ Metaobject created successfully
   - ✅ Discount created successfully
   - ✅ Bundle status changed to "ACTIVE"

4. **If validation fails:**
   The error message will provide clear instructions:
   ```json
   {
     "error": "Cannot publish bundle: Cannot publish bundle. Please fix the following issues:\n\n1. Metaobject definition is missing required fields: bundle_type. Please run: POST /api/admin/sync-metaobject-definition\n\nFor more details, check: GET /api/admin/validate-publish-readiness"
   }
   ```

---

### Step 4: Test in Shopify Admin

1. **Check metaobject created:**
   - Go to Shopify Admin → Settings → Custom Data → Metaobjects
   - Click "Product Bundles"
   - Find your published bundle
   - Verify fields: `bundle_name`, `bundle_title`, `bundle_type`, etc.

2. **Check discount created:**
   - Go to Shopify Admin → Discounts
   - Find discount with title: "Bundle: Test Bundle Title [...]"
   - Click to view details
   - Verify:
     - Type: "Automatic discount"
     - Method: "App discount"
     - Status: "Active"

3. **Test checkout:**
   - Add all bundle products to cart
   - Go to checkout
   - Verify discount is applied
   - Verify discount amount matches bundle discount percentage

---

## Troubleshooting

### Issue: "bundle_type does not exist" still occurs

**Solution:**
1. Run sync endpoint: `POST /api/admin/sync-metaobject-definition`
2. If sync succeeds but error persists, check:
   - Are you using the correct shop domain?
   - Is the session token valid?
   - Clear any cached Shopify client instances

---

### Issue: "Function bundle-discount not found" still occurs

**Solution:**
1. Verify function deployment: `npm run shopify app function list`
2. If not deployed, run: `npm run shopify app deploy`
3. If deployed but error persists:
   - Check the function handle in `extensions/bundle-discount/shopify.extension.toml`
   - Ensure it matches `handle = "bundle-discount"`
   - Check the app is installed in the shop
   - Verify the app has the correct scopes: `write_discounts`

---

### Issue: Validation passes but publish still fails

**Solution:**
1. Check the detailed error in the API response
2. Verify Shopify API version compatibility (app uses `2026-01`)
3. Check Shopify API status: https://status.shopify.com
4. Review logs for rate limiting or quota issues

---

## CLI Commands Reference

**Sync metaobject definition:**
```bash
curl -X POST https://shopi-bundle.vercel.app/api/admin/sync-metaobject-definition \
  -H "Authorization: Bearer <token>" \
  -H "X-Shop-Domain: <shop>"
```

**Check publish readiness:**
```bash
curl -X GET https://shopi-bundle.vercel.app/api/admin/validate-publish-readiness \
  -H "Authorization: Bearer <token>" \
  -H "X-Shop-Domain: <shop>"
```

**Deploy Shopify Function:**
```bash
npm run shopify app deploy
```

**List deployed functions:**
```bash
npm run shopify app function list
```

**Build function locally:**
```bash
cd extensions/bundle-discount
npm run build
```

---

## Summary

### What was broken:
1. Metaobject definition missing `bundle_type` and other fields
2. Shopify Function never deployed to Shopify servers

### What was fixed:
1. Created sync endpoint to add missing metaobject fields
2. Documented function deployment process
3. Added pre-publish validation to prevent cryptic errors
4. Created validation endpoint for health checks

### How to use:
1. Run: `POST /api/admin/sync-metaobject-definition` (once per shop)
2. Run: `npm run shopify app deploy` (once per app)
3. Publish bundles normally—validation runs automatically

### Prevention:
- Validation now runs before every publish attempt
- Clear error messages guide merchants to fix issues
- Idempotent endpoints safe to run repeatedly

---

## Files Changed

**New files:**
- `/pages/api/admin/sync-metaobject-definition.ts` - Sync endpoint
- `/pages/api/admin/validate-publish-readiness.ts` - Validation endpoint
- `/lib/services/publish-validation.service.ts` - Validation service
- `/BUNDLE_PUBLISH_FIX.md` - This documentation

**Modified files:**
- `/lib/services/bundle.service.ts` - Added pre-publish validation

**No changes to:**
- Bundle publish flow (still works the same way)
- Shopify Function code (unchanged)
- Metaobject structure for existing bundles (backward compatible)
- API contracts (all existing endpoints work as before)

---

## Support

If you encounter issues not covered in this guide:

1. Check validation endpoint: `GET /api/admin/validate-publish-readiness`
2. Review error logs in monitoring dashboard
3. Verify Shopify App configuration in Partner Dashboard
4. Check app installation status in merchant admin

For persistent issues, provide:
- Shop domain
- Bundle ID
- Full error message
- Response from validation endpoint

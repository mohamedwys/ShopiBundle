# Deployment Instructions - OAuth Fix

## Overview
This fix implements a **cookieless OAuth flow** that works reliably in serverless environments (Vercel, AWS Lambda, Netlify) and embedded Shopify apps.

## Critical Changes
- OAuth state stored in database instead of cookies
- Manual HMAC validation and token exchange
- Works in cross-origin iframe contexts
- No dependency on cookie persistence

---

## Step 1: Run Database Migration

### Option A: Using Prisma CLI (Recommended)
```bash
npx prisma migrate deploy
```

### Option B: Run SQL Directly
Execute the SQL in `DATABASE_MIGRATION.sql` on your PostgreSQL database:

```bash
psql $DATABASE_URL -f DATABASE_MIGRATION.sql
```

Or copy the SQL and run it in your database GUI (TablePlus, pgAdmin, etc.):

```sql
CREATE TABLE IF NOT EXISTS "oauth_state" (
    "state" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "oauth_state_pkey" PRIMARY KEY ("state")
);

CREATE INDEX IF NOT EXISTS "oauth_state_shop_idx" ON "oauth_state"("shop");
CREATE INDEX IF NOT EXISTS "oauth_state_createdAt_idx" ON "oauth_state"("createdAt");
CREATE INDEX IF NOT EXISTS "session_shop_idx" ON "session"("shop");
```

### Option C: Use Prisma Studio/Database Client
1. Connect to your database using connection string from `DATABASE_URL`
2. Execute the SQL from `DATABASE_MIGRATION.sql`

---

## Step 2: Regenerate Prisma Client

After running the migration, regenerate the Prisma client:

```bash
npx prisma generate
```

---

## Step 3: Deploy to Vercel/Production

### If using Vercel:
```bash
git push origin claude/fix-shopify-oauth-9lifR
```

Then merge to main and Vercel will auto-deploy.

### If using other platforms:
1. Commit and push the changes
2. Deploy via your CI/CD pipeline
3. Ensure `DATABASE_URL` environment variable is set

---

## Step 4: Verify Environment Variables

Ensure these are set in your production environment:

```
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_API_SCOPES=write_products,write_customers,write_discounts,read_orders
SHOPIFY_API_VERSION=2024-01
SHOPIFY_APP_URL=https://your-production-domain.com
DATABASE_URL=postgresql://user:pass@host:port/db
ENCRYPTION_STRING=your_random_string
```

**CRITICAL:** `SHOPIFY_APP_URL` must match EXACTLY what's in Shopify Partners Dashboard.

---

## Step 5: Update Shopify Partners Dashboard

1. Go to https://partners.shopify.com
2. Select your app
3. Go to "Configuration"
4. Verify these settings:
   - **App URL:** `https://your-domain.com`
   - **Allowed redirection URL(s):** `https://your-domain.com/api/auth/callback`

---

## Step 6: Test the OAuth Flow

1. Uninstall the app from your test store (if installed)
2. Reinstall from Shopify Admin
3. Monitor logs for successful authentication:

Expected log sequence:
```
✓ OAuth state stored in database
✓ HMAC validation passed
✓ OAuth state verified from database
✓ OAuth state cleaned up
✓ Access token received from Shopify
✓ Token validation passed
✓ Session stored with ID: offline_yourshop.myshopify.com
✓ Session verified in database
✓ Bundle definition created
=== AUTH CALLBACK SUCCESS ===
```

---

## Troubleshooting

### Error: "table public.oauth_state does not exist"
- You haven't run the database migration yet
- Run Step 1 above

### Error: "Invalid token prefix"
- Check that `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET` are correct
- Verify app credentials in Partners Dashboard

### Error: "Invalid OAuth state - possible CSRF attack"
- OAuth state expired (10 minute timeout)
- Try the installation again
- Clear any stale `oauth_state` records: `DELETE FROM oauth_state WHERE "createdAt" < NOW() - INTERVAL '10 minutes'`

### Error: "HMAC validation failed"
- `SHOPIFY_API_SECRET` is incorrect
- Request may be forged (check request origin)

### Error: "Token exchange failed"
- `SHOPIFY_APP_URL` doesn't match Partners Dashboard
- Redirect URI mismatch
- Verify redirect URL in Partners Dashboard: `https://your-domain.com/api/auth/callback`

---

## How It Works

### Before (Cookie-based - BROKEN in serverless):
1. User clicks "Install App"
2. `/api/auth` calls `shopify.auth.begin()` → sets OAuth cookie
3. Shopify redirects to `/api/auth/callback`
4. Cookie is **LOST** in serverless (different Lambda invocation)
5. ❌ Error: "CookieNotFound"

### After (Database-based - WORKS everywhere):
1. User clicks "Install App"
2. `/api/auth` generates random state → stores in `oauth_state` table
3. Manually builds OAuth URL and redirects to Shopify
4. Shopify redirects to `/api/auth/callback` with code + state
5. Verify HMAC signature manually
6. Retrieve state from database (CSRF protection)
7. Exchange code for token via direct API call to Shopify
8. Create session manually and store in database
9. ✓ Success - No cookies required!

---

## Files Changed

- `prisma/schema.prisma` - Added `oauth_state` model
- `pages/api/auth/index.ts` - Manual OAuth URL generation
- `pages/api/auth/callback.ts` - Manual token exchange
- `utils/authDebug.ts` - Enhanced debugging
- `middleware.ts` - Cache control headers
- `pages/exitframe.tsx` - Iframe breakout component
- `.env.example` - Updated environment template

---

## Production Checklist

- [ ] Database migration completed
- [ ] Prisma client regenerated
- [ ] Environment variables verified
- [ ] Shopify Partners Dashboard URLs match
- [ ] Code deployed to production
- [ ] OAuth flow tested successfully
- [ ] Logs show successful token exchange
- [ ] Session persists across requests
- [ ] Bundle functionality works

---

## Support

If issues persist:
1. Check Vercel/Lambda logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure database is accessible from serverless functions
4. Check Shopify Partners Dashboard configuration

The cookieless OAuth implementation is production-ready and resolves all serverless cookie persistence issues.

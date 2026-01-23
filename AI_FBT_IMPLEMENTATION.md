# AI-Powered FBT Bundle Implementation

## Overview
AI-powered Frequently Bought Together system using batch analysis with Apriori algorithm.

## Database Schema
- `ai_fbt_bundles` - AI-generated bundle recommendations
- `ai_bundle_events` - Event tracking (impression, click, add_to_cart, purchase)
- `ai_bundle_ab_assignments` - A/B test variant assignments
- `ai_fbt_config` - Per-shop configuration

## Backend API Routes

### AI Bundle Management
- `POST /api/ai/fbt/generate` - Generate AI bundles from order history
- `GET /api/ai/fbt/list` - List AI bundles with filters
- `POST /api/ai/fbt/override` - Accept/reject/lock bundles
- `GET/POST /api/ai/fbt/config` - Get/update AI configuration

### Event Tracking
- `POST /api/ai/events/track` - Track bundle events

### A/B Testing
- `POST /api/ai/ab/assign` - Assign A/B variant to session
- `GET /api/ai/ab/analytics` - Get A/B test analytics

### Storefront
- `GET /api/proxy_route/ai-bundles-for-product` - Get AI bundles for product

## AI Algorithm
- `utils/ai/apriori.ts` - Apriori association rule mining
- `utils/shopifyQueries/getOrders.ts` - Fetch order data

## Admin UI Components
- `pages/ai_bundles.tsx` - Main AI bundles page
- `components/AIFBTConfig.tsx` - Configuration panel
- `components/AIBundlesTable.tsx` - Bundle list with controls
- `components/AIBundleAnalytics.tsx` - A/B test analytics

## Theme Extension
- `blocks/ai-bundle.liquid` - Liquid template for storefront
- `assets/ai-bundle.js` - Frontend bundle display & tracking
- `snippets/ai-bundle-tracking.liquid` - Purchase tracking

## Setup Instructions

### 1. Run Database Migration
```bash
npx prisma migrate deploy
npx prisma generate
```

### 2. Configure AI Settings
Navigate to `/ai_bundles` in admin panel:
- Enable AI FBT
- Set minimum support (default: 1%)
- Set minimum confidence (default: 30%)
- Set minimum lift (default: 1.0)
- Set max bundles per product (default: 3)
- Set lookback days (default: 90)

### 3. Generate AI Bundles
Click "Generate AI Bundles" to analyze order history and create recommendations.

### 4. Theme Integration
Add AI Bundle block to product pages in theme editor.

## Features
- Batch analysis of order history (90 days)
- Association rule mining with configurable thresholds
- Top 3 recommendations per product
- Manual override controls (accept/reject/lock)
- A/B testing with session-based variants
- Event tracking for analytics
- Coexists with existing manual bundles

## API Usage Examples

### Generate AI Bundles
```javascript
POST /api/ai/fbt/generate
{
  "shop": "example.myshopify.com"
}
```

### List AI Bundles
```javascript
GET /api/ai/fbt/list?shop=example.myshopify.com&productId=123
```

### Override Bundle
```javascript
POST /api/ai/fbt/override
{
  "shop": "example.myshopify.com",
  "bundleId": "clxxxxx",
  "action": "accept" // or "reject", "lock", "unlock"
}
```

### Track Event
```javascript
POST /api/ai/events/track
{
  "shop": "example.myshopify.com",
  "bundleId": "clxxxxx",
  "productId": "123",
  "eventType": "impression", // or "click", "add_to_cart", "purchase"
  "sessionId": "session_xxxxx",
  "variantGroupId": "variant_xxxxx"
}
```

## Performance Notes
- Batch generation processes up to 10,000 orders
- 500ms delay between API calls to respect rate limits
- Frontend events tracked asynchronously
- A/B assignments cached per session (7 days)

## Files Created
1. prisma/schema.prisma (modified)
2. prisma/migrations/20260123_ai_fbt_bundles/migration.sql
3. utils/ai/apriori.ts
4. utils/shopifyQueries/getOrders.ts
5. pages/api/ai/fbt/generate.ts
6. pages/api/ai/fbt/list.ts
7. pages/api/ai/fbt/override.ts
8. pages/api/ai/fbt/config.ts
9. pages/api/ai/events/track.ts
10. pages/api/ai/ab/assign.ts
11. pages/api/ai/ab/analytics.ts
12. pages/api/proxy_route/ai-bundles-for-product.ts
13. components/AIBundlesTable.tsx
14. components/AIFBTConfig.tsx
15. components/AIBundleAnalytics.tsx
16. pages/ai_bundles.tsx
17. extensions/product-bundle/assets/ai-bundle.js
18. extensions/product-bundle/blocks/ai-bundle.liquid
19. extensions/product-bundle/snippets/ai-bundle-tracking.liquid

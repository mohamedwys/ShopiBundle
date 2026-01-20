#!/bin/bash

echo "=== Verifying Shopify Configuration ==="
echo ""
echo "Expected API Key (from shopify.app.toml): 15673a82b49113d07a0f066fd048267e"
echo ""
echo "To check your Vercel environment variables:"
echo "1. Go to: https://vercel.com/mohamedwys-projects/shopi-bundle/settings/environment-variables"
echo "2. Verify SHOPIFY_API_KEY matches the expected value above"
echo "3. Verify SHOPIFY_API_SECRET is set (don't share the actual value)"
echo "4. Verify SHOPIFY_API_VERSION is 2025-10"
echo ""
echo "If any don't match, update them and redeploy."

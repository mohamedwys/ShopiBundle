/**
 * ShopiBundle - Auto-injection and Cart Integration
 * Handles automatic bundle display on product pages and cart integration
 */

(function() {
  'use strict';

  const BundleManager = {
    init() {
      this.setupBundleForm();
      this.setupAutoInjection();
      this.setupCartObserver();
    },

    /**
     * Setup bundle add-to-cart form to use Cart API for better compatibility
     */
    setupBundleForm() {
      document.querySelectorAll('.bundle-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const button = form.querySelector('button[type="submit"]');
          const originalText = button.textContent;
          button.disabled = true;
          button.textContent = 'Adding...';

          try {
            // Collect all items from form
            const formData = new FormData(form);
            const items = [];
            let itemIndex = 0;

            while (formData.has(`items[${itemIndex}][id]`)) {
              items.push({
                id: formData.get(`items[${itemIndex}][id]`),
                quantity: parseInt(formData.get(`items[${itemIndex}][quantity]`)) || 1,
                properties: {
                  '_bundle_id': formData.get(`items[${itemIndex}][properties][_bundle_id]`),
                  '_bundle_discount': formData.get(`items[${itemIndex}][properties][_bundle_discount]`)
                }
              });
              itemIndex++;
            }

            // Use Shopify Cart API
            const response = await fetch('/cart/add.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ items })
            });

            if (response.ok) {
              button.textContent = '✓ Added!';

              // Trigger cart update event
              document.dispatchEvent(new CustomEvent('cart:updated'));

              // Redirect to cart or show notification
              setTimeout(() => {
                if (window.Shopify && window.Shopify.theme && window.Shopify.theme.cartDrawer) {
                  // If theme has cart drawer, trigger it
                  document.dispatchEvent(new CustomEvent('cart:open'));
                } else {
                  // Otherwise redirect to cart page
                  window.location.href = '/cart';
                }
              }, 500);
            } else {
              throw new Error('Failed to add bundle to cart');
            }
          } catch (error) {
            console.error('Bundle add to cart error:', error);
            button.textContent = 'Error - Try again';
            setTimeout(() => {
              button.textContent = originalText;
              button.disabled = false;
            }, 2000);
          }
        });
      });
    },

    /**
     * Auto-inject bundles on product pages when a product is part of a bundle
     */
    setupAutoInjection() {
      // Only run on product pages
      if (!document.body.classList.contains('template-product')) return;

      // Get current product ID from meta tag or global Shopify object
      const productId = this.getCurrentProductId();
      if (!productId) return;

      // Fetch bundles containing this product
      this.fetchBundlesForProduct(productId);
    },

    getCurrentProductId() {
      // Try multiple methods to get product ID
      if (window.ShopifyAnalytics && window.ShopifyAnalytics.meta && window.ShopifyAnalytics.meta.product) {
        return window.ShopifyAnalytics.meta.product.id;
      }

      const metaTag = document.querySelector('meta[property="og:product:id"]');
      if (metaTag) {
        return metaTag.content;
      }

      return null;
    },

    async fetchBundlesForProduct(productId) {
      try {
        // This would call your app's proxy route to get bundles
        const response = await fetch(`/apps/shopibundle/bundles-for-product?product_id=${productId}`);
        if (response.ok) {
          const bundles = await response.json();
          if (bundles.length > 0) {
            this.injectBundleDisplay(bundles[0]); // Show first matching bundle
          }
        }
      } catch (error) {
        console.log('Could not fetch bundles:', error);
      }
    },

    injectBundleDisplay(bundleData) {
      // Find product form or a good injection point
      const productForm = document.querySelector('form[action*="/cart/add"]');
      if (!productForm) return;

      // Create bundle container
      const bundleContainer = document.createElement('div');
      bundleContainer.className = 'bundle-suggestion';
      bundleContainer.innerHTML = this.generateBundleHTML(bundleData);

      // Insert after product form
      productForm.parentNode.insertBefore(bundleContainer, productForm.nextSibling);
    },

    generateBundleHTML(bundle) {
      // Generate HTML for bundle display (simplified)
      return `
        <div class="bundle-recommendation">
          <h3>Complete the Bundle</h3>
          <p>${bundle.title} - Save ${bundle.discount}%</p>
          <button class="add-bundle-btn" data-bundle-id="${bundle.id}">
            Add Bundle to Cart
          </button>
        </div>
      `;
    },

    /**
     * Observe cart and add bundle indicators
     */
    setupCartObserver() {
      if (!document.body.classList.contains('template-cart')) return;

      // Add bundle badges to cart items
      this.markBundleItems();

      // Re-mark on cart updates
      document.addEventListener('cart:updated', () => {
        setTimeout(() => this.markBundleItems(), 500);
      });
    },

    markBundleItems() {
      // Look for cart items with bundle properties
      document.querySelectorAll('.cart-item, [data-cart-item]').forEach(item => {
        const bundleIdInput = item.querySelector('input[name*="_bundle_id"]');
        if (bundleIdInput && bundleIdInput.value) {
          // Add visual indicator
          if (!item.querySelector('.bundle-badge')) {
            const badge = document.createElement('span');
            badge.className = 'bundle-badge';
            badge.textContent = '🎁 Bundle Item';
            badge.style.cssText = 'display: inline-block; background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px;';

            const title = item.querySelector('.cart-item__name, .cart-item__title, h3, h4');
            if (title) {
              title.appendChild(badge);
            }
          }
        }
      });
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BundleManager.init());
  } else {
    BundleManager.init();
  }
})();

/**
 * ShopiBundle Enhanced - Phase 2
 *
 * Features:
 * - Quantity selector with inventory limits
 * - Variant selection support
 * - Real-time price updates
 * - Enhanced add-to-cart with loading states
 * - Cart integration with bundle grouping
 * - Inventory status tracking
 * - Analytics event tracking
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    cartAddUrl: '/cart/add.js',
    cartGetUrl: '/cart.js',
    eventTrackingEnabled: true,
    animationDuration: 300,
  };

  /**
   * Bundle Manager - Handles all bundle interactions
   */
  const BundleManager = {
    bundles: new Map(),

    init() {
      // Initialize all bundles on page
      document.querySelectorAll('.shopibundle-container').forEach(container => {
        this.initBundle(container);
      });

      // Setup cart observer for bundle badges
      this.setupCartObserver();

      // Track page view if on product page
      if (this.isProductPage()) {
        this.trackEvent('bundle_impression');
      }
    },

    /**
     * Initialize a single bundle container
     */
    initBundle(container) {
      const bundleId = container.dataset.bundleId;
      const bundleSlug = container.dataset.bundleSlug;
      const isOutOfStock = container.dataset.outOfStock === 'true';

      const bundleData = {
        id: bundleId,
        slug: bundleSlug,
        container,
        isOutOfStock,
        quantity: 1,
        variantSelections: new Map(),
      };

      this.bundles.set(bundleId, bundleData);

      // Setup event listeners
      this.setupQuantitySelector(container, bundleData);
      this.setupVariantSelectors(container, bundleData);
      this.setupAddToCartForm(container, bundleData);
    },

    /**
     * Setup quantity selector (+/- buttons and input)
     */
    setupQuantitySelector(container, bundleData) {
      const qtyInput = container.querySelector('.shopibundle-qty-input');
      const minusBtn = container.querySelector('.shopibundle-qty-minus');
      const plusBtn = container.querySelector('.shopibundle-qty-plus');

      if (!qtyInput) return;

      const maxQty = parseInt(qtyInput.max) || 99;
      const minQty = parseInt(qtyInput.min) || 1;

      const updateQuantity = (newQty) => {
        const qty = Math.max(minQty, Math.min(maxQty, newQty));
        qtyInput.value = qty;
        bundleData.quantity = qty;

        // Update all item quantities in form
        container.querySelectorAll('.shopibundle-item-qty').forEach(input => {
          input.value = qty;
        });

        // Update button states
        if (minusBtn) minusBtn.disabled = qty <= minQty;
        if (plusBtn) plusBtn.disabled = qty >= maxQty;

        // Update displayed total
        this.updatePriceDisplay(container, bundleData);
      };

      if (minusBtn) {
        minusBtn.addEventListener('click', () => {
          updateQuantity(bundleData.quantity - 1);
        });
      }

      if (plusBtn) {
        plusBtn.addEventListener('click', () => {
          updateQuantity(bundleData.quantity + 1);
        });
      }

      qtyInput.addEventListener('change', (e) => {
        updateQuantity(parseInt(e.target.value) || 1);
      });

      // Initialize button states
      updateQuantity(1);
    },

    /**
     * Setup variant selectors for products with multiple variants
     */
    setupVariantSelectors(container, bundleData) {
      container.querySelectorAll('.shopibundle-variant-select').forEach(select => {
        const productId = select.dataset.productId;

        select.addEventListener('change', (e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          const variantId = selectedOption.value;
          const variantPrice = parseFloat(selectedOption.dataset.price) || 0;

          // Store selection
          bundleData.variantSelections.set(productId, {
            variantId,
            price: variantPrice,
          });

          // Update hidden input
          const variantInput = container.querySelector(`[data-variant-input="${productId}"]`);
          if (variantInput) {
            variantInput.value = variantId;
          }

          // Recalculate price
          this.updatePriceDisplay(container, bundleData);

          // Track variant change
          this.trackEvent('variant_selected', {
            bundleId: bundleData.id,
            productId,
            variantId,
          });
        });
      });
    },

    /**
     * Update the price display based on selections
     */
    updatePriceDisplay(container, bundleData) {
      // Get base prices from container data or recalculate
      const originalPriceEl = container.querySelector('.shopibundle-original-price');
      const finalPriceEl = container.querySelector('.shopibundle-final-price');
      const discountEl = container.querySelector('.shopibundle-discount-amount');
      const btnPriceEl = container.querySelector('.shopibundle-btn-price');

      // For now, multiply displayed prices by quantity
      // Full recalculation would require product prices from data attributes
      const qty = bundleData.quantity;

      if (originalPriceEl && finalPriceEl) {
        // Extract base prices from displayed values (simple approach)
        const baseOriginal = this.parsePrice(originalPriceEl.textContent) / (bundleData.prevQty || 1);
        const baseFinal = this.parsePrice(finalPriceEl.textContent) / (bundleData.prevQty || 1);

        originalPriceEl.textContent = this.formatPrice(baseOriginal * qty);
        finalPriceEl.textContent = this.formatPrice(baseFinal * qty);

        if (discountEl) {
          const baseDiscount = baseOriginal - baseFinal;
          discountEl.textContent = '-' + this.formatPrice(baseDiscount * qty);
        }

        if (btnPriceEl) {
          btnPriceEl.textContent = this.formatPrice(baseFinal * qty);
        }

        bundleData.prevQty = qty;
      }
    },

    /**
     * Setup add to cart form submission
     */
    setupAddToCartForm(container, bundleData) {
      const form = container.querySelector('.shopibundle-form');
      if (!form) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (bundleData.isOutOfStock) {
          this.showNotification('This bundle is currently out of stock', 'error');
          return;
        }

        const button = form.querySelector('.shopibundle-add-to-cart');
        await this.addBundleToCart(form, button, bundleData);
      });
    },

    /**
     * Add bundle to cart using Shopify Cart API
     */
    async addBundleToCart(form, button, bundleData) {
      const originalContent = button.innerHTML;

      try {
        // Set loading state
        button.disabled = true;
        button.classList.add('shopibundle-loading');
        button.innerHTML = `
          <span class="shopibundle-spinner"></span>
          <span>Adding to cart...</span>
        `;

        // Collect items from form
        const items = this.collectFormItems(form);

        // Make API request
        const response = await fetch(CONFIG.cartAddUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ items }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.description || 'Failed to add to cart');
        }

        const result = await response.json();

        // Success state
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Added to cart!</span>
        `;
        button.classList.remove('shopibundle-loading');
        button.classList.add('shopibundle-success');

        // Track success
        this.trackEvent('bundle_added_to_cart', {
          bundleId: bundleData.id,
          quantity: bundleData.quantity,
          itemCount: items.length,
        });

        // Trigger cart update events
        this.triggerCartUpdate();

        // Show notification
        this.showNotification('Bundle added to cart!', 'success');

        // Reset button after delay
        setTimeout(() => {
          button.innerHTML = originalContent;
          button.classList.remove('shopibundle-success');
          button.disabled = false;
        }, 2000);

        // Open cart drawer or redirect based on theme
        setTimeout(() => {
          this.handlePostAddAction();
        }, 500);

      } catch (error) {
        console.error('Bundle add to cart error:', error);

        // Error state
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <span>Error - Try again</span>
        `;
        button.classList.remove('shopibundle-loading');
        button.classList.add('shopibundle-error');

        // Track error
        this.trackEvent('bundle_add_error', {
          bundleId: bundleData.id,
          error: error.message,
        });

        // Show error notification
        this.showNotification(error.message || 'Failed to add bundle to cart', 'error');

        // Reset button
        setTimeout(() => {
          button.innerHTML = originalContent;
          button.classList.remove('shopibundle-error');
          button.disabled = false;
        }, 3000);
      }
    },

    /**
     * Collect form items into Cart API format
     */
    collectFormItems(form) {
      const formData = new FormData(form);
      const items = [];
      let itemIndex = 0;

      while (formData.has(`items[${itemIndex}][id]`)) {
        const item = {
          id: parseInt(formData.get(`items[${itemIndex}][id]`)),
          quantity: parseInt(formData.get(`items[${itemIndex}][quantity]`)) || 1,
          properties: {},
        };

        // Collect properties
        for (const [key, value] of formData.entries()) {
          if (key.startsWith(`items[${itemIndex}][properties]`)) {
            const propMatch = key.match(/\[properties\]\[([^\]]+)\]/);
            if (propMatch) {
              item.properties[propMatch[1]] = value;
            }
          }
        }

        items.push(item);
        itemIndex++;
      }

      return items;
    },

    /**
     * Handle post-add action (open cart drawer or redirect)
     */
    handlePostAddAction() {
      // Try to trigger theme's cart drawer
      const drawerTriggers = [
        () => document.dispatchEvent(new CustomEvent('cart:open')),
        () => document.dispatchEvent(new CustomEvent('shopify:cart:update')),
        () => document.querySelector('[data-cart-toggle]')?.click(),
        () => document.querySelector('.js-cart-drawer-trigger')?.click(),
      ];

      // Try each trigger
      for (const trigger of drawerTriggers) {
        try {
          trigger();
          // If we dispatched an event, give it a moment to handle
          return;
        } catch (e) {
          continue;
        }
      }

      // Fallback: redirect to cart page
      // Uncomment if you want redirect behavior:
      // window.location.href = '/cart';
    },

    /**
     * Trigger cart update events for theme integration
     */
    triggerCartUpdate() {
      // Common cart update events used by various themes
      document.dispatchEvent(new CustomEvent('cart:updated'));
      document.dispatchEvent(new CustomEvent('cart:change'));
      document.dispatchEvent(new CustomEvent('theme:cart:change'));

      // Update cart count in header if element exists
      this.updateCartCount();
    },

    /**
     * Update cart count in header
     */
    async updateCartCount() {
      try {
        const response = await fetch(CONFIG.cartGetUrl);
        const cart = await response.json();

        // Common cart count selectors
        const countSelectors = [
          '.cart-count',
          '.cart-count-bubble',
          '[data-cart-count]',
          '.js-cart-count',
          '#CartCount',
        ];

        countSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            el.textContent = cart.item_count;
            el.style.display = cart.item_count > 0 ? '' : 'none';
          });
        });
      } catch (e) {
        console.log('Could not update cart count');
      }
    },

    /**
     * Setup cart page observer to mark bundle items
     */
    setupCartObserver() {
      if (!this.isCartPage()) return;

      // Mark bundle items immediately
      this.markBundleItemsInCart();

      // Re-mark on cart updates
      document.addEventListener('cart:updated', () => {
        setTimeout(() => this.markBundleItemsInCart(), 500);
      });

      // Observe DOM changes for dynamic carts
      const cartContainer = document.querySelector('[data-cart-container], .cart, #cart');
      if (cartContainer) {
        const observer = new MutationObserver(() => {
          this.markBundleItemsInCart();
        });
        observer.observe(cartContainer, { childList: true, subtree: true });
      }
    },

    /**
     * Mark bundle items in cart with visual indicator
     */
    markBundleItemsInCart() {
      // Find cart items with bundle properties
      document.querySelectorAll('.cart-item, [data-cart-item], tr[data-line-item]').forEach(item => {
        // Check if already marked
        if (item.querySelector('.shopibundle-cart-badge')) return;

        // Look for bundle property in various places
        const bundleId = this.findBundleProperty(item);

        if (bundleId) {
          // Add visual indicator
          const badge = document.createElement('div');
          badge.className = 'shopibundle-cart-badge';
          badge.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 12v10H4V12"></path>
              <path d="M2 7h20v5H2z"></path>
              <path d="M12 22V7"></path>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
            <span>Bundle Item</span>
          `;

          // Insert badge
          const titleEl = item.querySelector('.cart-item__name, .cart-item-title, h3, h4, .product-title');
          if (titleEl) {
            titleEl.after(badge);
          } else {
            item.prepend(badge);
          }

          // Add class for styling
          item.classList.add('shopibundle-cart-item');
        }
      });
    },

    /**
     * Find bundle property in cart item
     */
    findBundleProperty(item) {
      // Check hidden inputs
      const input = item.querySelector('input[name*="_bundle_id"]');
      if (input?.value) return input.value;

      // Check data attributes
      if (item.dataset.bundleId) return item.dataset.bundleId;

      // Check text content for property display
      const text = item.textContent || '';
      const match = text.match(/_bundle_id[:\s]+([^\s,]+)/i);
      if (match) return match[1];

      return null;
    },

    /**
     * Show notification toast
     */
    showNotification(message, type = 'info') {
      // Remove existing notification
      document.querySelectorAll('.shopibundle-notification').forEach(n => n.remove());

      const notification = document.createElement('div');
      notification.className = `shopibundle-notification shopibundle-notification-${type}`;
      notification.innerHTML = `
        <span>${message}</span>
        <button class="shopibundle-notification-close" aria-label="Close">&times;</button>
      `;

      document.body.appendChild(notification);

      // Auto dismiss
      setTimeout(() => {
        notification.classList.add('shopibundle-notification-hiding');
        setTimeout(() => notification.remove(), 300);
      }, 4000);

      // Close button
      notification.querySelector('.shopibundle-notification-close').addEventListener('click', () => {
        notification.remove();
      });
    },

    /**
     * Track analytics event
     */
    trackEvent(eventName, data = {}) {
      if (!CONFIG.eventTrackingEnabled) return;

      try {
        // Get shop domain
        const shop = window.Shopify?.shop || '';

        // Send to our tracking endpoint
        fetch('/apps/proxy/track-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: eventName,
            shop,
            timestamp: new Date().toISOString(),
            ...data,
          }),
        }).catch(() => {}); // Ignore tracking errors

        // Also trigger for other analytics tools
        if (window.dataLayer) {
          window.dataLayer.push({
            event: `shopibundle_${eventName}`,
            ...data,
          });
        }
      } catch (e) {
        // Ignore tracking errors
      }
    },

    /**
     * Utility: Parse price string to number
     */
    parsePrice(priceStr) {
      if (!priceStr) return 0;
      return parseFloat(priceStr.replace(/[^0-9.-]/g, '')) || 0;
    },

    /**
     * Utility: Format number as price
     */
    formatPrice(amount) {
      // Use Shopify's money format if available
      if (window.Shopify?.formatMoney) {
        return window.Shopify.formatMoney(amount * 100);
      }

      // Fallback to simple format
      return '$' + amount.toFixed(2);
    },

    /**
     * Utility: Check if on product page
     */
    isProductPage() {
      return document.body.classList.contains('template-product') ||
             window.location.pathname.includes('/products/');
    },

    /**
     * Utility: Check if on cart page
     */
    isCartPage() {
      return document.body.classList.contains('template-cart') ||
             window.location.pathname.includes('/cart');
    },
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BundleManager.init());
  } else {
    BundleManager.init();
  }

  // Export for external use
  window.ShopiBundleManager = BundleManager;
})();

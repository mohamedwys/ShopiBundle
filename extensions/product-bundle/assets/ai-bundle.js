(function() {
  const SHOP_DOMAIN = window.Shopify.shop;
  const SESSION_ID = getOrCreateSessionId();

  function getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('ai_bundle_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      sessionStorage.setItem('ai_bundle_session_id', sessionId);
    }
    return sessionId;
  }

  function trackEvent(bundleId, productId, eventType, metadata = {}) {
    fetch('/apps/proxy/ai/events/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop: SHOP_DOMAIN,
        bundleId,
        productId,
        eventType,
        sessionId: SESSION_ID,
        metadata,
      }),
    }).catch(console.error);
  }

  function getABVariant(productId, callback) {
    fetch('/apps/proxy/ai/ab/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop: SHOP_DOMAIN,
        sessionId: SESSION_ID,
        productId,
      }),
    })
      .then(res => res.json())
      .then(data => callback(data.variantGroupId))
      .catch(console.error);
  }

  function loadAIBundles(productId) {
    fetch(`/apps/proxy/ai-bundles-for-product?shop=${SHOP_DOMAIN}&productId=${productId}&sessionId=${SESSION_ID}`)
      .then(res => res.json())
      .then(data => {
        if (data.enabled && data.bundles && data.bundles.length > 0) {
          renderAIBundles(data.bundles);
        }
      })
      .catch(console.error);
  }

  function renderAIBundles(bundles) {
    const container = document.querySelector('.ai-bundle-container');
    if (!container) return;

    bundles.forEach(bundle => {
      const bundleEl = createBundleElement(bundle);
      container.appendChild(bundleEl);

      trackEvent(bundle.id, bundle.productId, 'impression', {
        variantGroupId: bundle.variantGroupId,
      });
    });
  }

  function createBundleElement(bundle) {
    const div = document.createElement('div');
    div.className = 'ai-bundle-item';
    div.dataset.bundleId = bundle.id;
    div.dataset.productId = bundle.productId;
    div.dataset.variantGroupId = bundle.variantGroupId;

    div.innerHTML = `
      <div class="ai-bundle-header">
        <h3>Frequently Bought Together</h3>
        <span class="ai-badge">AI Recommended (${(bundle.confidenceScore * 100).toFixed(0)}%)</span>
      </div>
      <div class="ai-bundle-products" id="ai-bundle-${bundle.id}">
        Loading products...
      </div>
      <button class="ai-bundle-add-btn" data-bundle-id="${bundle.id}">
        Add Bundle to Cart
      </button>
    `;

    loadBundleProducts(bundle, div);

    const btn = div.querySelector('.ai-bundle-add-btn');
    btn.addEventListener('click', () => handleAddToCart(bundle));

    div.addEventListener('click', (e) => {
      if (e.target.classList.contains('ai-bundle-add-btn')) return;
      trackEvent(bundle.id, bundle.productId, 'click', {
        variantGroupId: bundle.variantGroupId,
      });
    });

    return div;
  }

  function loadBundleProducts(bundle, containerEl) {
    const productsContainer = containerEl.querySelector(`#ai-bundle-${bundle.id}`);

    fetch(`/apps/proxy/bundles-for-product?shop=${SHOP_DOMAIN}&productId=${bundle.productId}`)
      .then(res => res.json())
      .then(data => {
        if (data.bundles && data.bundles.length > 0) {
          const matchingBundle = data.bundles.find(b =>
            b.products && b.products.some(p =>
              bundle.bundledProductIds.includes(p.id.replace('gid://shopify/Product/', ''))
            )
          );

          if (matchingBundle) {
            productsContainer.innerHTML = matchingBundle.products.map(product => `
              <div class="ai-bundle-product">
                <img src="${product.featuredImage?.url || ''}" alt="${product.title}" />
                <span>${product.title}</span>
              </div>
            `).join('');
          }
        }
      })
      .catch(console.error);
  }

  async function handleAddToCart(bundle) {
    trackEvent(bundle.id, bundle.productId, 'add_to_cart', {
      variantGroupId: bundle.variantGroupId,
    });

    if (bundle.bundleMetaobjectId) {
      try {
        const allProductIds = [bundle.productId, ...bundle.bundledProductIds];

        // Fetch all products in parallel and wait for all to complete
        const productPromises = allProductIds.map(productId =>
          fetch(`/products/${productId}.js`).then(res => res.json())
        );

        const products = await Promise.all(productPromises);

        // Build cart items array with bundle properties
        const items = products.map(product => ({
          id: product.variants[0].id,
          quantity: 1,
          properties: {
            '_bundle_id': bundle.id,
            '_variant_group_id': bundle.variantGroupId || ''
          }
        }));

        // Use Cart API for better reliability
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        });

        if (response.ok) {
          // Redirect to cart or trigger cart drawer
          if (window.Shopify?.theme?.cartDrawer) {
            document.dispatchEvent(new CustomEvent('cart:open'));
          } else {
            window.location.href = '/cart';
          }
        } else {
          console.error('Failed to add bundle to cart');
        }
      } catch (error) {
        console.error('Error adding bundle to cart:', error);
      }
    }
  }

  function init() {
    if (window.location.pathname.includes('/products/')) {
      const productId = window.ShopifyAnalytics?.meta?.product?.id ||
                       document.querySelector('[data-product-id]')?.dataset.productId;

      if (productId) {
        loadAIBundles(productId);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.aiBundleTracking = {
    trackPurchase: function(bundleId, productId, variantGroupId) {
      trackEvent(bundleId, productId, 'purchase', { variantGroupId });
    }
  };
})();

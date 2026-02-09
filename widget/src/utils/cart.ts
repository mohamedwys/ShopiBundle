/**
 * Cart API Utilities
 *
 * Shopify Cart AJAX API integration for adding bundle items.
 * Works with both cart drawer and full-page checkout flows.
 */

import type { CartAddPayload, CartResponse } from '../types';

/**
 * Add items to cart via Shopify AJAX Cart API
 */
export async function addToCart(payload: CartAddPayload): Promise<CartResponse> {
  const response = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: payload.items }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = 'Failed to add to cart';
    try {
      const errorJson = JSON.parse(errorText);
      message = errorJson.description || errorJson.message || message;
    } catch {
      // Use default message
    }
    throw new Error(message);
  }

  return response.json();
}

/**
 * Get current cart state
 */
export async function getCart(): Promise<CartResponse> {
  const response = await fetch('/cart.js', {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch cart');
  return response.json();
}

/**
 * Dispatch cart update event for theme integration
 */
export function dispatchCartUpdate(): void {
  document.dispatchEvent(new CustomEvent('cart:updated'));
  // Also fire the section rendering event for Dawn and similar themes
  document.dispatchEvent(
    new CustomEvent('cart:refresh', { bubbles: true })
  );
}

/**
 * Handle post-add-to-cart behavior
 */
export function handlePostAddToCart(
  behavior: 'redirect' | 'drawer' | 'stay'
): void {
  dispatchCartUpdate();

  switch (behavior) {
    case 'redirect':
      window.location.href = '/cart';
      break;
    case 'drawer':
      // Try multiple common cart drawer triggers
      document.dispatchEvent(new CustomEvent('cart:open'));
      document.dispatchEvent(new CustomEvent('theme:cart:open'));
      // Fallback: click the cart icon if drawer doesn't open
      const cartLink = document.querySelector<HTMLElement>(
        'a[href="/cart"], .cart-icon-bubble, .site-header__cart, [data-cart-toggle]'
      );
      if (cartLink) cartLink.click();
      break;
    case 'stay':
      // Do nothing, stay on page
      break;
  }
}

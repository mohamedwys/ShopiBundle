/**
 * Formatting Utilities
 *
 * Currency formatting, savings text, and number display helpers.
 * Uses Shopify's money_format pattern for consistency with the theme.
 */

/**
 * Format a price using Shopify's money format string.
 * Shopify formats: {{ amount }}, {{ amount_no_decimals }},
 * {{ amount_with_comma_separator }}, {{ amount_no_decimals_with_comma_separator }}
 */
export function formatMoney(
  cents: number,
  moneyFormat: string = '${{amount}}'
): string {
  const amount = cents / 100;

  const formatMap: Record<string, string> = {
    amount: amount.toFixed(2),
    amount_no_decimals: Math.round(amount).toString(),
    amount_with_comma_separator: amount
      .toFixed(2)
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
    amount_no_decimals_with_comma_separator: Math.round(amount)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
    amount_with_apostrophe_separator: amount
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1'"),
    amount_no_decimals_with_space_separator: Math.round(amount)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '),
    amount_with_space_separator: amount
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '),
  };

  let result = moneyFormat;
  for (const [key, value] of Object.entries(formatMap)) {
    result = result.replace(`{{${key}}}`, value);
    result = result.replace(`{{ ${key} }}`, value);
  }

  return result;
}

/**
 * Format a price from dollars (not cents)
 */
export function formatPrice(
  amount: number,
  moneyFormat: string = '${{amount}}'
): string {
  return formatMoney(Math.round(amount * 100), moneyFormat);
}

/**
 * Generate savings text
 */
export function formatSavingsText(
  originalPrice: number,
  discountedPrice: number,
  moneyFormat: string
): string {
  const savings = originalPrice - discountedPrice;
  if (savings <= 0) return '';
  return `Save ${formatPrice(savings, moneyFormat)}`;
}

/**
 * Format savings percentage
 */
export function formatSavingsPercent(percent: number): string {
  if (percent <= 0) return '';
  return `${Math.round(percent)}% OFF`;
}

/**
 * Format per-unit price text
 */
export function formatPerUnitText(
  perUnitPrice: number,
  moneyFormat: string
): string {
  return `${formatPrice(perUnitPrice, moneyFormat)} each`;
}

/**
 * Get device type from viewport width
 */
export function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Generate a session ID for analytics
 */
export function getSessionId(): string {
  if (typeof sessionStorage === 'undefined') {
    return 'ssr_' + Math.random().toString(36).substring(2, 11);
  }
  const key = 'shopi_bundle_session';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = 'sb_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    sessionStorage.setItem(key, id);
  }
  return id;
}

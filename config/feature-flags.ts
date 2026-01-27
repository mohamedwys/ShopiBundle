/**
 * Feature Flags Configuration
 *
 * Controls feature rollout across sprints.
 * All new features should be behind flags for gradual activation.
 */

export interface FeatureFlags {
  // Sprint 1-2: Foundation
  V2_BUNDLE_ENGINE: boolean;
  V2_PRICING_ENGINE: boolean;
  V2_API_ROUTES: boolean;

  // Sprint 3-4: Core Bundle Types
  INVENTORY_SYNC: boolean;
  BOGO_BUNDLES: boolean;
  TIERED_PRICING: boolean;
  WEBHOOK_INVENTORY: boolean;

  // Sprint 5-6: Mix & Match
  MIX_MATCH_BUNDLES: boolean;
  BUILD_YOUR_OWN: boolean;
  COMPONENT_GROUPS: boolean;
  THEME_EXTENSION_V2: boolean;

  // Sprint 7-8: Advanced
  SUBSCRIPTION_BUNDLES: boolean;
  GIFT_BUNDLES: boolean;
  DISCOUNT_STACKING_CONFIG: boolean;
  CHECKOUT_UI_EXTENSION: boolean;

  // Sprint 9-10: Polish
  MULTI_CURRENCY: boolean;
  ADVANCED_ANALYTICS: boolean;
  AI_RECOMMENDATIONS_V2: boolean;
}

/**
 * Default feature flag values
 * All new features start as disabled
 */
const DEFAULT_FLAGS: FeatureFlags = {
  // Sprint 1-2: Foundation
  V2_BUNDLE_ENGINE: false,
  V2_PRICING_ENGINE: false,
  V2_API_ROUTES: false,

  // Sprint 3-4: Core Bundle Types
  INVENTORY_SYNC: false,
  BOGO_BUNDLES: false,
  TIERED_PRICING: false,
  WEBHOOK_INVENTORY: false,

  // Sprint 5-6: Mix & Match
  MIX_MATCH_BUNDLES: false,
  BUILD_YOUR_OWN: false,
  COMPONENT_GROUPS: false,
  THEME_EXTENSION_V2: false,

  // Sprint 7-8: Advanced
  SUBSCRIPTION_BUNDLES: false,
  GIFT_BUNDLES: false,
  DISCOUNT_STACKING_CONFIG: false,
  CHECKOUT_UI_EXTENSION: false,

  // Sprint 9-10: Polish
  MULTI_CURRENCY: false,
  ADVANCED_ANALYTICS: false,
  AI_RECOMMENDATIONS_V2: false,
};

/**
 * Environment-based overrides
 * Set FEATURE_FLAG_<NAME>=true in environment to enable
 */
function getEnvOverrides(): Partial<FeatureFlags> {
  const overrides: Partial<FeatureFlags> = {};

  for (const key of Object.keys(DEFAULT_FLAGS) as Array<keyof FeatureFlags>) {
    const envKey = `FEATURE_FLAG_${key}`;
    const envValue = process.env[envKey];

    if (envValue !== undefined) {
      overrides[key] = envValue === 'true' || envValue === '1';
    }
  }

  return overrides;
}

/**
 * Get all feature flags with environment overrides applied
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    ...DEFAULT_FLAGS,
    ...getEnvOverrides(),
  };
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[flag] ?? false;
}

/**
 * Check if multiple features are enabled (all must be enabled)
 */
export function areFeaturesEnabled(...flags: Array<keyof FeatureFlags>): boolean {
  const allFlags = getFeatureFlags();
  return flags.every((flag) => allFlags[flag] ?? false);
}

/**
 * Check if any of the features are enabled
 */
export function isAnyFeatureEnabled(...flags: Array<keyof FeatureFlags>): boolean {
  const allFlags = getFeatureFlags();
  return flags.some((flag) => allFlags[flag] ?? false);
}

/**
 * Feature flag guard for API routes
 * Returns 404 if feature is not enabled
 */
export function requireFeature(flag: keyof FeatureFlags): void {
  if (!isFeatureEnabled(flag)) {
    const error = new Error(`Feature ${flag} is not enabled`) as Error & { statusCode: number };
    error.statusCode = 404;
    throw error;
  }
}

/**
 * Higher-order function to wrap handlers with feature flag check
 */
export function withFeatureFlag<T extends (...args: any[]) => any>(
  flag: keyof FeatureFlags,
  handler: T,
  fallback?: T
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (isFeatureEnabled(flag)) {
      return handler(...args);
    }
    if (fallback) {
      return fallback(...args);
    }
    throw new Error(`Feature ${flag} is not enabled`);
  }) as T;
}

/**
 * Get features enabled for a specific sprint
 */
export function getSprintFeatures(sprint: number): Array<keyof FeatureFlags> {
  const sprintMap: Record<number, Array<keyof FeatureFlags>> = {
    1: ['V2_BUNDLE_ENGINE', 'V2_PRICING_ENGINE', 'V2_API_ROUTES'],
    2: ['V2_BUNDLE_ENGINE', 'V2_PRICING_ENGINE', 'V2_API_ROUTES'],
    3: ['INVENTORY_SYNC', 'BOGO_BUNDLES', 'WEBHOOK_INVENTORY'],
    4: ['TIERED_PRICING'],
    5: ['MIX_MATCH_BUNDLES', 'COMPONENT_GROUPS'],
    6: ['BUILD_YOUR_OWN', 'THEME_EXTENSION_V2'],
    7: ['SUBSCRIPTION_BUNDLES', 'CHECKOUT_UI_EXTENSION'],
    8: ['GIFT_BUNDLES', 'DISCOUNT_STACKING_CONFIG'],
    9: ['MULTI_CURRENCY'],
    10: ['ADVANCED_ANALYTICS', 'AI_RECOMMENDATIONS_V2'],
  };

  return sprintMap[sprint] || [];
}

/**
 * Debug: Log all feature flag states
 */
export function logFeatureFlags(): void {
  const flags = getFeatureFlags();
  console.log('Feature Flags:');
  for (const [key, value] of Object.entries(flags)) {
    const status = value ? '✅' : '❌';
    console.log(`  ${status} ${key}: ${value}`);
  }
}

// Export singleton flags for convenience
export const featureFlags = getFeatureFlags();

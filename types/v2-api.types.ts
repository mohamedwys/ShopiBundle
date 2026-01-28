/**
 * V2 Bundle API Types
 *
 * TypeScript types for the V2 bundle API endpoints
 */

// Bundle Status
export type BundleStatus = 'DRAFT' | 'ACTIVE' | 'SCHEDULED' | 'PAUSED' | 'ARCHIVED';

// Bundle Type
export type BundleType = 'FIXED' | 'MIX_MATCH' | 'TIERED' | 'BOGO' | 'BUILD_YOUR_OWN' | 'SUBSCRIPTION' | 'GIFT';

// Component in a bundle
export interface BundleComponent {
  id: string;
  shopifyProductId: string;
  shopifyVariantId: string | null;
  quantity: number;
  displayOrder: number;
  cachedTitle: string | null;
  cachedPrice: number | null;
  cachedImageUrl: string | null;
}

// Full bundle with pricing
export interface Bundle {
  id: string;
  shop: string;
  name: string;
  title: string;
  description: string | null;
  slug: string;
  type: BundleType;
  status: BundleStatus;
  shopifyProductId: string | null;
  shopifyMetaobjectId: string | null;
  featuredImage: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  components: BundleComponent[];
  // Computed pricing
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  savingsPercentage: number;
}

// Pagination info
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// List bundles response
export interface ListBundlesResponse {
  success: boolean;
  data: {
    bundles: Bundle[];
    pagination: PaginationInfo;
  };
}

// Single bundle response
export interface GetBundleResponse {
  success: boolean;
  data: Bundle;
}

// Create bundle input
export interface CreateBundleInput {
  name: string;
  title: string;
  description?: string;
  components: Array<{
    shopifyProductId: string;
    shopifyVariantId?: string;
    quantity?: number;
  }>;
  discountPercent: number;
  tags?: string[];
  featuredImage?: string;
}

// Update bundle input
export interface UpdateBundleInput {
  name?: string;
  title?: string;
  description?: string;
  discountPercent?: number;
  tags?: string[];
  featuredImage?: string;
  status?: BundleStatus;
}

// Bundle stats response
export interface BundleStatsResponse {
  success: boolean;
  data: {
    DRAFT: number;
    ACTIVE: number;
    SCHEDULED: number;
    PAUSED: number;
    ARCHIVED: number;
    total: number;
  };
}

// Error response
export interface APIError {
  success: false;
  error: string;
}

// Component input for adding
export interface AddComponentInput {
  shopifyProductId: string;
  shopifyVariantId?: string;
  quantity?: number;
}

// Component quantity update
export interface UpdateComponentQuantity {
  componentId: string;
  quantity: number;
}

// List bundles params
export interface ListBundlesParams {
  page?: number;
  limit?: number;
  status?: BundleStatus;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

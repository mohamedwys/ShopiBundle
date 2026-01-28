/**
 * V2 Bundle API Hook
 *
 * Provides typed methods for interacting with the V2 bundle API
 */

import { useState, useCallback } from 'react';
import useFetch from './useFetch';
import {
  Bundle,
  ListBundlesResponse,
  GetBundleResponse,
  BundleStatsResponse,
  CreateBundleInput,
  UpdateBundleInput,
  ListBundlesParams,
  AddComponentInput,
  UpdateComponentQuantity,
  APIError,
} from '@/types/v2-api.types';

// API Response type union
type APIResponse<T> = T | APIError;

export interface UseBundleAPIReturn {
  // State
  loading: boolean;
  error: string | null;

  // Bundle CRUD operations
  listBundles: (params?: ListBundlesParams) => Promise<ListBundlesResponse | null>;
  getBundle: (id: string) => Promise<Bundle | null>;
  createBundle: (input: CreateBundleInput) => Promise<Bundle | null>;
  updateBundle: (id: string, input: UpdateBundleInput) => Promise<Bundle | null>;
  deleteBundle: (id: string) => Promise<boolean>;

  // Publish/Unpublish
  publishBundle: (id: string) => Promise<Bundle | null>;
  unpublishBundle: (id: string) => Promise<Bundle | null>;

  // Component management
  addComponents: (bundleId: string, components: AddComponentInput[]) => Promise<Bundle | null>;
  updateComponentQuantities: (bundleId: string, updates: UpdateComponentQuantity[]) => Promise<Bundle | null>;
  removeComponent: (bundleId: string, componentId: string) => Promise<Bundle | null>;

  // Stats
  getBundleStats: () => Promise<BundleStatsResponse['data'] | null>;

  // Utility
  clearError: () => void;
}

export function useBundleAPI(): UseBundleAPIReturn {
  const fetch = useFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Make an API request with error handling
   */
  const apiRequest = useCallback(async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, options);

      if (!response) {
        setError('Failed to make request - please try again');
        return null;
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || `Request failed with status ${response.status}`;
        setError(errorMessage);
        return null;
      }

      if (data.success === false) {
        setError(data.error || 'Request failed');
        return null;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetch]);

  /**
   * List bundles with pagination and filtering
   */
  const listBundles = useCallback(async (params?: ListBundlesParams): Promise<ListBundlesResponse | null> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.set('page', String(params.page));
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.status) queryParams.set('status', params.status);
    if (params?.search) queryParams.set('search', params.search);
    if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder);

    const query = queryParams.toString();
    const endpoint = `/api/v2/bundles${query ? `?${query}` : ''}`;

    return apiRequest<ListBundlesResponse>(endpoint);
  }, [apiRequest]);

  /**
   * Get a single bundle by ID
   */
  const getBundle = useCallback(async (id: string): Promise<Bundle | null> => {
    const response = await apiRequest<GetBundleResponse>(`/api/v2/bundles/${id}`);
    return response?.data || null;
  }, [apiRequest]);

  /**
   * Create a new bundle
   */
  const createBundle = useCallback(async (input: CreateBundleInput): Promise<Bundle | null> => {
    const response = await apiRequest<GetBundleResponse>('/api/v2/bundles', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return response?.data || null;
  }, [apiRequest]);

  /**
   * Update an existing bundle
   */
  const updateBundle = useCallback(async (id: string, input: UpdateBundleInput): Promise<Bundle | null> => {
    const response = await apiRequest<GetBundleResponse>(`/api/v2/bundles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
    return response?.data || null;
  }, [apiRequest]);

  /**
   * Delete a bundle
   */
  const deleteBundle = useCallback(async (id: string): Promise<boolean> => {
    const response = await apiRequest<{ success: boolean }>(`/api/v2/bundles/${id}`, {
      method: 'DELETE',
    });
    return response?.success || false;
  }, [apiRequest]);

  /**
   * Publish a bundle (set to ACTIVE)
   */
  const publishBundle = useCallback(async (id: string): Promise<Bundle | null> => {
    const response = await apiRequest<GetBundleResponse>(`/api/v2/bundles/${id}/publish`, {
      method: 'POST',
    });
    return response?.data || null;
  }, [apiRequest]);

  /**
   * Unpublish a bundle (set to PAUSED)
   */
  const unpublishBundle = useCallback(async (id: string): Promise<Bundle | null> => {
    const response = await apiRequest<GetBundleResponse>(`/api/v2/bundles/${id}/publish`, {
      method: 'DELETE',
    });
    return response?.data || null;
  }, [apiRequest]);

  /**
   * Add components to a bundle
   */
  const addComponents = useCallback(async (
    bundleId: string,
    components: AddComponentInput[]
  ): Promise<Bundle | null> => {
    const response = await apiRequest<GetBundleResponse>(`/api/v2/bundles/${bundleId}/components`, {
      method: 'POST',
      body: JSON.stringify({ components }),
    });
    return response?.data || null;
  }, [apiRequest]);

  /**
   * Update component quantities
   */
  const updateComponentQuantities = useCallback(async (
    bundleId: string,
    updates: UpdateComponentQuantity[]
  ): Promise<Bundle | null> => {
    const response = await apiRequest<GetBundleResponse>(`/api/v2/bundles/${bundleId}/components`, {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
    return response?.data || null;
  }, [apiRequest]);

  /**
   * Remove a component from a bundle
   */
  const removeComponent = useCallback(async (
    bundleId: string,
    componentId: string
  ): Promise<Bundle | null> => {
    const response = await apiRequest<GetBundleResponse>(
      `/api/v2/bundles/${bundleId}/components?componentId=${componentId}`,
      { method: 'DELETE' }
    );
    return response?.data || null;
  }, [apiRequest]);

  /**
   * Get bundle statistics by status
   */
  const getBundleStats = useCallback(async (): Promise<BundleStatsResponse['data'] | null> => {
    const response = await apiRequest<BundleStatsResponse>('/api/v2/bundles/stats');
    return response?.data || null;
  }, [apiRequest]);

  return {
    loading,
    error,
    listBundles,
    getBundle,
    createBundle,
    updateBundle,
    deleteBundle,
    publishBundle,
    unpublishBundle,
    addComponents,
    updateComponentQuantities,
    removeComponent,
    getBundleStats,
    clearError,
  };
}

export default useBundleAPI;

import apiClient from './client';
import type { ProductsResponse, ProductDetailResponse } from '../types';
import { getFallbackProducts, getFallbackProductById } from '../data/fallbackData';

interface ProductQueryParams {
  id?: string;
  category?: string;
  q?: string;
}

export const productsApi = {
  // Get list of products with optional filters, fail-safe fallback
  getProducts: async (params?: ProductQueryParams): Promise<ProductsResponse> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category && params.category !== 'All') {
        searchParams.append('category', params.category);
      }
      if (params?.q) {
        searchParams.append('q', params.q);
      }
      const queryString = searchParams.toString();
      const url = `/api/products${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get<ProductsResponse>(url);
      if (response && response.products && response.products.length > 0) {
        return response;
      }
    } catch {
      // Backend unavailable or running as static site - fallback gracefully
    }

    const fallback = getFallbackProducts({ category: params?.category, q: params?.q });
    return {
      count: fallback.length,
      source: 'client-offline-cache',
      products: fallback,
    };
  },

  // Get single product by ID, fail-safe fallback
  getProductById: async (id: string): Promise<ProductDetailResponse> => {
    try {
      const response = await apiClient.get<ProductDetailResponse>(`/api/products?id=${encodeURIComponent(id)}`);
      if (response && response.product) {
        return response;
      }
    } catch {
      // Fallback
    }

    const product = getFallbackProductById(id);
    if (product) {
      return {
        source: 'client-offline-cache',
        product,
      };
    }

    throw new Error(`Product not found: ${id}`);
  },
};

export default productsApi;

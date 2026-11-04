import apiClient from './client';
import type { ProductsResponse, ProductDetailResponse } from '../types';

interface ProductQueryParams {
  id?: string;
  category?: string;
  q?: string;
}

export const productsApi = {
  // Get list of products with optional filters
  getProducts: async (params?: ProductQueryParams): Promise<ProductsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'All') {
      searchParams.append('category', params.category);
    }
    if (params?.q) {
      searchParams.append('q', params.q);
    }
    const queryString = searchParams.toString();
    const url = `/api/products${queryString ? `?${queryString}` : ''}`;
    return apiClient.get<ProductsResponse>(url);
  },

  // Get single product by ID
  getProductById: async (id: string): Promise<ProductDetailResponse> => {
    return apiClient.get<ProductDetailResponse>(`/api/products?id=${encodeURIComponent(id)}`);
  },
};

export default productsApi;
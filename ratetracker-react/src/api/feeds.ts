import apiClient from './client';
import type { MerchantFeedsStatus } from '../types';

export const feedsApi = {
  // Get merchant feeds status
  getStatus: async (): Promise<MerchantFeedsStatus> => {
    return apiClient.get<MerchantFeedsStatus>('/api/feeds');
  },

  // Get approved merchants list
  getMerchants: async (): Promise<MerchantFeedsStatus['merchants']> => {
    const response = await apiClient.get<{ merchants: MerchantFeedsStatus['merchants'] }>('/api/feeds?action=merchants');
    return response.merchants;
  },

  // Get full feed dump (all products)
  getFeedDump: async (): Promise<{ feedSource: string; count: number; items: unknown[] }> => {
    return apiClient.get<{ feedSource: string; count: number; items: unknown[] }>('/api/feeds?action=feed-dump');
  },
};

export default feedsApi;
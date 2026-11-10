import apiClient from './client';
import type { HotelsResponse } from '../types/hotel';
import { getFallbackHotels } from '../data/fallbackData';

export const hotelsApi = {
  getHotels: async (city?: string): Promise<HotelsResponse> => {
    try {
      const url = `/api/hotels${city ? `?city=${encodeURIComponent(city)}` : ''}`;
      const response = await apiClient.get<HotelsResponse>(url);
      if (response && response.hotels && response.hotels.length > 0) {
        return response;
      }
    } catch {
      // Backend unavailable or running as static site - fallback gracefully
    }

    const fallback = getFallbackHotels(city);
    return {
      hotels: fallback,
    };
  },
};

export default hotelsApi;

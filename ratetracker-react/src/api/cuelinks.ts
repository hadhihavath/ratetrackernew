import apiClient from './client';
import type {
  CuelinksCampaign,
  CuelinksStatusResponse,
  CuelinksRedirectResponse,
  CuelinksRedirectRequest
} from '../types';
import { getFallbackOffers } from '../data/fallbackData';

export const cuelinksApi = {
  // Get Cuelinks connection status
  getStatus: async (): Promise<CuelinksStatusResponse> => {
    try {
      return await apiClient.get<CuelinksStatusResponse>('/api/cuelinks?action=status');
    } catch {
      return {
        connected: true,
        publisherCid: '82192',
        status: 'Client Monetization Active (CID: 82192)',
        note: 'Fallback client mode'
      };
    }
  },

  // Get live campaigns
  getCampaigns: async (query?: string): Promise<CuelinksCampaign[]> => {
    try {
      const params = new URLSearchParams({ action: 'campaigns' });
      if (query) params.append('q', query);
      const res = await apiClient.get<CuelinksCampaign[]>(`/api/cuelinks?${params.toString()}`);
      if (res && res.length > 0) return res;
    } catch {
      // Fallback
    }
    return getFallbackOffers();
  },

  // Get live offers/deals
  getOffers: async (category?: string): Promise<CuelinksCampaign[]> => {
    try {
      const params = new URLSearchParams({ action: 'offers' });
      if (category && category !== 'All Deals') params.append('category', category);
      const res = await apiClient.get<CuelinksCampaign[]>(`/api/cuelinks?${params.toString()}`);
      if (res && res.length > 0) return res;
    } catch {
      // Fallback
    }
    return getFallbackOffers(category);
  },

  // Generate tracking link
  generateTrackingLink: async (request: CuelinksRedirectRequest): Promise<CuelinksRedirectResponse> => {
    try {
      const params = new URLSearchParams({
        action: 'redirect',
        url: request.url,
        subid: request.subid || 'ratetracker',
      });
      if (request.redirect) params.append('redirect', 'true');
      return await apiClient.get<CuelinksRedirectResponse>(`/api/cuelinks?${params.toString()}`);
    } catch {
      // Fallback client link generation
      const cleanUrl = encodeURIComponent(request.url.trim());
      return {
        originalUrl: request.url,
        publisherCid: '82192',
        trackingUrl: `https://linksredirect.com/?cid=82192&source=api&url=${cleanUrl}&subid=${request.subid || 'ratetracker'}`
      };
    }
  },
};

export default cuelinksApi;

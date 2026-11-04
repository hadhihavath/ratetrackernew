import apiClient from './client';
import type {
  CuelinksCampaign,
  CuelinksStatusResponse,
  CuelinksRedirectResponse,
  CuelinksRedirectRequest
} from '../types';

export const cuelinksApi = {
  // Get Cuelinks connection status
  getStatus: async (): Promise<CuelinksStatusResponse> => {
    return apiClient.get<CuelinksStatusResponse>('/api/cuelinks?action=status');
  },

  // Get live campaigns
  getCampaigns: async (query?: string): Promise<CuelinksCampaign[]> => {
    const params = new URLSearchParams({ action: 'campaigns' });
    if (query) params.append('q', query);
    return apiClient.get<CuelinksCampaign[]>(`/api/cuelinks?${params.toString()}`);
  },

  // Get live offers/deals
  getOffers: async (): Promise<CuelinksCampaign[]> => {
    return apiClient.get<CuelinksCampaign[]>('/api/cuelinks?action=offers');
  },

  // Generate tracking link
  generateTrackingLink: async (request: CuelinksRedirectRequest): Promise<CuelinksRedirectResponse> => {
    const params = new URLSearchParams({
      action: 'redirect',
      url: request.url,
      subid: request.subid || 'ratetracker',
    });
    if (request.redirect) params.append('redirect', 'true');
    return apiClient.get<CuelinksRedirectResponse>(`/api/cuelinks?${params.toString()}`);
  },
};

export default cuelinksApi;
import apiClient from './client';
import type { HealthResponse } from '../types';

export const healthApi = {
  // Get complete system health
  getHealth: async (): Promise<HealthResponse> => {
    return apiClient.get<HealthResponse>('/api/health');
  },
};

export default healthApi;
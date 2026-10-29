import apiClient from '../../api/client';

export const slaService = {
  async getSlaSummary(params = {}) {
    return await apiClient.get('/sla/summary', { params });
  },

  async getAtRisk(params = {}) {
    return await apiClient.get('/sla/at-risk', { params });
  },

  async getBreached(params = {}) {
    return await apiClient.get('/sla/breached', { params });
  },
};

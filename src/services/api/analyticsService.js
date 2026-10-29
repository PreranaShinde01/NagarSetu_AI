import apiClient from '../../api/client';

export const analyticsService = {
  async getOverview(params = {}) {
    return await apiClient.get('/analytics/overview', { params });
  },

  async getComplaints(params = {}) {
    return await apiClient.get('/analytics/complaints', { params });
  },

  async getDepartments(params = {}) {
    return await apiClient.get('/analytics/departments', { params });
  },

  async getWards(params = {}) {
    return await apiClient.get('/analytics/wards', { params });
  },

  async getPublicMetrics(params = {}) {
    return await apiClient.get('/analytics/public', { params });
  },
};

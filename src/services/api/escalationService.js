import apiClient from '../../api/client';

export const escalationService = {
  async getEscalations(params = {}) {
    return await apiClient.get('/escalations', { params });
  },

  async createEscalation(data) {
    return await apiClient.post('/escalations', data);
  },

  async reassignEscalation(id, data) {
    return await apiClient.post(`/escalations/${id}/reassign`, data);
  },
};

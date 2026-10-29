import apiClient from '../../api/client';

export const workOrderService = {
  async getWorkOrders(params = {}) {
    return await apiClient.get('/work-orders', { params });
  },

  async getWorkOrderById(id) {
    return await apiClient.get(`/work-orders/${id}`);
  },

  async createWorkOrder(data) {
    return await apiClient.post('/work-orders', data);
  },

  async acceptWorkOrder(id) {
    return await apiClient.post(`/work-orders/${id}/accept`);
  },

  async startWorkOrder(id) {
    return await apiClient.post(`/work-orders/${id}/start`);
  },

  async completeWorkOrder(id, evidenceData) {
    return await apiClient.post(`/work-orders/${id}/complete`, evidenceData);
  },

  async verifyWorkOrder(id, decisionData) {
    return await apiClient.post(`/work-orders/${id}/verify`, decisionData);
  },
};

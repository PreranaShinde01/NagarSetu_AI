import apiClient from '../../api/client';

export const complaintService = {
  async getComplaints(params = {}) {
    return await apiClient.get('/complaints', { params });
  },

  async getComplaintById(id) {
    return await apiClient.get(`/complaints/${id}`);
  },

  async createComplaint(data) {
    return await apiClient.post('/complaints', data);
  },

  async updateComplaintStatus(id, data) {
    return await apiClient.patch(`/complaints/${id}`, data);
  },

  async getTimeline(id) {
    return await apiClient.get(`/complaints/${id}/timeline`);
  },

  async getAiRouting(id) {
    return await apiClient.get(`/complaints/${id}/ai-routing`);
  },

  async routeComplaint(id, data) {
    return await apiClient.post(`/complaints/${id}/route`, data);
  },

  async citizenVerify(id, data) {
    return await apiClient.post(`/complaints/${id}/citizen-verify`, data);
  },

  async reopenComplaint(id, reason) {
    return await apiClient.post(`/complaints/${id}/reopen`, { reason });
  },
};

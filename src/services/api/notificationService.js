import apiClient from '../../api/client';

export const notificationService = {
  async getNotifications(params = {}) {
    return await apiClient.get('/notifications', { params });
  },

  async markRead(id) {
    return await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllRead() {
    return await apiClient.patch('/notifications/read-all');
  },
};

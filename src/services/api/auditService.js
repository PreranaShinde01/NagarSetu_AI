import apiClient from '../../api/client';

export const auditService = {
  async getAuditLogs(params = {}) {
    return await apiClient.get('/audit', { params });
  },
};

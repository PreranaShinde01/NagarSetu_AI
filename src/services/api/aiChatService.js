import apiClient from '../../api/client';

export const aiChatService = {
  async sendMessage(message, context = {}) {
    return await apiClient.post('/ai/chat', { message, context });
  },
};

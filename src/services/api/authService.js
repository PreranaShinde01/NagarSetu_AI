import apiClient from '../../api/client';

export const authService = {
  async login(email, password) {
    return await apiClient.post('/auth/login', { email, password });
  },

  async register(userData) {
    return await apiClient.post('/auth/register', userData);
  },

  async getMe() {
    return await apiClient.get('/auth/me');
  },
};

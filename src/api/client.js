/**
 * NAGARSETU API CLIENT ABSTRACTION LAYER
 * 
 * Configured Axios client communicating with the Express REST API backend.
 */

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nagarsetu_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Unwrap API standard format
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK';
    const is503 = error.response?.status === 503;

    const formattedError = {
      isApiUnavailable: isNetworkError || is503,
      statusCode: error.response?.status || 503,
      code: error.response?.data?.error?.code || (isNetworkError ? 'NETWORK_UNAVAILABLE' : 'SERVICE_UNAVAILABLE'),
      message:
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        'Governance API Unavailable: Unable to connect to the NagarSetu REST API backend.',
    };

    return Promise.reject(formattedError);
  }
);

export default apiClient;

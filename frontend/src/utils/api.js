// frontend/src/utils/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // <-- Use accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



// Response interceptor - Handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if it's a 401 error and the request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Only attempt refresh for authenticated routes
      const isAuthenticatedRoute = originalRequest.url?.includes('/user/') ||
                                 originalRequest.url?.includes('/my-') ||
                                 originalRequest.url?.includes('/notifications') ||
                                 originalRequest.url?.includes('/chat/') ||
                                 originalRequest.method === 'post' ||
                                 originalRequest.method === 'put' ||
                                 originalRequest.method === 'delete';
      
      if (isAuthenticatedRoute) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // No refresh token available, logout user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/';
          return Promise.reject(error);
        }

        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, logout user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      } else {
        // For public routes (like /properties), just remove the invalid token and retry
        localStorage.removeItem('accessToken');
        delete api.defaults.headers.common['Authorization'];
        delete originalRequest.headers['Authorization'];
        
        // Retry the request without the token
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

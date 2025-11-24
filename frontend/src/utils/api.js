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
    const token = localStorage.getItem('token');
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
  (error) => {
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401) {
        const errorData = error.response.data;
        
        // If token expired, clear storage and redirect to login
        if (errorData.expired || errorData.message?.includes('expired') || errorData.message?.includes('Token expired')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Dispatch custom event to notify app of logout
          window.dispatchEvent(new CustomEvent('token-expired'));
          
          // Redirect to home page
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const ADMIN_TOKEN_KEY = 'quiz_admin_token';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Get stored Admin JWT Token
 */
export const getAdminToken = (): string | null => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

/**
 * Save Admin JWT Token
 */
export const saveAdminToken = (token: string) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Clear Admin JWT Token
 */
export const clearAdminToken = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  delete api.defaults.headers.common['Authorization'];
};

// Initialize with stored token if present
const initialToken = getAdminToken();
if (initialToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

// Global Axios Request Interceptor: Attach JWT Bearer Token to every request
api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global Axios Response Interceptor: Auto-logout on token expiry (401/403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearAdminToken();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

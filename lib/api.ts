import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * API client configuration and setup
 * Handles HTTP requests with proper error handling and authentication
 */
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true, // This enables HTTP-only cookies for security
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Request interceptor for adding authentication and logging
 * @param config - Axios request configuration
 * @returns Modified request configuration
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // For HTTP-only cookies, we don't need to manually add the token
    // The browser will automatically include the cookie
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling common errors and authentication
 * @param response - Axios response object
 * @returns Response data
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      if (typeof window !== 'undefined') {
        console.log('🔐 Authentication failed, redirecting to login');
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

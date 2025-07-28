// Real API Service for Backend Integration
import axios from 'axios';
import serverUrl, { getServerUrlAsync, HTTPS_URL, HTTP_URL } from './Server';

// Configure axios for HTTP/HTTPS requests with fallback support
const api = axios.create({
  baseURL: serverUrl,
  timeout: 15000, // Increased timeout for better network handling
  headers: {
    'Content-Type': 'application/json',
  },
  // Accept both HTTP and HTTPS
  httpsAgent: false,
});

// Create HTTPS-specific axios instance
const httpsApi = axios.create({
  baseURL: HTTPS_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create HTTP fallback axios instance
const httpApi = axios.create({
  baseURL: HTTP_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
const addInterceptors = (axiosInstance: any, label: string) => {
  axiosInstance.interceptors.request.use(
    (config: any) => {
      console.log(`${label} API Request:`, config.method?.toUpperCase(), config.url);
      return config;
    },
    (error: any) => {
      console.error(`${label} API Request Error:`, error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: any) => {
      console.log(`${label} API Response:`, response.status, response.config.url);
      return response;
    },
    (error: any) => {
      console.error(`${label} API Response Error:`, error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );
};

// Add interceptors to all instances
addInterceptors(api, 'Default');
addInterceptors(httpsApi, 'HTTPS');
addInterceptors(httpApi, 'HTTP');

// Smart API caller with HTTPS/HTTP fallback
const smartApiCall = async (endpoint: string, options: any = {}) => {
  try {
    // Try HTTPS first
    console.log('Attempting HTTPS request...');
    const response = await httpsApi.request({
      url: endpoint,
      ...options,
    });
    return response;
  } catch (httpsError) {
    console.log('HTTPS failed, trying HTTP fallback...');
    try {
      const response = await httpApi.request({
        url: endpoint,
        ...options,
      });
      return response;
    } catch (httpError) {
      console.error('Both HTTPS and HTTP failed:', httpError);
      throw httpError;
    }
  }
};

// User API endpoints with HTTPS/HTTP fallback

export default api;

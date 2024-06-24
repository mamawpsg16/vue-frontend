import axios from 'axios';
import setupInterceptors from './axios-intercepter';

setupInterceptors(); // Initialize the interceptor
axios.defaults.withXSRFToken = true; 
axios.defaults.withCredentials = true; 
axios.defaults.baseURL = "http://localhost:8000"; 

const makeRequest = async (method, url, data = null, config = {}) => {
  try {
    const requestConfig = {
      method,
      url,
      ...config,
    };

    // Only include 'data' for methods that typically support a request body
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase()) && data) {
      requestConfig.data = data;
    }

    const response = await axios(requestConfig);
    return response;
  } catch (error) {
    throw error;
  }
};

const apiClient = {
  get: async (url, config = {}) => {
    return makeRequest('GET', url, null, config);
  },

  post: async (url, data, config = {}) => {
    return makeRequest('POST', url, data, config);
  },

  put: async (url, data, config = {}) => {
    return makeRequest('PUT', url, data, config);
  },

  patch: async (url, data, config = {}) => {
    return makeRequest('PATCH', url, data, config);
  },

  delete: async (url, config = {}) => {
    return makeRequest('DELETE', url, null, config);
  },
};

export default apiClient;

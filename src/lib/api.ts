import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  console.log('token', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Check if the response follows the standard structure
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (response.data.success) {
        return response.data.data;
      } else {
        // If success is false, reject with the message
        return Promise.reject(new Error(response.data.message || 'API Error'));
      }
    }
    // Fallback for non-standard responses
    return response.data;
  },
  (error) => {
    // Handle global errors
    return Promise.reject(error);
  }
);

export default api;

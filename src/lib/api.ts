import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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

  (error: AxiosError) => {
    const data = error?.response?.data as any;
    const status = error?.response?.status;

    if (status === 401 || data?.statusCode === 401 || data?.message === 'Unauthorized') {
      useAuthStore.getState().logout();
      toast.error('Session expired. Please login again.');
    } else if (status === 400) {
      toast.error(data?.message || 'Bad request.');
    } else if (status === 404) {
      toast.error(data?.message || 'Resource not found.');
    } else if (status === 500) {
      toast.error('Internal server error. Please try again.');
    }

    return Promise.reject(error);
  }
);

export default api;

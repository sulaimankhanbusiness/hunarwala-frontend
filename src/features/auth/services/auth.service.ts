import api from '@/lib/api';

export const login = async (credentials: { email: string; password: string }) => {
  return api.post('/auth/login', credentials) as Promise<any>;
};

export const register = async (userData: any) => {
  return api.post('/auth/register', userData) as Promise<any>;
};

export const getMe = async () => {
  return api.get('/auth/me') as Promise<any>;
};

export const forgotPassword = async (email: string) => {
  return api.post('/auth/forgot-password', { email }) as Promise<{ message: string }>;
};

export const resetPassword = async (token: string, newPassword: string) => {
  return api.post('/auth/reset-password', { token, newPassword }) as Promise<{ message: string }>;
};

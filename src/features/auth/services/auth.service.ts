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

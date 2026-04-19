import api from '@/lib/api';
import type { HelperProfile, HelperSearchParams, RegisterHelperDto } from '../types/helpers.types';

export const getHelpers = async (params: HelperSearchParams) => {
  return api.get('/users/search', { params }) as Promise<any>;
};

export const getHelperProfile = async (id: string): Promise<HelperProfile> => {
  return api.get(`/users/profile?userId=${id}`) as Promise<HelperProfile>;
};

export const getTopRatedProfessionals = async (city: string, page = 1, limit = 10) => {
  return api.get(`/users/top-rated?city=${city}&page=${page}&limit=${limit}`) as Promise<any>;
};

export const registerAsHelper = async (dto: RegisterHelperDto) => {
  return api.post('/users/register-helper', dto) as Promise<any>;
};

import api from '@/lib/api';
import type { HelperProfile, HelperSearchParams, MyProfile, RegisterHelperDto } from '../types/helpers.types';

export const getHelpers = async (params: HelperSearchParams) => {
  return api.get('/users/search', { params }) as Promise<any>;
};

export const getHelperProfile = async (id: string): Promise<HelperProfile> => {
  return api.get(`/users/profile?userId=${id}`) as Promise<HelperProfile>;
};

export const getMyProfile = async (): Promise<MyProfile> => {
  return api.get('/users/me') as Promise<MyProfile>;
};

export const updateMyProfile = async (data: FormData): Promise<MyProfile> => {
  return api.patch('/users/helper-profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }) as Promise<MyProfile>;
};

export const getTopRatedProfessionals = async (city: string, page = 1, limit = 10) => {
  return api.get(`/users/top-rated?city=${city}&page=${page}&limit=${limit}`) as Promise<any>;
};

export const registerAsHelper = async (dto: RegisterHelperDto) => {
  const { profilePicture, cnicFront, cnicBack, ...fields } = dto;

  if (profilePicture || cnicFront || cnicBack) {
    const form = new FormData();
    Object.entries(fields).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, String(v));
    });
    if (profilePicture) form.append('profilePicture', profilePicture);
    if (cnicFront)      form.append('cnicFront',      cnicFront);
    if (cnicBack)       form.append('cnicBack',        cnicBack);
    return api.post('/users/register-helper', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }) as Promise<any>;
  }

  return api.post('/users/register-helper', fields) as Promise<any>;
};

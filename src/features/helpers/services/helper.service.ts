'use client';

import api from '@/lib/api';

export interface RegisterHelperDto {
    headline: string;
    bio?: string;
    experienceYears: number;
    ratePerHour: number;
    cityId?: number;
    latitude?: number;
    longitude?: number;
    categoryId: number;
}

export const registerAsHelper = async (dto: RegisterHelperDto) => {
    return api.post('/users/register-helper', dto) as Promise<any>;
};

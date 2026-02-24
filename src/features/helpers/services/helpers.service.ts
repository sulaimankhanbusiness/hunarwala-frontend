import api from '@/lib/api';

export interface Review {
  id: number;
  reviewerName: string;
  reviewerImage: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface HelperProfile {
  id: string;
  userId: string;
  fullName: string;
  profileImage: string | null;
  phoneNumber: string;
  headline: string;
  bio: string;
  experienceYears: number;
  ratePerHour: number;
  availabilityStatus: 'available' | 'busy' | 'unavailable';
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  jobsCompleted: number;
  createdAt: string;
  reviews: Review[];
}

export const getHelpers = async (params: {
  country?: string;
  region?: string;
  city?: string;
  skill?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit?: number;
  page?: number;
}) => {
  const response = await api.get('/users/search', { params }) as any;
  return response; // api interceptor already returns response.data.data
};



export const getHelperProfile = async (id: string): Promise<HelperProfile> => {
  const response = await api.get(`/users/profile?userId=${id}`) as any;
  return response;
};

export const getTopRatedProfessionals = async (city: string, page = 1, limit = 10) => {
  const response = await api.get(`/users/top-rated?city=${city}&page=${page}&limit=${limit}`) as any;
  return response;
};


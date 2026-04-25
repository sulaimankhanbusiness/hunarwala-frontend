export type SortBy = 'rating' | 'price_asc' | 'price_desc' | 'experience';

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
  averageRating?: number;
  createdAt: string;
  reviews: Review[];
}

export interface RegisterHelperDto {
  headline: string;
  bio?: string;
  experienceYears: number;
  ratePerHour: number;
  cityId?: number;
  latitude?: number;
  longitude?: number;
  categoryId: number;
  profilePicture?: File;
  cnicFront?: File;
  cnicBack?: File;
}

export interface HelperSearchParams {
  country?: string;
  region?: string;
  city?: string;
  skill?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  limit?: number;
  page?: number;
}

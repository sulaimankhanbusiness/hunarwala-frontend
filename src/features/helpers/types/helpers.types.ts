export type SortBy = 'rating' | 'price_asc' | 'price_desc' | 'experience';

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  caption: string;
  sortOrder: number;
}

export interface HelperService {
  id: string;
  name: string;
  price: number;
  durationHrs: number;
  iconKey: string;
  description: string;
}

export interface MyProfile {
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
  isVerified: boolean;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  avgRating: number;
  totalReviews: number;
  jobsCompleted: number;
  completionRate: number;
  avgResponseMinutes: number | null;
  languages: string[];
  availabilitySchedule: null | Record<string, { from: string; to: string }>;
  isFeatured: boolean;
  createdAt: string;
  portfolio: PortfolioItem[];
  services: HelperService[];
  reviews: Review[];
}

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
  isVerified: boolean;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  avgRating: number;
  totalReviews: number;
  jobsCompleted: number;
  completionRate: number;
  avgResponseMinutes: number | null;
  languages: string[];
  availabilitySchedule: null | Record<string, { from: string; to: string }>;
  isFeatured: boolean;
  createdAt: string;
  portfolio: PortfolioItem[];
  services: HelperService[];
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

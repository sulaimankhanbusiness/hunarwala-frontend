import api from '@/lib/api';
import { Review } from '../types/booking.types';

const ENGAGEMENT_BASE_URL = '/engagement/reviews';

export const reviewApi = {
    async createReview(payload: { bookingId: string; rating: number; comment?: string }): Promise<Review> {
        return api.post(ENGAGEMENT_BASE_URL, payload);
    },

    async getBookingReview(bookingId: string): Promise<Review | null> {
        try {
            return await api.get(`${ENGAGEMENT_BASE_URL}/booking/${bookingId}`);
        } catch (error: any) {
            if (error.response?.status === 404) return null;
            throw error;
        }
    },

    async getHelperReviews(helperId: string): Promise<Review[]> {
        return api.get(`${ENGAGEMENT_BASE_URL}/helper/${helperId}`);
    }
};

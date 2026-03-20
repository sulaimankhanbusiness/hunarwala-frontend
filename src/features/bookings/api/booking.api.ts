import api from '@/lib/api';
import type { Booking, CreateBookingPayload, CreateBroadcastPayload } from '../types/booking.types';

const BOOKING_BASE_URL = '/bookings';

export const bookingApi = {
    createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
        return api.post(BOOKING_BASE_URL, payload);
    },

    createBroadcastBooking: async (payload: CreateBroadcastPayload): Promise<Booking> => {
        return api.post(`${BOOKING_BASE_URL}/broadcast`, payload);
    },

    getMyBookings: async (type?: string): Promise<Booking[]> => {
        return api.get(`${BOOKING_BASE_URL}/my`, { params: { type } });
    },

    getBookingById: async (id: string): Promise<Booking> => {
        return api.get(`${BOOKING_BASE_URL}/${id}`);
    },

    acceptBooking: async (id: string): Promise<Booking> => {
        return api.patch(`${BOOKING_BASE_URL}/${id}/accept`);
    },

    rejectBooking: async (id: string, reason: string): Promise<Booking> => {
        return api.patch(`${BOOKING_BASE_URL}/${id}/reject`, { reason });
    },

    startBooking: async (id: string, locationData?: { latitude?: number; longitude?: number; proofImageUrl?: string }): Promise<Booking> => {
        return api.patch(`${BOOKING_BASE_URL}/${id}/start`, locationData || {});
    },

    completeBooking: async (id: string, reportedAmount: number, proofImageUrl?: string): Promise<Booking> => {
        return api.patch(`${BOOKING_BASE_URL}/${id}/complete`, { reportedAmount, proofImageUrl });
    },

    settleBooking: async (id: string, agreedAmount?: number): Promise<Booking> => {
        return api.patch(`${BOOKING_BASE_URL}/${id}/settle`, { agreedAmount });
    },

    disputeBooking: async (id: string, reason: string): Promise<Booking> => {
        return api.patch(`${BOOKING_BASE_URL}/${id}/dispute`, { reason });
    },

    cancelBooking: async (id: string, reason: string): Promise<Booking> => {
        return api.patch(`${BOOKING_BASE_URL}/${id}/cancel`, { reason });
    },
};

import api from '@/lib/api';
import type { Booking, BookingStatus, CreateBookingPayload, CreateBroadcastPayload, PaginatedBookings } from '../types/booking.types';

const BOOKING_BASE_URL = '/bookings';

export const bookingApi = {
    createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
        return api.post(BOOKING_BASE_URL, payload);
    },

    createBroadcastBooking: async (payload: CreateBroadcastPayload): Promise<Booking> => {
        return api.post(`${BOOKING_BASE_URL}/broadcast`, payload);
    },

    getMyBookings: async (
        type: 'client' | 'helper',
        page = 1,
        limit = 10,
        status?: BookingStatus,
    ): Promise<PaginatedBookings> => {
        return api.get(`${BOOKING_BASE_URL}/my`, { params: { type, page, limit, status } });
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

    completeBooking: async (id: string, proofImageUrl?: string): Promise<Booking> => {
        return api.patch(`${BOOKING_BASE_URL}/${id}/complete`, { proofImageUrl });
    },

    settleBooking: async (id: string): Promise<Booking> => {
        return api.patch(`${BOOKING_BASE_URL}/${id}/settle`, {});
    },

    disputeBooking: async (id: string, reason: string): Promise<Booking> => {
        return api.patch(`${BOOKING_BASE_URL}/${id}/dispute`, { reason });
    },

    cancelBooking: async (id: string, reason: string): Promise<Booking> => {
        return api.patch(`${BOOKING_BASE_URL}/${id}/cancel`, { reason });
    },
};

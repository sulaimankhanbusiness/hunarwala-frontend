import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/booking.api';

export const useBookings = (role: 'client' | 'helper') => {
    return useQuery({
        queryKey: ['bookings', role],
        queryFn: () => bookingApi.getMyBookings(role),
        staleTime: 1000 * 60, // 1 minute
    });
};

export const useBookingById = (id: string) => {
    return useQuery({
        queryKey: ['booking', id],
        queryFn: () => bookingApi.getBookingById(id),
        enabled: !!id,
        staleTime: 1000 * 60, // 1 minute
    });
};

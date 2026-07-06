import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/booking.api';
import { BookingStatus } from '../types/booking.types';

export const useBookings = (role: 'client' | 'helper', status?: BookingStatus, limit = 10) => {
    return useInfiniteQuery({
        queryKey: ['bookings', role, status],
        queryFn: ({ pageParam = 1 }) => bookingApi.getMyBookings(role, pageParam, limit, status),
        getNextPageParam: (lastPage) => {
            if (lastPage.page * lastPage.limit < lastPage.total) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
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

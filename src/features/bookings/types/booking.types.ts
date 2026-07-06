export enum BookingStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    SETTLED = 'SETTLED',
    CANCELLED = 'CANCELLED',
    DISPUTE = 'DISPUTE',
    EXPIRED = 'EXPIRED',
}

export enum BookingType {
    DAILY = 'DAILY',
    SERVICE = 'SERVICE',
}

export enum CancelledBy {
    USER = 'USER',
    HELPER = 'HELPER',
    ADMIN = 'ADMIN',
}

export interface Review {
    id: number;
    userId: string;
    helperId: string;
    bookingId: string;
    rating: number;
    comment?: string;
    createdAt: string;
}

export interface Booking {
    id: string;
    userId: string;
    helperId: string;
    serviceDescription: string;
    scheduledAt: string;
    bookingType: BookingType;
    serviceId?: string;
    price: number | null;
    status: BookingStatus;
    startAt?: string;
    completedAt?: string;
    latitude?: number;
    longitude?: number;
    proofImageUrl?: string;
    isDisputed: boolean;
    disputeReason?: string;
    cancellationReason?: string;
    cancelledBy?: CancelledBy;
    createdAt: string;
    updatedAt: string;
    // Relations
    user?: {
        id: string;
        fullName: string;
        email: string;
        phoneNumber?: string;
    };
    helper?: {
        id: string;
        userId?: string;
        headline?: string;
        user: {
            fullName: string;
            profileImage?: string;
            phoneNumber?: string;
        };
    };
    review?: Review;
}

export interface CreateBookingPayload {
    helperId: string;
    serviceDescription: string;
    scheduledAt: string;
    bookingType: BookingType;
    serviceId?: string;
}

export interface CreateBroadcastPayload {
    helperIds: string[];
    serviceDescription: string;
    scheduledAt: string;
}

export interface PaginatedBookings {
    items: Booking[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

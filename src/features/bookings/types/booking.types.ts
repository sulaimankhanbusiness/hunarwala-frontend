export enum BookingStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    SETTLED = 'SETTLED',
    CANCELLED = 'CANCELLED',
    DISPUTE = 'DISPUTE',
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
    estimatedPrice: number;
    status: BookingStatus;
    startAt?: string;
    completedAt?: string;
    latitude?: number;
    longitude?: number;
    proofImageUrl?: string;
    helperReportedAmount?: number;
    userConfirmedPayment: boolean;
    userConfirmedAt?: string;
    helperConfirmedPayment: boolean;
    helperConfirmedAt?: string;
    agreedAmount?: number;
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
    };
    helper?: {
        id: string;
        userId: string;
        user: {
            fullName: string;
            profileImage?: string;
        };
    };
    review?: Review;
}

export interface CreateBookingPayload {
    helperId: string;
    serviceDescription: string;
    scheduledAt: string;
    estimatedPrice: number;
}

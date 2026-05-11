export interface User {
    id: string;
    fullName: string;
    email?: string;
    profileImage?: string | null;
    userType: string;
    isOnline?: boolean;
    lastSeen?: string | null;
}

export interface Attachment {
    id?: string;
    type?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    url?: string;
    thumbnailUrl?: string;
    duration?: number;
    width?: number;
    height?: number;
}

export interface MessageLocation {
    lat: number;
    lng: number;
    address?: string;
    googleMapsUrl?: string;
    placeId?: string;
}

export interface MessageReaction {
    emoji: string;
    userIds: string[];
}

export interface Message {
    id: string;
    chatId?: string;
    senderUserId: string;
    content: string | null;
    contentType: 'text' | 'image' | 'file' | 'video' | 'audio' | 'location' | 'system' | 'voice' | 'booking_update' | 'payment_update';
    systemType?: string | null;
    replyToMessageId?: string | null;
    replyToMessage?: {
        id: string;
        content: string | null;
        contentType: string;
        senderUserId: string;
    } | null;
    attachments?: Attachment[] | null;
    location?: MessageLocation | null;
    reactions?: MessageReaction[] | null;
    metadata?: any;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    sentAt: string;
    deliveredAt?: string | null;
    readAt?: string | null;
    editedAt?: string | null;
    isDeleted: boolean;
    deletedForEveryone?: boolean;
    // Computed by backend
    isMine?: boolean;
    isEdited?: boolean;
    groupWithPrevious?: boolean;
    // Legacy (from old sender relation)
    sender?: User;
}

export interface Chat {
    id: string;
    chatType?: 'booking' | 'support' | 'direct';
    bookingId?: string | null;
    otherParticipant: User; // normalized from `participant`
    lastMessage?: {
        content: string | null;
        contentType: string;
        sentAt: string;
        isMine?: boolean;
    } | null;
    lastActivityAt?: string | null;
    unreadCount: number;
    isActive: boolean;
    isArchived?: boolean;
    isMuted?: boolean;
    isBlocked?: boolean;
}

export interface MessagesPageResponse {
    chat: {
        id: string;
        chatType?: string;
        bookingId?: string | null;
        lastActivityAt?: string | null;
        unreadCount: number;
    };
    participants: User[];
    messages: Message[];
    pagination: {
        nextCursor: string | null;
        hasMore: boolean;
    };
}

// Legacy format (backward compat)
export interface PaginatedMessages {
    items?: Message[];
    messages?: Message[];
    total?: number;
    page?: number;
    limit?: number;
    pagination?: {
        nextCursor: string | null;
        hasMore: boolean;
    };
    chat?: any;
    participants?: User[];
}

export interface PaginatedChats {
    items: Chat[];
    total: number;
    page: number;
    limit: number;
}

export interface SendMessagePayload {
    content?: string;
    contentType?: 'text' | 'image' | 'file' | 'video' | 'audio' | 'location' | 'system';
    replyToMessageId?: string;
    attachments?: Attachment[];
    location?: MessageLocation;
    metadata?: any;
}

export interface UnreadCountResponse {
    totalUnreadCount: number;
    chatUnreadCounts: {
        chatId: string;
        unreadCount: number;
    }[];
}

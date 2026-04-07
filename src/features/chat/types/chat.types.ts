import api from '@/lib/api';

export interface User {
    id: string;
    fullName: string;
    email?: string;
    profileImage?: string;
    userType: string;
}

export interface Attachment {
    fileName: string;
    fileSize: number;
    mimeType: string;
    url: string;
}

export interface Message {
    id: string;
    chatId: string;
    senderUserId: string;
    content: string;
    contentType: 'text' | 'image' | 'file' | 'video' | 'audio' | 'location';
    replyToMessageId?: string;
    replyToMessage?: Message;
    attachments?: Attachment[];
    metadata?: any;
    status: 'sent' | 'delivered' | 'read';
    sentAt: string;
    deliveredAt?: string;
    readAt?: string;
    editedAt?: string;
    isDeleted: boolean;
    sender?: User;
}

export interface Chat {
    id: string;
    otherParticipant: User;
    lastMessage?: Message;
    lastActivityAt?: string;
    unreadCount: number;
    isActive: boolean;
}

export interface PaginatedChats {
    items: Chat[];
    total: number;
    page: number;
    limit: number;
}

export interface PaginatedMessages {
    items: Message[];
    total: number;
    page: number;
    limit: number;
}

export interface SendMessagePayload {
    content: string;
    contentType?: 'text' | 'image' | 'file' | 'video' | 'audio' | 'location';
    replyToMessageId?: string;
    attachments?: Attachment[];
    metadata?: any;
}

export interface UnreadCountResponse {
    totalUnreadCount: number;
    chatUnreadCounts: {
        chatId: string;
        unreadCount: number;
    }[];
}

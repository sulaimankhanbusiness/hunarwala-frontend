import type { Chat, Message, User } from '../types/chat.types';

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getMessagePreview = (message: Message): string => {
    if (message.isDeleted) return 'This message was deleted';
    if (message.contentType === 'image') return '📷 Photo';
    if (message.contentType === 'file') return '📎 File';
    if (message.contentType === 'voice') return '🎵 Voice message';
    if (message.contentType === 'location') return '📍 Location';
    if (message.contentType === 'system') return message.content ?? 'System message';
    if (message.contentType === 'booking_update') return '📋 Booking update';
    if (message.contentType === 'payment_update') return '💳 Payment update';
    return truncateText(message.content ?? '', 50);
};

export const getOtherUser = (chat: Chat, currentUserId?: string): User | null => {
    // Chat is normalized by chatApi.normalizeChat — otherParticipant is always set
    if (chat.otherParticipant && (!currentUserId || chat.otherParticipant.id !== currentUserId)) {
        return chat.otherParticipant;
    }
    return null;
};

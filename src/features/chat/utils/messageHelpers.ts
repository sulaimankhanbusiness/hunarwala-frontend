import type { Chat } from '../types/chat.types';

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getMessagePreview = (message: any): string => {
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

export const getOtherUser = (chat: Chat, currentUserId?: string) => {
    // Prefer pre-normalized field
    const single = (chat as any).otherParticipant ?? (chat as any).participant;
    if (single && (!currentUserId || single.id !== currentUserId)) return single;

    // Handle participants array — filter out self if currentUserId is known
    const arr: any[] | undefined = (chat as any).participants;
    if (Array.isArray(arr) && arr.length > 0) {
        return (currentUserId ? arr.find((p) => p.id !== currentUserId) : null) ?? arr[0];
    }

    return single ?? null;
};

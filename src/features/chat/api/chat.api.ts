import api from '@/lib/api';
import type {
    Chat,
    PaginatedChats,
    MessagesPageResponse,
    Message,
    SendMessagePayload,
    UnreadCountResponse,
} from '../types/chat.types';

const CHAT_BASE_URL = '/chats';

// Normalize backend chat object: handles both old (otherParticipant/id) and new (participant/chatId) formats
const normalizeChat = (item: any): Chat => ({
    ...item,
    id: item.id || item.chatId,
    otherParticipant: item.otherParticipant || item.participant,
});

export const chatApi = {
    getChats: async (page = 1, limit = 20, isActive?: boolean): Promise<PaginatedChats> => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (isActive !== undefined) params.append('isActive', isActive.toString());
        const response: any = await api.get(`${CHAT_BASE_URL}?${params.toString()}`);
        return {
            total: response.total ?? 0,
            page: response.page ?? page,
            limit: response.limit ?? limit,
            items: (response.items ?? []).map(normalizeChat),
        };
    },

    getChatById: async (chatId: string): Promise<Chat> => {
        const response = await api.get(`${CHAT_BASE_URL}/${chatId}`);
        return normalizeChat(response);
    },

    createChat: async (targetUserId: string, bookingId?: string): Promise<Chat> => {
        const response = await api.post(CHAT_BASE_URL, { targetUserId, bookingId });
        return normalizeChat(response);
    },

    // Cursor-based pagination — cursor is the oldest message ID
    getMessages: async (chatId: string, cursor?: string, limit = 50): Promise<MessagesPageResponse> => {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (cursor) params.append('cursor', cursor);
        return api.get(`${CHAT_BASE_URL}/${chatId}/messages?${params.toString()}`);
    },

    sendMessage: async (chatId: string, payload: SendMessagePayload): Promise<Message> => {
        return api.post(`${CHAT_BASE_URL}/${chatId}/messages`, payload);
    },

    editMessage: async (chatId: string, messageId: string, content: string): Promise<Message> => {
        return api.patch(`${CHAT_BASE_URL}/${chatId}/messages/${messageId}`, { content });
    },

    deleteMessage: async (chatId: string, messageId: string): Promise<void> => {
        return api.delete(`${CHAT_BASE_URL}/${chatId}/messages/${messageId}`);
    },

    reactToMessage: async (chatId: string, messageId: string, emoji: string): Promise<void> => {
        return api.post(`${CHAT_BASE_URL}/${chatId}/messages/${messageId}/react`, { emoji });
    },

    markAsRead: async (chatId: string, lastMessageId?: string): Promise<void> => {
        return api.post(`${CHAT_BASE_URL}/${chatId}/read`, { lastMessageId });
    },

    getUnreadCount: async (): Promise<UnreadCountResponse> => {
        return api.get(`${CHAT_BASE_URL}/unread-count`);
    },

    deleteChat: async (chatId: string): Promise<void> => {
        return api.delete(`${CHAT_BASE_URL}/${chatId}`);
    },
};

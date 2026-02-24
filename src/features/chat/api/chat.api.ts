import api from '@/lib/api';
import type {
    Chat,
    PaginatedChats,
    PaginatedMessages,
    Message,
    SendMessagePayload,
    UnreadCountResponse,
} from '../types/chat.types';

const CHAT_BASE_URL = '/chats';

export const chatApi = {
    // Get all chats with pagination
    getChats: async (page = 1, limit = 20, isActive?: boolean): Promise<PaginatedChats> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (isActive !== undefined) {
            params.append('isActive', isActive.toString());
        }

        return api.get(`${CHAT_BASE_URL}?${params.toString()}`);
    },

    // Get single chat by ID
    getChatById: async (chatId: string): Promise<Chat> => {
        return api.get(`${CHAT_BASE_URL}/${chatId}`);
    },

    // Create or get existing chat with another user
    createChat: async (targetUserId: string): Promise<Chat> => {
        return api.post(CHAT_BASE_URL, { targetUserId });
    },

    // Get messages for a chat with pagination
    getMessages: async (chatId: string, page = 1, limit = 50): Promise<PaginatedMessages> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        return api.get(`${CHAT_BASE_URL}/${chatId}/messages?${params.toString()}`);
    },

    // Send a new message
    sendMessage: async (chatId: string, payload: SendMessagePayload): Promise<Message> => {
        return api.post(`${CHAT_BASE_URL}/${chatId}/messages`, payload);
    },

    // Edit a message
    editMessage: async (chatId: string, messageId: string, content: string): Promise<Message> => {
        return api.patch(`${CHAT_BASE_URL}/${chatId}/messages/${messageId}`, { content });
    },

    // Delete a message
    deleteMessage: async (chatId: string, messageId: string): Promise<void> => {
        return api.delete(`${CHAT_BASE_URL}/${chatId}/messages/${messageId}`);
    },

    // Mark messages as read
    markAsRead: async (chatId: string, lastMessageId?: string): Promise<void> => {
        return api.post(`${CHAT_BASE_URL}/${chatId}/read`, {
            lastMessageId,
        });
    },

    // Get unread count
    getUnreadCount: async (): Promise<UnreadCountResponse> => {
        return api.get(`${CHAT_BASE_URL}/unread-count`);
    },

    // Delete a chat
    deleteChat: async (chatId: string): Promise<void> => {
        return api.delete(`${CHAT_BASE_URL}/${chatId}`);
    },
};

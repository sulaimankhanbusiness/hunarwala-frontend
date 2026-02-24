import { create } from 'zustand';
import type { Chat, Message } from '../types/chat.types';

interface ChatState {
    // Active chat
    activeChat: Chat | null;
    setActiveChat: (chat: Chat | null) => void;

    // Reply state
    replyingTo: Message | null;
    setReplyingTo: (message: Message | null) => void;
    clearReply: () => void;

    // Edit state
    editingMessage: Message | null;
    setEditingMessage: (message: Message | null) => void;
    clearEdit: () => void;

    // Unread count
    unreadCount: number;
    setUnreadCount: (count: number) => void;

    // Search/filter
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    // UI state
    isMobileChatOpen: boolean;
    setMobileChatOpen: (isOpen: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    // Active chat
    activeChat: null,
    setActiveChat: (chat) => set({ activeChat: chat }),

    // Reply state
    replyingTo: null,
    setReplyingTo: (message) => set({ replyingTo: message }),
    clearReply: () => set({ replyingTo: null }),

    // Edit state
    editingMessage: null,
    setEditingMessage: (message) => set({ editingMessage: message }),
    clearEdit: () => set({ editingMessage: null }),

    // Unread count
    unreadCount: 0,
    setUnreadCount: (count) => set({ unreadCount: count }),

    // Search/filter
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),

    // UI state
    isMobileChatOpen: false,
    setMobileChatOpen: (isOpen) => set({ isMobileChatOpen: isOpen }),
}));

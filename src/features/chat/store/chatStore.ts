import { create } from 'zustand';
import type { Chat, Message } from '../types/chat.types';

export interface BookingContext {
    serviceTitle: string;
    serviceDescription?: string;
    bookingRef?: string;
    price?: number;
    status?: string;
}

interface ChatState {
    activeChat: Chat | null;
    setActiveChat: (chat: Chat | null) => void;
    updateActiveChatOnlineStatus: (userId: string, isOnline: boolean) => void;

    bookingContext: BookingContext | null;
    setBookingContext: (ctx: BookingContext | null) => void;

    replyingTo: Message | null;
    setReplyingTo: (message: Message | null) => void;
    clearReply: () => void;

    editingMessage: Message | null;
    setEditingMessage: (message: Message | null) => void;
    clearEdit: () => void;

    searchQuery: string;
    setSearchQuery: (query: string) => void;

    isMobileChatOpen: boolean;
    setMobileChatOpen: (isOpen: boolean) => void;

    // chatId -> true if the other user is currently typing
    typingChats: Record<string, boolean>;
    setTyping: (chatId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    activeChat: null,
    setActiveChat: (chat) => set({ activeChat: chat }),
    updateActiveChatOnlineStatus: (userId, isOnline) => {
        const { activeChat } = get();
        if (activeChat?.otherParticipant?.id === userId) {
            set({
                activeChat: {
                    ...activeChat,
                    otherParticipant: { ...activeChat.otherParticipant, isOnline },
                },
            });
        }
    },

    bookingContext: null,
    setBookingContext: (ctx) => set({ bookingContext: ctx }),

    replyingTo: null,
    setReplyingTo: (message) => set({ replyingTo: message }),
    clearReply: () => set({ replyingTo: null }),

    editingMessage: null,
    setEditingMessage: (message) => set({ editingMessage: message }),
    clearEdit: () => set({ editingMessage: null }),

    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),

    isMobileChatOpen: false,
    setMobileChatOpen: (isOpen) => set({ isMobileChatOpen: isOpen }),

    typingChats: {},
    setTyping: (chatId, isTyping) =>
        set((state) => ({ typingChats: { ...state.typingChats, [chatId]: isTyping } })),
}));

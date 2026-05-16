import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { chatApi } from '../api/chat.api';
import { useChatStore } from '../store/chatStore';
import type { SendMessagePayload } from '../types/chat.types';

export const useSendMessage = (chatId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SendMessagePayload) => chatApi.sendMessage(chatId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
        onError: () => {
            toast.error('Failed to send message. Please try again.');
        },
    });
};

export const useEditMessage = (chatId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
            chatApi.editMessage(chatId, messageId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        },
        onError: () => {
            toast.error('Failed to edit message.');
        },
    });
};

export const useDeleteMessage = (chatId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (messageId: string) => chatApi.deleteMessage(chatId, messageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
        onError: () => {
            toast.error('Failed to delete message.');
        },
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ chatId, lastMessageId }: { chatId: string; lastMessageId?: string }) =>
            chatApi.markAsRead(chatId, lastMessageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
            queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        },
    });
};

export const useReactToMessage = (chatId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ messageId, emoji }: { messageId: string; emoji: string }) =>
            chatApi.reactToMessage(chatId, messageId, emoji),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        },
        onError: () => {
            toast.error('Failed to add reaction.');
        },
    });
};

export const useDeleteChat = () => {
    const queryClient = useQueryClient();
    const setActiveChat = useChatStore((state) => state.setActiveChat);
    const setMobileChatOpen = useChatStore((state) => state.setMobileChatOpen);

    return useMutation({
        mutationFn: (chatId: string) => chatApi.deleteChat(chatId),
        onSuccess: () => {
            setActiveChat(null);
            setMobileChatOpen(false);
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
        onError: () => {
            toast.error('Failed to delete chat.');
        },
    });
};

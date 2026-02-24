import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import type { SendMessagePayload } from '../types/chat.types';

export const useSendMessage = (chatId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SendMessagePayload) => chatApi.sendMessage(chatId, payload),
        onSuccess: () => {
            // Invalidate messages query to refetch
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
            // Invalidate chats query to update last message
            queryClient.invalidateQueries({ queryKey: ['chats'] });
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
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ chatId, lastMessageId }: { chatId: string; lastMessageId?: string }) =>
            chatApi.markAsRead(chatId, lastMessageId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
            queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        },
    });
};

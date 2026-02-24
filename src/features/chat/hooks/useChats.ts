import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';

export const useChats = (limit = 20) => {
    return useInfiniteQuery({
        queryKey: ['chats'],
        queryFn: ({ pageParam = 1 }) => chatApi.getChats(pageParam, limit),
        getNextPageParam: (lastPage) => {
            if (lastPage.page * lastPage.limit < lastPage.total) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        staleTime: 1000 * 60, // 1 minute
        refetchOnWindowFocus: true,
        refetchInterval: 10000, // Refresh chat list every 10 seconds
    });
};

export const useChatById = (chatId: string | null) => {
    return useQuery({
        queryKey: ['chat', chatId],
        queryFn: () => chatApi.getChatById(chatId!),
        enabled: !!chatId,
        staleTime: 1000 * 60, // 1 minute
    });
};

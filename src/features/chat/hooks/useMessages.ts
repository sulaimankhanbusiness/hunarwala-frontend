import { useInfiniteQuery } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import type { MessagesPageResponse } from '../types/chat.types';

export const useMessages = (chatId: string | null, limit = 50) => {
    return useInfiniteQuery<MessagesPageResponse>({
        queryKey: ['messages', chatId],
        queryFn: ({ pageParam }) =>
            chatApi.getMessages(chatId!, pageParam as string | undefined, limit),
        // nextCursor = oldest message ID in the batch → used to load even older messages
        getNextPageParam: (lastPage) =>
            lastPage.pagination?.hasMore ? lastPage.pagination.nextCursor ?? undefined : undefined,
        initialPageParam: undefined,
        enabled: !!chatId,
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
    });
};

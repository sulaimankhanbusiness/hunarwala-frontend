import { useInfiniteQuery } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';

export const useMessages = (chatId: string | null, limit = 50) => {
    return useInfiniteQuery({
        queryKey: ['messages', chatId],
        queryFn: ({ pageParam = 1 }) => chatApi.getMessages(chatId!, pageParam, limit),
        getNextPageParam: (lastPage) => {
            if (lastPage.page * lastPage.limit < lastPage.total) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!chatId,
        staleTime: 1000 * 30, // 30 seconds
        refetchOnWindowFocus: false,
        refetchInterval: 3000, // Refresh messages every 3 seconds for active chat
    });
};

'use client';

import { useChats } from '../hooks/useChats';
import { useChatStore } from '../store/chatStore';
import { ChatListItem } from './ChatListItem';
import { Loader2, MessageCircle, Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ChatListProps {
    currentUserId: string;
}

export const ChatList = ({ currentUserId }: ChatListProps) => {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useChats();
    const activeChat = useChatStore((state) => state.activeChat);
    const searchQuery = useChatStore((state) => state.searchQuery);
    const setSearchQuery = useChatStore((state) => state.setSearchQuery);

    const observerTarget = useRef<HTMLDivElement>(null);

    // Infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allChats = data?.pages.flatMap((page) => page.items) || [];
    const filteredChats = searchQuery
        ? allChats.filter((chat) =>
            chat.otherParticipant.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : allChats;

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            {/* Header */}
            <div className="px-4 py-4 border-b border-gray-200 bg-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-blue-500" />
                    Messages
                </h2>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                ) : filteredChats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                        <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                        <p className="text-sm text-gray-600">
                            {searchQuery ? 'No chats match your search' : 'Start chatting with helpers to see your conversations here'}
                        </p>
                    </div>
                ) : (
                    <>
                        {filteredChats.map((chat) => (
                            <ChatListItem
                                key={chat.id}
                                chat={chat}
                                currentUserId={currentUserId}
                                isActive={activeChat?.id === chat.id}
                            />
                        ))}

                        {/* Infinite scroll trigger */}
                        <div ref={observerTarget} className="h-4" />

                        {isFetchingNextPage && (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

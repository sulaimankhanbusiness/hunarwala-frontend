'use client';

import { useChats } from '../hooks/useChats';
import { useChatStore } from '../store/chatStore';
import { ChatListItem } from './ChatListItem';
import { Loader2, MessageCircle, Search, Edit } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getOtherUser } from '../utils/messageHelpers';
import clsx from 'clsx';

interface ChatListProps {
    currentUserId: string;
}

type Tab = 'all' | 'unread';

export const ChatList = ({ currentUserId }: ChatListProps) => {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useChats();
    const activeChat = useChatStore((state) => state.activeChat);
    const searchQuery = useChatStore((state) => state.searchQuery);
    const setSearchQuery = useChatStore((state) => state.setSearchQuery);
    const [activeTab, setActiveTab] = useState<Tab>('all');

    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );
        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allChats = data?.pages.flatMap((page) => page.items) ?? [];
    const totalUnread = allChats.filter(c => c.unreadCount > 0).length;

    const filteredChats = allChats.filter((chat) => {
        const otherUser = getOtherUser(chat, currentUserId);
        const matchesSearch = searchQuery
            ? otherUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        const matchesTab = activeTab === 'unread' ? chat.unreadCount > 0 : true;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100">
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-extrabold text-gray-900">Messages</h2>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="New message">
                        <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-3">
                    {(['all', 'unread'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all',
                                activeTab === tab
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-500 hover:bg-gray-100'
                            )}
                        >
                            {tab === 'all' ? 'All' : 'Unread'}
                            {tab === 'unread' && totalUnread > 0 && (
                                <span className="bg-indigo-600 text-white text-[10px] font-black rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                                    {totalUnread}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                    </div>
                ) : filteredChats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
                        <MessageCircle className="w-14 h-14 text-gray-200 mb-3" />
                        <p className="text-base font-semibold text-gray-700 mb-1">
                            {activeTab === 'unread' ? 'All caught up!' : 'No conversations'}
                        </p>
                        <p className="text-sm text-gray-400">
                            {searchQuery
                                ? 'No chats match your search'
                                : activeTab === 'unread'
                                ? 'No unread messages'
                                : 'Start chatting with helpers'}
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="px-5 pt-3 pb-1 text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                            {activeTab === 'unread' ? 'Unread' : `Showing ${filteredChats.length} conversation${filteredChats.length !== 1 ? 's' : ''}`}
                        </p>
                        {filteredChats.map((chat) => (
                            <ChatListItem
                                key={chat.id}
                                chat={chat}
                                currentUserId={currentUserId}
                                isActive={activeChat?.id === chat.id}
                            />
                        ))}
                        <div ref={observerTarget} className="h-4" />
                        {isFetchingNextPage && (
                            <div className="flex justify-center py-3">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

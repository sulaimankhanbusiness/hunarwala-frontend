'use client';

import { useChatStore } from '../store/chatStore';
import type { Chat } from '../types/chat.types';
import { formatChatListTime } from '../utils/formatTime';
import { getMessagePreview, getOtherUser } from '../utils/messageHelpers';
import { MessageCircle } from 'lucide-react';
import clsx from 'clsx';

interface ChatListItemProps {
    chat: Chat;
    currentUserId: string;
    isActive: boolean;
}

export const ChatListItem = ({ chat, currentUserId, isActive }: ChatListItemProps) => {
    const setActiveChat = useChatStore((state) => state.setActiveChat);
    const setMobileChatOpen = useChatStore((state) => state.setMobileChatOpen);

    const otherUser = getOtherUser(chat);
    const lastMessagePreview = chat.lastMessage ? getMessagePreview(chat.lastMessage) : 'Start a conversation';
    const hasUnread = chat.unreadCount > 0;

    const handleClick = () => {
        setActiveChat(chat);
        setMobileChatOpen(true);
    };

    return (
        <button
            onClick={handleClick}
            className={clsx(
                "w-full px-6 py-4 flex items-start gap-4 transition-all duration-200 border-l-4",
                isActive
                    ? "bg-white shadow-sm border-blue-600 z-10 scale-[1.02]"
                    : "hover:bg-white/50 border-transparent hover:scale-[1.01]",
                hasUnread && !isActive ? "bg-blue-50/40" : ""
            )}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {otherUser?.fullName?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-0.5">
                    <h3 className={clsx(
                        "text-sm font-bold text-gray-900 truncate",
                        hasUnread ? "text-blue-600" : ""
                    )}>
                        {otherUser?.fullName || 'Unknown User'}
                    </h3>
                    {chat.lastActivityAt && (
                        <span className={clsx(
                            "text-[10px] uppercase font-bold tracking-tighter",
                            hasUnread ? "text-blue-600" : "text-gray-400"
                        )}>
                            {formatChatListTime(chat.lastActivityAt)}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2">
                    <p className={clsx(
                        "text-xs truncate leading-relaxed",
                        hasUnread ? "text-gray-900 font-semibold" : "text-gray-500 font-medium"
                    )}>
                        {lastMessagePreview}
                    </p>
                    {hasUnread && (
                        <span className="flex-shrink-0 bg-blue-600 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-lg shadow-blue-200">
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

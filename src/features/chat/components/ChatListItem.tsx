'use client';

import { useChatStore } from '../store/chatStore';
import type { Chat } from '../types/chat.types';
import { formatChatListTime } from '../utils/formatTime';
import { getMessagePreview, getOtherUser } from '../utils/messageHelpers';
import { MessageCircle } from 'lucide-react';

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
            className={`
        w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors
        ${isActive ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}
        ${hasUnread ? 'bg-blue-50/30' : ''}
      `}
        >
            {/* Avatar */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                {otherUser?.fullName?.charAt(0).toUpperCase() || '?'}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold text-gray-900 truncate ${hasUnread ? 'font-bold' : ''}`}>
                        {otherUser?.fullName || 'Unknown User'}
                    </h3>
                    {chat.lastActivityAt && (
                        <span className={`text-xs ml-2 flex-shrink-0 ${hasUnread ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                            {formatChatListTime(chat.lastActivityAt)}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${hasUnread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                        {lastMessagePreview}
                    </p>
                    {hasUnread && (
                        <span className="ml-2 flex-shrink-0 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

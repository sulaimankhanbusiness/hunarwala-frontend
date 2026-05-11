'use client';

import { useChatStore } from '../store/chatStore';
import type { Chat } from '../types/chat.types';
import { formatChatListTime } from '../utils/formatTime';
import { getMessagePreview, getOtherUser } from '../utils/messageHelpers';
import clsx from 'clsx';

interface ChatListItemProps {
    chat: Chat;
    currentUserId: string;
    isActive: boolean;
}

const CHAT_TYPE_LABEL: Record<string, string> = {
    booking: 'Booking',
    support: 'Support',
    direct: 'Direct',
};

export const ChatListItem = ({ chat, currentUserId, isActive }: ChatListItemProps) => {
    const setActiveChat = useChatStore((state) => state.setActiveChat);
    const setMobileChatOpen = useChatStore((state) => state.setMobileChatOpen);

    const otherUser = getOtherUser(chat, currentUserId);
    const lastMessagePreview = chat.lastMessage
        ? getMessagePreview(chat.lastMessage as any)
        : 'Start a conversation';
    const hasUnread = chat.unreadCount > 0;
    const isOnline = otherUser?.isOnline ?? false;

    const handleClick = () => {
        setActiveChat(chat);
        setMobileChatOpen(true);
    };

    return (
        <button
            onClick={handleClick}
            className={clsx(
                'w-full px-4 py-3.5 flex items-start gap-3 transition-all duration-150 border-l-[3px]',
                isActive
                    ? 'bg-indigo-50 border-indigo-500'
                    : 'border-transparent hover:bg-gray-50',
                hasUnread && !isActive ? 'bg-blue-50/30' : ''
            )}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                {otherUser?.profileImage ? (
                    <img
                        src={otherUser.profileImage}
                        alt={otherUser.fullName ?? ''}
                        className="w-11 h-11 rounded-full object-cover shadow-sm"
                    />
                ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                        {otherUser?.fullName?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                )}
                <span className={clsx(
                    'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                    isOnline ? 'bg-green-500' : 'bg-gray-300'
                )} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-start justify-between gap-1 mb-0.5">
                    <div className="min-w-0">
                        <h3 className={clsx(
                            'text-sm font-bold truncate leading-tight',
                            isActive ? 'text-indigo-700' : hasUnread ? 'text-gray-900' : 'text-gray-800'
                        )}>
                            {otherUser?.fullName ?? 'Unknown User'}
                        </h3>
                        {chat.chatType && chat.chatType !== 'direct' && (
                            <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wide">
                                {CHAT_TYPE_LABEL[chat.chatType] ?? chat.chatType}
                            </span>
                        )}
                    </div>
                    {chat.lastActivityAt && (
                        <span className={clsx(
                            'text-[10px] font-semibold flex-shrink-0 mt-0.5',
                            hasUnread ? 'text-indigo-600' : 'text-gray-400'
                        )}>
                            {formatChatListTime(chat.lastActivityAt)}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2">
                    <p className={clsx(
                        'text-xs truncate',
                        hasUnread ? 'text-gray-800 font-semibold' : 'text-gray-500'
                    )}>
                        {lastMessagePreview}
                    </p>
                    {hasUnread && (
                        <span className="flex-shrink-0 bg-indigo-600 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

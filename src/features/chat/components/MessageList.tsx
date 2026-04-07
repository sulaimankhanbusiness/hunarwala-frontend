import { useMessages } from '../hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Message } from '../types/chat.types';
import { isSameDay, format, isToday, isYesterday } from 'date-fns';
import clsx from 'clsx';

interface MessageListProps {
    chatId: string;
    currentUserId: string;
    onEdit: (message: Message) => void;
    onDelete: (messageId: string) => void;
    onReply: (message: Message) => void;
}

export const MessageList = ({ chatId, currentUserId, onEdit, onDelete, onReply }: MessageListProps) => {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(chatId);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Flatten pages and reverse to show oldest at top, newest at bottom
    // so we can easily calculate date separators and avatar groups.
    const allMessages = [...(data?.pages.flatMap((page) => page.items) || [])].reverse();

    // Scroll to bottom on new messages
    useEffect(() => {
        if (!isFetchingNextPage) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [allMessages.length, isFetchingNextPage]);

    // Infinite scroll for loading older messages
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#F8FAFC]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (allMessages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#F8FAFC]">
                <div className="text-center px-4">
                    <p className="text-gray-600 text-lg font-semibold mb-2">No messages yet</p>
                    <p className="text-gray-500 text-sm">Send a message to start the conversation</p>
                </div>
            </div>
        );
    }

    const formatDateSeparator = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isToday(date)) return 'Today';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'MMMM d, yyyy');
    };

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto bg-[#F8FAFC] px-4 py-4 custom-scrollbar"
        >
            {/* Load more indicator */}
            <div ref={observerTarget} className="h-10 flex items-center justify-center mb-4">
                {isFetchingNextPage ? (
                    <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                ) : hasNextPage ? (
                    <div className="h-1 w-1 bg-transparent" /> // Placeholder
                ) : (
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        Start of conversation
                    </p>
                )}
            </div>

            {/* Messages */}
            <div className="flex flex-col">
                {allMessages.map((message, index) => {
                    const isOwn = message.senderUserId === currentUserId;
                    const prevMessage = index > 0 ? allMessages[index - 1] : null;

                    const showDateSeparator = !prevMessage || !isSameDay(new Date(prevMessage.sentAt), new Date(message.sentAt));
                    const showAvatar = !prevMessage || prevMessage.senderUserId !== message.senderUserId || showDateSeparator;

                    return (
                        <div key={message.id}>
                            {showDateSeparator && (
                                <div className="flex items-center justify-center my-8">
                                    <div className="flex-1 h-[1px] bg-gray-200" />
                                    <span className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-[#F8FAFC]">
                                        {formatDateSeparator(message.sentAt)}
                                    </span>
                                    <div className="flex-1 h-[1px] bg-gray-200" />
                                </div>
                            )}
                            <MessageBubble
                                message={message}
                                isOwn={isOwn}
                                showAvatar={showAvatar}
                                onEdit={isOwn ? onEdit : undefined}
                                onDelete={isOwn ? onDelete : undefined}
                                onReply={onReply}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-2" />
        </div>
    );
};

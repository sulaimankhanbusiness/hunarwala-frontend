'use client';

import { useMessages } from '../hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Message } from '../types/chat.types';

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

    const allMessages = data?.pages.flatMap((page) => page.items) || [];

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [allMessages.length]);

    // Infinite scroll for loading older messages
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

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (allMessages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center px-4">
                    <p className="text-gray-600 text-lg mb-2">No messages yet</p>
                    <p className="text-gray-500 text-sm">Send a message to start the conversation</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="height-80-vh overflow-y-auto bg-gray-50 px-4 py-4">
            {/* Load more indicator */}
            <div ref={observerTarget} className="h-4 flex items-center justify-center">
                {isFetchingNextPage && (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                )}
            </div>

            {/* Messages */}
            <div className="space-y-1">
                {allMessages.map((message, index) => {
                    const isOwn = message.senderUserId === currentUserId;
                    const prevMessage = index > 0 ? allMessages[index - 1] : null;
                    const showAvatar = !prevMessage || prevMessage.senderUserId !== message.senderUserId;

                    return (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isOwn={isOwn}
                            showAvatar={showAvatar}
                            onEdit={isOwn ? onEdit : undefined}
                            onDelete={isOwn ? onDelete : undefined}
                            onReply={onReply}
                        />
                    );
                })}
            </div>

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
        </div>
    );
};

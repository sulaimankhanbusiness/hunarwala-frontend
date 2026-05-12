'use client';

import { useMessages } from '../hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Message } from '../types/chat.types';
import { isSameDay, format, isToday, isYesterday } from 'date-fns';

interface MessageListProps {
    chatId: string;
    currentUserId: string;
    onEdit: (message: Message) => void;
    onDelete: (messageId: string) => void;
    onReply: (message: Message) => void;
    onReact: (messageId: string, emoji: string) => void;
}

export const MessageList = ({ chatId, currentUserId, onEdit, onDelete, onReply, onReact }: MessageListProps) => {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(chatId);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    // participants array contains the other user(s) — keyed by their userId
    const participantMap = Object.fromEntries(
        (data?.pages?.[0]?.participants ?? []).map(p => [p.id, p])
    );

    // pages[0] = most recent batch, pages[n] = oldest batch
    // Reverse pages so oldest comes first, then flatten
    // API returns sender: null — inject from participants so avatars render
    const allMessages: Message[] = data?.pages
        ? [...data.pages].reverse().flatMap(p => p.messages ?? []).map(msg => ({
            ...msg,
            sender: msg.sender ?? participantMap[msg.senderUserId] ?? undefined,
        }))
        : [];

    // Scroll to bottom on initial load and new messages
    useEffect(() => {
        if (!isFetchingNextPage) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [allMessages.length, isFetchingNextPage]);

    // Infinite scroll — triggers when user scrolls to top (load older messages)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );
        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#f0f4ff]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (allMessages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#f0f4ff]">
                <div className="text-center px-4">
                    <p className="text-gray-600 text-lg font-semibold mb-1">No messages yet</p>
                    <p className="text-gray-400 text-sm">Send a message to start the conversation</p>
                </div>
            </div>
        );
    }

    const formatDateSeparator = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isToday(date)) return 'Today';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'EEEE, MMMM d');
    };

    return (
        <div className="flex-1 overflow-y-auto bg-[#f0f4ff] px-4 py-4 custom-scrollbar">
            {/* Load older messages trigger */}
            <div ref={observerTarget} className="h-10 flex items-center justify-center mb-2">
                {isFetchingNextPage ? (
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                ) : hasNextPage ? (
                    <div className="h-1" />
                ) : (
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                        Start of conversation
                    </p>
                )}
            </div>

            <div className="flex flex-col max-w-[850px] mx-auto">
                {allMessages.map((message, index) => {
                    const prevMessage = index > 0 ? allMessages[index - 1] : null;
                    const showDateSeparator = !prevMessage ||
                        !isSameDay(new Date(prevMessage.sentAt), new Date(message.sentAt));
                    const showAvatar = !prevMessage ||
                        prevMessage.senderUserId !== message.senderUserId ||
                        showDateSeparator;

                    // System messages
                    if (message.contentType === 'system') {
                        return (
                            <div key={message.id}>
                                {showDateSeparator && (
                                    <DateSeparator label={formatDateSeparator(message.sentAt)} />
                                )}
                                <SystemMessage content={message.content ?? ''} />
                            </div>
                        );
                    }

                    const isOwn = message.isMine ?? message.senderUserId === currentUserId;

                    return (
                        <div key={message.id}>
                            {showDateSeparator && (
                                <DateSeparator label={formatDateSeparator(message.sentAt)} />
                            )}
                            <MessageBubble
                                message={message}
                                isOwn={isOwn}
                                showAvatar={showAvatar}
                                onEdit={isOwn ? onEdit : undefined}
                                onDelete={isOwn ? onDelete : undefined}
                                onReply={onReply}
                                onReact={onReact}
                            />
                        </div>
                    );
                })}
            </div>

            <div ref={messagesEndRef} className="h-2" />
        </div>
    );
};

const DateSeparator = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap px-1">
            {label}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
    </div>
);

const SystemMessage = ({ content }: { content: string }) => (
    <div className="flex justify-center my-4">
        <span className="bg-white/80 border border-gray-200 text-gray-500 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
            {content}
        </span>
    </div>
);

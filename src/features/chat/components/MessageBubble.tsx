'use client';

import { useChatStore } from '../store/chatStore';
import type { Message } from '../types/chat.types';
import { formatMessageTime } from '../utils/formatTime';
import { Check, CheckCheck, Edit2, Reply, Trash2, MoreVertical, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
    showAvatar?: boolean;
    onEdit?: (message: Message) => void;
    onDelete?: (messageId: string) => void;
    onReply?: (message: Message) => void;
}

export const MessageBubble = ({
    message,
    isOwn,
    showAvatar = true,
    onEdit,
    onDelete,
    onReply,
}: MessageBubbleProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (message.isDeleted) {
        return (
            <div className={clsx('flex mb-4', isOwn ? 'justify-end' : 'justify-start')}>
                <div className="max-w-[70%] px-4 py-2 rounded-lg bg-gray-100 text-gray-500 italic text-sm">
                    This message was deleted
                </div>
            </div>
        );
    }

    const getStatusIcon = () => {
        if (!isOwn) return null;

        if (message.status === 'read') {
            return <CheckCheck className="w-4 h-4 text-blue-500" />;
        }
        if (message.status === 'delivered') {
            return <CheckCheck className="w-4 h-4 text-gray-400" />;
        }
        return <Check className="w-4 h-4 text-gray-400" />;
    };

    return (
        <div className={clsx('flex mb-4 group animate-message-in', isOwn ? 'justify-end' : 'justify-start')}>
            <div className={clsx('flex gap-2 max-w-[80%]', isOwn ? 'flex-row-reverse' : 'flex-row')}>
                {/* Avatar */}
                {showAvatar && !isOwn && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-sm font-semibold">
                        {message.sender?.fullName?.charAt(0).toUpperCase() || '?'}
                    </div>
                )}

                <div className="flex flex-col">
                    {/* Reply Preview */}
                    {message.replyToMessage && (
                        <div className={clsx(
                            'text-xs px-3 py-2 mb-1 rounded-t-lg border-l-2',
                            isOwn ? 'bg-blue-100 border-blue-400' : 'bg-gray-100 border-gray-400'
                        )}>
                            <p className="font-semibold text-gray-700">
                                {message.replyToMessage.sender?.fullName || 'Unknown'}
                            </p>
                            <p className="text-gray-600 truncate">
                                {message.replyToMessage.content}
                            </p>
                        </div>
                    )}

                    {/* Message Bubble & Actions */}
                    <div className="relative">
                        <div
                            className={clsx(
                                'px-4 py-2.5 shadow-sm transition-all duration-200',
                                isOwn
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm shadow-blue-200/50'
                                    : 'bg-white text-gray-900 border border-gray-100 rounded-2xl rounded-tl-sm shadow-gray-200/50',
                                message.replyToMessage ? (isOwn ? 'rounded-tr-none' : 'rounded-tl-none') : ''
                            )}
                        >
                            {/* Content */}
                            {message.contentType === 'location' ? (
                                <div className="space-y-2 py-1 min-w-[200px]">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium leading-tight">
                                            {message.content.replace('Shared Location: ', '')}
                                        </p>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${message.metadata?.lat},${message.metadata?.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={clsx(
                                            "block w-full text-center py-2 px-3 rounded-md text-xs font-bold transition-all shadow-sm",
                                            isOwn
                                                ? "bg-white text-blue-600 hover:bg-blue-50"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                        )}
                                    >
                                        View on Map
                                    </a>
                                </div>
                            ) : (
                                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            )}

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    {message.attachments.map((attachment, idx) => (
                                        <div
                                            key={idx}
                                            className={clsx(
                                                'flex items-center gap-2 p-2 rounded text-xs',
                                                isOwn ? 'bg-blue-600' : 'bg-gray-200'
                                            )}
                                        >
                                            <span>📎</span>
                                            <span className="truncate">{attachment.fileName}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Time and Status */}
                            <div className={clsx(
                                'flex items-center gap-1 mt-1 text-xs',
                                isOwn ? 'text-blue-100' : 'text-gray-500'
                            )}>
                                {message.editedAt && <span className="italic">edited</span>}
                                <span>{formatMessageTime(message.sentAt)}</span>
                                {getStatusIcon()}
                            </div>
                        </div>

                        {/* Actions Menu */}
                        {isOwn && (
                            <div className="absolute top-0 right-0 -mr-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <MoreVertical className="w-4 h-4 text-gray-600" />
                                </button>

                                {showMenu && (
                                    <div
                                        ref={menuRef}
                                        className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                                    >
                                        {onReply && (
                                            <button
                                                onClick={() => {
                                                    onReply(message);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <Reply className="w-4 h-4" />
                                                Reply
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button
                                                onClick={() => {
                                                    onEdit(message);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => {
                                                    onDelete(message.id);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

'use client';

import type { Message } from '../types/chat.types';
import { formatMessageTime } from '../utils/formatTime';
import { Check, CheckCheck, Edit2, Reply, Trash2, MoreVertical, MapPin, Navigation, Smile } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
    showAvatar?: boolean;
    onEdit?: (message: Message) => void;
    onDelete?: (messageId: string) => void;
    onReply?: (message: Message) => void;
    onReact?: (messageId: string, emoji: string) => void;
}

export const MessageBubble = ({
    message,
    isOwn,
    showAvatar = true,
    onEdit,
    onDelete,
    onReply,
    onReact,
}: MessageBubbleProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showEmojiBar, setShowEmojiBar] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const emojiBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
            if (emojiBarRef.current && !emojiBarRef.current.contains(e.target as Node)) {
                setShowEmojiBar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (message.isDeleted) {
        return (
            <div className={clsx('flex mb-1', isOwn ? 'justify-end' : 'justify-start')}>
                <p className="text-xs italic text-gray-400 px-4 py-2 bg-white/60 rounded-full border border-gray-100">
                    This message was deleted
                </p>
            </div>
        );
    }

    const getStatusIcon = () => {
        if (!isOwn) return null;
        if (message.status === 'read') return <CheckCheck className="w-3.5 h-3.5 text-blue-300" />;
        if (message.status === 'delivered') return <CheckCheck className="w-3.5 h-3.5 text-indigo-200" />;
        return <Check className="w-3.5 h-3.5 text-indigo-200" />;
    };

    // Location data may come from message.location, metadata, or a JSON-encoded content field
    let parsedContent: any = null;
    if (message.contentType === 'location' && message.content) {
        try { parsedContent = JSON.parse(message.content); } catch { /* not JSON */ }
    }
    const locationLat  = message.location?.lat  ?? message.metadata?.lat  ?? parsedContent?.lat;
    const locationLng  = message.location?.lng  ?? message.metadata?.lng  ?? parsedContent?.lng;
    const locationAddress = message.location?.address
        ?? message.metadata?.address
        ?? parsedContent?.address
        ?? message.content?.replace('Shared Location: ', '').trim()
        ?? 'Shared Location';
    const mapsUrl = message.location?.googleMapsUrl
        ?? (locationLat && locationLng
            ? `https://www.google.com/maps/search/?api=1&query=${locationLat},${locationLng}`
            : locationAddress && locationAddress !== 'Shared Location'
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationAddress)}`
                : 'https://www.google.com/maps');

    const isGrouped = message.groupWithPrevious;
    const mb = isGrouped ? 'mb-0.5' : 'mb-3';

    return (
        <div className={clsx('flex group', isOwn ? 'justify-end' : 'justify-start', mb)}>
            <div className={clsx('flex gap-2 max-w-[75%] lg:max-w-[60%]', isOwn ? 'flex-row-reverse' : 'flex-row')}>

                {/* Avatar — only for received messages, hidden when grouped */}
                <div className="flex-shrink-0 w-8 self-end">
                    {!isOwn && showAvatar && (
                        message.sender?.profileImage ? (
                            <img
                                src={message.sender.profileImage}
                                alt={message.sender.fullName ?? ''}
                                className="w-8 h-8 rounded-full object-cover shadow-sm"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                {message.sender?.fullName?.charAt(0).toUpperCase() ?? '?'}
                            </div>
                        )
                    )}
                </div>

                <div className="flex flex-col">
                    {/* Reply preview */}
                    {message.replyToMessage && (
                        <div className={clsx(
                            'text-xs px-3 py-2 mb-1 rounded-xl border-l-2 max-w-full',
                            isOwn
                                ? 'bg-indigo-100 border-indigo-400 text-indigo-800'
                                : 'bg-gray-100 border-gray-300 text-gray-700'
                        )}>
                            <p className="font-semibold truncate">
                                {message.replyToMessage.senderUserId === message.senderUserId ? 'You' : 'Them'}
                            </p>
                            <p className="truncate opacity-80">{message.replyToMessage.content ?? 'Attachment'}</p>
                        </div>
                    )}

                    {/* Bubble + actions */}
                    <div className="relative flex items-end gap-1">
                        {/* Actions — appear on hover */}
                        <div className={clsx(
                            'opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5',
                            isOwn ? 'order-first' : 'order-last'
                        )}>
                            {/* Emoji react button */}
                            {onReact && (
                                <div ref={emojiBarRef} className="relative">
                                    <button
                                        onClick={() => setShowEmojiBar(v => !v)}
                                        className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                                        title="React"
                                    >
                                        <Smile className="w-3.5 h-3.5 text-gray-500" />
                                    </button>
                                    {showEmojiBar && (
                                        <div className={clsx(
                                            'absolute bottom-full mb-1 flex items-center gap-0.5 bg-white rounded-full shadow-xl border border-gray-100 px-2 py-1.5 z-20',
                                            isOwn ? 'right-0' : 'left-0'
                                        )}>
                                            {QUICK_EMOJIS.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => { onReact(message.id, emoji); setShowEmojiBar(false); }}
                                                    className="text-lg hover:scale-125 transition-transform leading-none px-0.5"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {onReply && (
                                <button
                                    onClick={() => onReply(message)}
                                    className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                                    title="Reply"
                                >
                                    <Reply className="w-3.5 h-3.5 text-gray-500" />
                                </button>
                            )}
                            {isOwn && (
                                <div ref={menuRef} className="relative">
                                    <button
                                        onClick={() => setShowMenu(v => !v)}
                                        className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                        <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
                                    </button>
                                    {showMenu && (
                                        <div className={clsx(
                                            'absolute bottom-full mb-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20',
                                            isOwn ? 'right-0' : 'left-0'
                                        )}>
                                            {onEdit && message.contentType === 'text' &&
                                Date.now() - new Date(message.sentAt).getTime() < 15 * 60 * 1000 && (
                                <button
                                    onClick={() => { onEdit(message); setShowMenu(false); }}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => { onDelete(message.id); setShowMenu(false); }}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-500"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bubble */}
                        <div className={clsx(
                            'px-4 py-2.5 shadow-sm transition-all',
                            isOwn
                                ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-br-sm shadow-indigo-200/40'
                                : 'bg-white text-gray-900 border border-gray-100 rounded-2xl rounded-bl-sm shadow-gray-200/40',
                        )}>
                            {/* Location message */}
                            {message.contentType === 'location' ? (
                                <div className="min-w-[200px]">
                                    <div className="flex items-start gap-2 mb-3">
                                        <div className={clsx(
                                            'p-1.5 rounded-lg',
                                            isOwn ? 'bg-white/20' : 'bg-indigo-50'
                                        )}>
                                            <MapPin className={clsx('w-4 h-4', isOwn ? 'text-white' : 'text-indigo-600')} />
                                        </div>
                                        <div>
                                            <p className={clsx('text-xs font-semibold', isOwn ? 'text-indigo-200' : 'text-gray-500')}>
                                                Selected Location
                                            </p>
                                            <p className="text-sm font-medium leading-tight mt-0.5">
                                                {locationAddress}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={clsx(
                                            'flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all',
                                            isOwn
                                                ? 'bg-white/20 hover:bg-white/30 text-white'
                                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        )}
                                    >
                                        <Navigation className="w-3.5 h-3.5" />
                                        View on Map
                                    </a>
                                </div>
                            ) : (
                                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                    {message.content}
                                </p>
                            )}

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {message.attachments.map((att, i) => (
                                        <div key={i} className={clsx(
                                            'flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs',
                                            isOwn ? 'bg-white/15' : 'bg-gray-100'
                                        )}>
                                            <span>📎</span>
                                            <span className="truncate">{att.fileName}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Timestamp + status */}
                            <div className={clsx(
                                'flex items-center gap-1 mt-1.5',
                                isOwn ? 'justify-end' : 'justify-start'
                            )}>
                                {message.isEdited && (
                                    <span className={clsx('text-[10px] italic', isOwn ? 'text-indigo-200' : 'text-gray-400')}>
                                        edited
                                    </span>
                                )}
                                <span className={clsx('text-[11px]', isOwn ? 'text-indigo-200' : 'text-gray-400')}>
                                    {formatMessageTime(message.sentAt)}
                                </span>
                                {getStatusIcon()}
                            </div>
                        </div>
                    </div>

                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                        <div className={clsx('flex gap-1 mt-1', isOwn ? 'justify-end' : 'justify-start')}>
                            {message.reactions.map((r, i) => (
                                <span key={i} className="bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs shadow-sm">
                                    {r.emoji} {r.userIds.length > 1 && r.userIds.length}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

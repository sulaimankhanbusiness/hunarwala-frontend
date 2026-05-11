'use client';

import { useRef, useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useDeleteChat } from '../hooks/useChatMutations';
import { ArrowLeft, MoreVertical, Phone, ExternalLink, Wrench, Trash2 } from 'lucide-react';
import { getOtherUser } from '../utils/messageHelpers';
import Link from 'next/link';
import clsx from 'clsx';

const STATUS_STYLES: Record<string, string> = {
    IN_PROGRESS: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    CANCELLED: 'bg-red-100 text-red-700',
};

export const ChatHeader = () => {
    const activeChat = useChatStore((state) => state.activeChat);
    const setMobileChatOpen = useChatStore((state) => state.setMobileChatOpen);
    const bookingContext = useChatStore((state) => state.bookingContext);
    const isTyping = useChatStore((state) =>
        activeChat ? (state.typingChats[activeChat.id] ?? false) : false
    );
    const deleteChatMutation = useDeleteChat();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    if (!activeChat) return null;

    const otherUser = getOtherUser(activeChat);
    const isOnline = otherUser?.isOnline ?? false;

    const handleDeleteChat = () => {
        if (!confirm(`Delete this conversation with ${otherUser?.fullName ?? 'this user'}? This cannot be undone.`)) return;
        setMenuOpen(false);
        deleteChatMutation.mutate(activeChat.id);
    };

    return (
        <div className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm z-10">
            {/* Top row: avatar + name + actions */}
            <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileChatOpen(false)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>

                    <div className="relative">
                        {otherUser?.profileImage ? (
                            <img
                                src={otherUser.profileImage}
                                alt={otherUser.fullName ?? ''}
                                className="w-10 h-10 rounded-full object-cover shadow-sm"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                                {otherUser?.fullName?.charAt(0).toUpperCase() ?? '?'}
                            </div>
                        )}
                        <span className={clsx(
                            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                            isOnline ? 'bg-green-500' : 'bg-gray-300'
                        )} />
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight text-sm">
                            {otherUser?.fullName ?? 'Unknown User'}
                        </h3>
                        <p className={clsx('text-[11px] font-medium', isTyping ? 'text-indigo-500' : isOnline ? 'text-green-500' : 'text-gray-400')}>
                            {isTyping ? 'typing...' : isOnline ? 'Active now' : 'Offline'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Call (coming soon)">
                        <Phone className="w-4 h-4 text-gray-500" />
                    </button>
                    {activeChat.bookingId && (
                        <Link
                            href={`/bookings/${activeChat.bookingId}`}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Booking
                        </Link>
                    )}

                    {/* More menu */}
                    <div ref={menuRef} className="relative">
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-30">
                                <button
                                    onClick={handleDeleteChat}
                                    disabled={deleteChatMutation.isPending}
                                    className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete conversation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking context bar */}
            {(activeChat.bookingId || bookingContext) && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-3 flex-wrap">
                    <div className="p-1.5 bg-indigo-100 rounded-lg flex-shrink-0">
                        <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                    </div>

                    {bookingContext ? (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{bookingContext.serviceTitle}</p>
                                {bookingContext.serviceDescription && (
                                    <p className="text-xs text-gray-500 truncate">{bookingContext.serviceDescription}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-gray-500 font-mono">
                                    #HW-{bookingContext.bookingRef ?? activeChat.bookingId?.slice(0, 6).toUpperCase()}
                                </span>
                                {bookingContext.price && (
                                    <span className="text-xs font-bold text-gray-800">
                                        Rs. {bookingContext.price.toLocaleString()}
                                    </span>
                                )}
                                {bookingContext.status && (
                                    <span className={clsx(
                                        'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide',
                                        STATUS_STYLES[bookingContext.status] ?? 'bg-gray-100 text-gray-600'
                                    )}>
                                        {bookingContext.status.replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="text-xs text-gray-500 flex-1">
                            Booking{' '}
                            <span className="font-mono font-semibold text-gray-700">
                                #HW-{activeChat.bookingId?.slice(0, 6).toUpperCase()}
                            </span>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

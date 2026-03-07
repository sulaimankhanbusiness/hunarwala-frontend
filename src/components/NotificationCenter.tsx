'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Trash2, CheckCheck, Clock, FileText } from 'lucide-react';
import { useNotificationStore, Notification } from '@/stores/useNotificationStore';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, markAsRead, markAllAsRead, clearNotifications, getUnreadCount } = useNotificationStore();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const unreadCount = getUnreadCount();

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = (id: string) => {
        markAsRead(id);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-all active:scale-90"
            >
                <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-blue-600' : 'text-gray-500'}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-in zoom-in">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Notifications</h3>
                        <div className="flex gap-2">
                            {notifications.length > 0 && (
                                <>
                                    <button
                                        onClick={markAllAsRead}
                                        title="Mark all as read"
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <CheckCheck size={16} />
                                    </button>
                                    <button
                                        onClick={clearNotifications}
                                        title="Clear all"
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-sm text-gray-400 font-medium">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-4 flex gap-4 transition-colors relative group ${!n.read ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                                        onClick={() => handleMarkAsRead(n.id)}
                                    >
                                        <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${n.type === 'success' ? 'bg-green-100 text-green-600' :
                                                n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>
                                            {n.message.includes('Bill') ? <FileText size={18} /> : <Clock size={18} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`text-sm font-bold truncate ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                    {n.title}
                                                </h4>
                                                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className={`text-xs leading-relaxed ${!n.read ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                                                {n.message}
                                            </p>
                                            {n.bookingId && (
                                                <Link
                                                    href={`/bookings`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-tighter hover:underline"
                                                >
                                                    View Details →
                                                </Link>
                                            )}
                                        </div>
                                        {!n.read && (
                                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 bg-gray-50/50 border-t border-gray-100 text-center">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">End of notifications</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

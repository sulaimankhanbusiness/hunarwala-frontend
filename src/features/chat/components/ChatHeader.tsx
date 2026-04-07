'use client';

import { useChatStore } from '../store/chatStore';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { getOtherUser } from '../utils/messageHelpers';

interface ChatHeaderProps {
    currentUserId: string;
}

export const ChatHeader = ({ currentUserId }: ChatHeaderProps) => {
    const activeChat = useChatStore((state) => state.activeChat);
    const setMobileChatOpen = useChatStore((state) => state.setMobileChatOpen);

    if (!activeChat) return null;

    const otherUser = getOtherUser(activeChat);

    return (
        <div className="px-6 py-4 glass h-16 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                {/* Back button (mobile) */}
                <button
                    onClick={() => setMobileChatOpen(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-200">
                    {otherUser?.fullName?.charAt(0).toUpperCase() || '?'}
                </div>

                {/* User Info */}
                <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{otherUser?.fullName || 'Unknown User'}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Active now</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Voice call (coming soon)"
                >
                    <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Video call (coming soon)"
                >
                    <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="More options"
                >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
};

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
        <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Back button (mobile) */}
                <button
                    onClick={() => setMobileChatOpen(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {otherUser?.fullName?.charAt(0).toUpperCase() || '?'}
                </div>

                {/* User Info */}
                <div>
                    <h3 className="font-semibold text-gray-900">{otherUser?.fullName || 'Unknown User'}</h3>
                    <p className="text-xs text-gray-500">Active now</p>
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

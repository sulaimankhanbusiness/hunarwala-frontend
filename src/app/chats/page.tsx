'use client';

import { ChatList } from '@/features/chat/components/ChatList';
import { ChatWindow } from '@/features/chat/components/ChatWindow';
import { useChatStore } from '@/features/chat/store/chatStore';
import { useChatById } from '@/features/chat/hooks/useChats';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ChatsContent() {
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const isMobileChatOpen = useChatStore((state) => state.isMobileChatOpen);
    const setActiveChat = useChatStore((state) => state.setActiveChat);
    const setMobileChatOpen = useChatStore((state) => state.setMobileChatOpen);
    const searchParams = useSearchParams();
    const chatId = searchParams.get('chatId');

    const { data: chatData } = useChatById(chatId);

    // Get current user ID from localStorage or auth context
    useEffect(() => {
        const userData = localStorage.getItem('auth-storage') || '';
        if (userData) {
            try {
                const user = JSON.parse(userData).state.user;
                const userId = user.id; // Always use account ID for chats
                setCurrentUserId(userId);
            } catch (e) {
                console.error('Failed to parse auth data', e);
            }
        }
    }, []);

    // Set active chat from URL if available
    useEffect(() => {
        if (chatData) {
            setActiveChat(chatData);
            if (window.innerWidth < 1024) {
                setMobileChatOpen(true);
            }
        }
    }, [chatData, setActiveChat, setMobileChatOpen]);

    if (!currentUserId) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your conversations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex overflow-hidden bg-white">
            {/* Chat List - Hidden on mobile when chat is open */}
            <div className={`
        w-full lg:w-80 xl:w-96 flex-shrink-0 border-r border-gray-200
        ${isMobileChatOpen ? 'hidden lg:block' : 'block'}
      `}>
                <ChatList currentUserId={currentUserId} />
            </div>

            {/* Chat Window - Hidden on mobile when chat list is shown */}
            <div className={`
        flex-1
        ${isMobileChatOpen ? 'block' : 'hidden lg:block'}
      `}>
                <ChatWindow currentUserId={currentUserId} />
            </div>
        </div>
    );
}

export default function ChatsPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        }>
            <ChatsContent />
        </Suspense>
    );
}

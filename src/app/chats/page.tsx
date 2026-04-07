'use client';

import { ChatList } from '@/features/chat/components/ChatList';
import { ChatWindow } from '@/features/chat/components/ChatWindow';
import { useChatStore } from '@/features/chat/store/chatStore';
import { useChatById } from '@/features/chat/hooks/useChats';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" />
                    </div>
                    <p className="mt-6 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Initializing Chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-white">
            {/* Chat List - Hidden on mobile when chat is open */}
            <div className={`
        w-full lg:w-80 xl:w-96 flex-shrink-0 border-r border-gray-200
        ${isMobileChatOpen ? 'hidden lg:block' : 'block'}
      `}>
                <ChatList currentUserId={currentUserId} />
            </div>

            {/* Chat Window - Hidden on mobile when chat list is shown */}
            <div className={`
                flex-1 flex flex-col min-h-0
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
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
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

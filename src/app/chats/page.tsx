'use client';

import { ChatList } from '@/features/chat/components/ChatList';
import { ChatWindow } from '@/features/chat/components/ChatWindow';
import { useChatStore } from '@/features/chat/store/chatStore';
import { useChatById } from '@/features/chat/hooks/useChats';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useNavBadgeStore } from '@/stores/useNavBadgeStore';

function ChatsContent() {
    const { user } = useAuthStore();
    const currentUserId = user?.id ?? '';

    const isMobileChatOpen = useChatStore((state) => state.isMobileChatOpen);
    const setActiveChat = useChatStore((state) => state.setActiveChat);
    const setMobileChatOpen = useChatStore((state) => state.setMobileChatOpen);
    const clearMessages = useNavBadgeStore((s) => s.clearMessages);
    const searchParams = useSearchParams();
    const chatId = searchParams.get('chatId');

    // Clear unread message badge as soon as the user opens this page
    useEffect(() => {
        clearMessages();
    }, [clearMessages]);

    const { data: chatData } = useChatById(chatId);

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
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
                    </div>
                    <p className="mt-6 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Initializing Chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-white">
            {/* Chat List — hidden on mobile when a chat is open */}
            <div className={`w-full lg:w-80 xl:w-96 flex-shrink-0 border-r border-gray-200 ${isMobileChatOpen ? 'hidden lg:block' : 'block'}`}>
                <ChatList currentUserId={currentUserId} />
            </div>

            {/* Chat Window — hidden on mobile when the list is shown */}
            <div className={`flex-1 flex flex-col min-h-0 ${isMobileChatOpen ? 'block' : 'hidden lg:block'}`}>
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4" />
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        }>
            <ChatsContent />
        </Suspense>
    );
}

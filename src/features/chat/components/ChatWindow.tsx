'use client';

import { useChatStore } from '../store/chatStore';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useSendMessage, useEditMessage, useDeleteMessage, useMarkAsRead, useReactToMessage } from '../hooks/useChatMutations';
import { MessageCircle, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';


interface ChatWindowProps {
    currentUserId: string;
}

export const ChatWindow = ({ currentUserId }: ChatWindowProps) => {
    const activeChat = useChatStore((state) => state.activeChat);
    const setReplyingTo = useChatStore((state) => state.setReplyingTo);
    const setEditingMessage = useChatStore((state) => state.setEditingMessage);
    const clearEdit = useChatStore((state) => state.clearEdit);
    const [safetyDismissed, setSafetyDismissed] = useState(false);

    const sendMessageMutation = useSendMessage(activeChat?.id ?? '');
    const editMessageMutation = useEditMessage(activeChat?.id ?? '');
    const deleteMessageMutation = useDeleteMessage(activeChat?.id ?? '');
    const reactToMessageMutation = useReactToMessage(activeChat?.id ?? '');
    const markAsReadMutation = useMarkAsRead();

    useEffect(() => {
        if (activeChat && activeChat.unreadCount > 0) {
            markAsReadMutation.mutate({ chatId: activeChat.id });
        }
        // Reset safety notice per chat
        setSafetyDismissed(false);
    }, [activeChat?.id]);

    const handleSendMessage = (content: string, replyToId?: string, contentType: 'text' | 'location' = 'text', metadata?: any) => {
        if (!activeChat) return;
        sendMessageMutation.mutate({ content, contentType, replyToMessageId: replyToId, metadata });
    };

    const handleEditMessage = (messageId: string, content: string) => {
        if (!activeChat) return;
        editMessageMutation.mutate({ messageId, content }, { onSuccess: () => clearEdit() });
    };

    const handleDeleteMessage = (messageId: string) => {
        if (!activeChat) return;
        if (confirm('Delete this message for everyone?')) {
            deleteMessageMutation.mutate(messageId);
        }
    };

    const handleReactToMessage = (messageId: string, emoji: string) => {
        if (!activeChat) return;
        reactToMessageMutation.mutate({ messageId, emoji });
    };

    if (!activeChat) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f4ff] text-center px-6">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-sm">
                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h2>
                    <p className="text-gray-500 text-sm">
                        Chat with customers and helpers securely within HunarWalaa.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <ChatHeader />

            {/* Safety notice */}
            {!safetyDismissed && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-100 flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-700 flex-1">
                        For your safety, keep all payments and communication within HunarWalaa.
                    </p>
                    <button
                        onClick={() => setSafetyDismissed(true)}
                        className="p-0.5 hover:bg-amber-100 rounded transition-colors flex-shrink-0"
                    >
                        <X className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                </div>
            )}

            <MessageList
                chatId={activeChat.id}
                currentUserId={currentUserId}
                onEdit={setEditingMessage}
                onDelete={handleDeleteMessage}
                onReply={setReplyingTo}
                onReact={handleReactToMessage}
            />

            <MessageInput
                chatId={activeChat.id}
                onSend={handleSendMessage}
                onEdit={handleEditMessage}
                disabled={sendMessageMutation.isPending || editMessageMutation.isPending}
            />
        </div>
    );
};

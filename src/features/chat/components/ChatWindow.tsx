'use client';

import { useChatStore } from '../store/chatStore';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useSendMessage, useEditMessage, useDeleteMessage, useMarkAsRead } from '../hooks/useChatMutations';
import { MessageCircle } from 'lucide-react';
import { useEffect } from 'react';
import type { Message } from '../types/chat.types';

interface ChatWindowProps {
    currentUserId: string; 
}

export const ChatWindow = ({ currentUserId }: ChatWindowProps) => {
    const activeChat = useChatStore((state) => state.activeChat);
    const setReplyingTo = useChatStore((state) => state.setReplyingTo);
    const setEditingMessage = useChatStore((state) => state.setEditingMessage);
    const clearEdit = useChatStore((state) => state.clearEdit);

    const sendMessageMutation = useSendMessage(activeChat?.id || '');
    const editMessageMutation = useEditMessage(activeChat?.id || '');
    const deleteMessageMutation = useDeleteMessage(activeChat?.id || '');
    const markAsReadMutation = useMarkAsRead();

    // Mark messages as read when chat is opened
    useEffect(() => {
        if (activeChat && activeChat.unreadCount > 0) {
            markAsReadMutation.mutate({ chatId: activeChat.id });
        }
    }, [activeChat?.id]);

    const handleSendMessage = (content: string, replyToId?: string, contentType: 'text' | 'location' = 'text', metadata?: any) => {
        if (!activeChat) return;

        sendMessageMutation.mutate({
            content,
            contentType,
            replyToMessageId: replyToId,
            metadata,
        });
    };

    const handleEditMessage = (messageId: string, content: string) => {
        if (!activeChat) return;

        editMessageMutation.mutate(
            { messageId, content },
            {
                onSuccess: () => {
                    clearEdit();
                },
            }
        );
    };

    const handleDeleteMessage = (messageId: string) => {
        if (!activeChat) return;

        if (confirm('Are you sure you want to delete this message?')) {
            deleteMessageMutation.mutate(messageId);
        }
    };

    const handleReplyToMessage = (message: Message) => {
        setReplyingTo(message);
    };

    const handleEditMessageClick = (message: Message) => {
        setEditingMessage(message);
    };

    if (!activeChat) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center px-4">
                <MessageCircle className="w-24 h-24 text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Messages</h2>
                <p className="text-gray-600 max-w-md">
                    Select a conversation from the list to start chatting, or find a helper to begin a new conversation.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white min-h-0">
            <ChatHeader currentUserId={currentUserId} />

            <div className="flex-1 flex flex-col min-h-0">
            <MessageList
                chatId={activeChat.id}
                currentUserId={currentUserId}
                onEdit={handleEditMessageClick}
                onDelete={handleDeleteMessage}
                onReply={handleReplyToMessage}
            />

            <MessageInput
                onSend={handleSendMessage}
                onEdit={handleEditMessage}
                disabled={sendMessageMutation.isPending || editMessageMutation.isPending}
            />
            </div>
        </div>
    );
};

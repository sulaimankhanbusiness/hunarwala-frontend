'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useChatStore } from '../store/chatStore';
import { Send, X, Paperclip, Smile } from 'lucide-react';
import type { Message } from '../types/chat.types';

interface MessageInputProps {
    onSend: (content: string, replyToId?: string) => void;
    onEdit?: (messageId: string, content: string) => void;
    disabled?: boolean;
}

export const MessageInput = ({ onSend, onEdit, disabled }: MessageInputProps) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const replyingTo = useChatStore((state) => state.replyingTo);
    const editingMessage = useChatStore((state) => state.editingMessage);
    const clearReply = useChatStore((state) => state.clearReply);
    const clearEdit = useChatStore((state) => state.clearEdit);

    // Set message content when editing
    useEffect(() => {
        if (editingMessage) {
            setMessage(editingMessage.content);
            textareaRef.current?.focus();
        }
    }, [editingMessage]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [message]);

    const handleSend = () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || disabled) return;

        if (editingMessage && onEdit) {
            onEdit(editingMessage.id, trimmedMessage);
            clearEdit();
        } else {
            onSend(trimmedMessage, replyingTo?.id);
            clearReply();
        }

        setMessage('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleCancel = () => {
        if (editingMessage) {
            clearEdit();
            setMessage('');
        } else if (replyingTo) {
            clearReply();
        }
    };

    return (
        <div className="border-t border-gray-200 bg-white">
            {/* Reply/Edit Preview */}
            {(replyingTo || editingMessage) && (
                <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-blue-600">
                            {editingMessage ? 'Editing message' : `Replying to ${replyingTo?.sender?.name || 'Unknown'}`}
                        </p>
                        <p className="text-sm text-gray-700 truncate">
                            {editingMessage ? editingMessage.content : replyingTo?.content}
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="ml-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            )}

            {/* Input Area */}
            <div className="px-4 py-3 flex items-end gap-2">
                {/* Attachment Button (placeholder) */}
                <button
                    disabled={disabled}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                    title="Attach file (coming soon)"
                >
                    <Paperclip className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        disabled={disabled}
                        rows={1}
                        className="w-full px-4 py-2 pr-10 bg-gray-100 border border-transparent rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ maxHeight: '120px' }}
                    />

                    {/* Emoji Button (placeholder) */}
                    <button
                        disabled={disabled}
                        className="absolute right-2 bottom-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                        title="Emoji (coming soon)"
                    >
                        <Smile className="w-5 h-5" />
                    </button>
                </div>

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

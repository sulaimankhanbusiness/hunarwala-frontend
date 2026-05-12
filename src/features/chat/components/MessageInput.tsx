import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useChatStore } from '../store/chatStore';
import { Send, X, Paperclip, MapPin, Loader2 } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';
import { getCurrentCoordinates, reverseGeocode } from '@/features/location/services/location.service';
import { socketService } from '@/lib/socket';
import { toast } from 'sonner';
import clsx from 'clsx';

interface MessageInputProps {
    chatId: string;
    onSend: (content: string, replyToId?: string, contentType?: 'text' | 'location', metadata?: any) => void;
    onEdit?: (messageId: string, content: string) => void;
    disabled?: boolean;
}

export const MessageInput = ({ chatId, onSend, onEdit, disabled }: MessageInputProps) => {
    const [message, setMessage] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTypingRef = useRef(false);

    const replyingTo = useChatStore((state) => state.replyingTo);
    const editingMessage = useChatStore((state) => state.editingMessage);
    const clearReply = useChatStore((state) => state.clearReply);
    const clearEdit = useChatStore((state) => state.clearEdit);

    // Set message content when editing
    useEffect(() => {
        if (editingMessage) {
            setMessage(editingMessage.content ?? '');
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

    const stopTyping = () => {
        if (isTypingRef.current) {
            isTypingRef.current = false;
            socketService.emit('typing:stop', { chatId });
        }
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        if (!isTypingRef.current) {
            isTypingRef.current = true;
            socketService.emit('typing:start', { chatId });
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(stopTyping, 2500);
    };

    const handleSend = () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || disabled) return;

        stopTyping();

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

    const handleEmojiSelect = (emoji: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = message.substring(0, start) + emoji + message.substring(end);

        setMessage(newText);

        // Return focus and set cursor position
        setTimeout(() => {
            textarea.focus();
            const newPos = start + emoji.length;
            textarea.setSelectionRange(newPos, newPos);
        }, 0);
    };

    const handleShareLocation = async () => {
        setIsLocating(true);
        try {
            const position = await getCurrentCoordinates();
            const { latitude, longitude } = position.coords;

            const geocodeData = await reverseGeocode(latitude, longitude);
            const address = geocodeData.display_name || geocodeData.address?.city || 'Selected Location';

            onSend(`Shared Location: ${address}`, replyingTo?.id, 'location', {
                lat: latitude,
                lng: longitude,
                address
            });

            toast.success('Location shared!');
        } catch (error: any) {
            console.error('Location error:', error);
            toast.error(error.message || 'Failed to get location');
        } finally {
            setIsLocating(false);
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
        <div className="border-t border-gray-100 bg-[#F8FAFC]/50 backdrop-blur-md pb-safe">
            {/* Reply/Edit Preview */}
            {(replyingTo || editingMessage) && (
                <div className="px-6 py-3 bg-indigo-50/80 backdrop-blur-sm border-b border-indigo-100 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-0.5">
                            {editingMessage ? 'Editing message' : `Replying to ${replyingTo?.sender?.fullName || 'Unknown'}`}
                        </p>
                        <p className="text-sm text-gray-700 truncate font-medium">
                            {editingMessage ? editingMessage.content : replyingTo?.content}
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="ml-4 p-1.5 hover:bg-indigo-100 rounded-full transition-colors group"
                    >
                        <X className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                    </button>
                </div>
            )}

            {/* Input Area */}
            <div className="px-6 py-4 flex items-end gap-3 max-w-6xl mx-auto w-full">
                <div className="flex items-center gap-1 mb-1">
                    {/* Attachment Button */}
                    <button
                        disabled={disabled}
                        className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all disabled:opacity-50"
                        title="Attach file (coming soon)"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>

                    {/* Location Button */}
                    <button
                        onClick={handleShareLocation}
                        disabled={disabled || isLocating}
                        className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all disabled:opacity-50"
                        title="Share location"
                    >
                        {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                    </button>
                </div>

                {/* Text Input */}
                <div className="flex-1 relative flex items-end group">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleMessageChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        disabled={disabled}
                        rows={1}
                        className="w-full px-5 py-3 pr-12 bg-white border border-gray-100 rounded-2xl shadow-sm resize-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-sm leading-relaxed placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ maxHeight: '150px' }}
                    />

                    <div className="absolute right-2 bottom-2">
                        <EmojiPicker onSelect={handleEmojiSelect} disabled={disabled} />
                    </div>
                </div>

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    className={clsx(
                        "p-3 rounded-2xl transition-all duration-300 shadow-lg mb-0.5",
                        message.trim() && !disabled
                            ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-indigo-200 hover:scale-105 active:scale-95"
                            : "bg-gray-100 text-gray-300 shadow-none grayscale"
                    )}
                >
                    <Send className={clsx("w-5 h-5", message.trim() && "animate-in fade-in zoom-in-75")} />
                </button>
            </div>
        </div>
    );
};

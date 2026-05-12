'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
    disabled?: boolean;
}

const COMMON_EMOJIS = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
    '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒',
    '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡',
    '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶',
    '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴',
    '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '👻', '💀', '☠️',
    '👽', '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '🖐️', '✋', '🖖', '👋', '✍️', '👏', '👐', '🙌'
];

export const EmojiPicker = ({ onSelect, disabled }: EmojiPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={pickerRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                title="Add emoji"
            >
                <Smile className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 bottom-full mb-4 p-4 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-2xl z-50 w-72 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200">
                    <div className="mb-3 px-1 flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Quick Emojis</span>
                        <Smile className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="grid grid-cols-8 gap-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                        {COMMON_EMOJIS.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                    onSelect(emoji);
                                    setIsOpen(false);
                                }}
                                className="w-7 h-7 flex items-center justify-center text-xl hover:bg-indigo-50 hover:scale-125 rounded-lg transition-all"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

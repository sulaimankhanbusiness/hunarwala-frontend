import type { Message, Chat } from '../types/chat.types';

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getMessagePreview = (message: Message): string => {
    if (message.isDeleted) {
        return 'This message was deleted';
    }

    if (message.contentType === 'image') {
        return '📷 Photo';
    }

    if (message.contentType === 'file') {
        return '📎 File';
    }

    if (message.contentType === 'video') {
        return '🎥 Video';
    }

    if (message.contentType === 'audio') {
        return '🎵 Audio';
    }

    return truncateText(message.content, 50);
};

export const getOtherUser = (chat: Chat) => {
    return chat.otherParticipant;
};

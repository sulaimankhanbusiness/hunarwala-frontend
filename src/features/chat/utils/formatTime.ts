export const formatMessageTime = (date: string | Date): string => {
    const messageDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        // Today - show time
        return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    if (diffDays === 1) {
        return 'Yesterday';
    }

    if (diffDays < 7) {
        return messageDate.toLocaleDateString('en-US', { weekday: 'long' });
    }

    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatChatListTime = (date: string | Date): string => {
    const messageDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    if (diffDays === 1) {
        return 'Yesterday';
    }

    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatFullTime = (date: string | Date): string => {
    const messageDate = typeof date === 'string' ? new Date(date) : date;
    return messageDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

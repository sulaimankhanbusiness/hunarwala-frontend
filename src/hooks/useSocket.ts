'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { socketService } from '@/lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { chatApi } from '@/features/chat/api/chat.api';
import { useNavBadgeStore } from '@/stores/useNavBadgeStore';
import { useChatStore } from '@/features/chat/store/chatStore';

export const useSocket = () => {
    const { token, isAuthenticated, user } = useAuthStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isAuthenticated && token) {
            console.log('[useSocket] Connecting...');
            socketService.connect(token);

            // Fetch initial unread message count so the badge is accurate on first load
            chatApi.getUnreadCount()
                .then(({ totalUnreadCount }) => {
                    useNavBadgeStore.getState().setUnreadMessages(totalUnreadCount);
                })
                .catch(() => { /* non-critical */ });

            // ── Message events ────────────────────────────────────────────────
            const handleNewMessage = (message: any) => {
                console.log('[Socket] New message received:', message);

                // Update messages list cache
                queryClient.setQueryData(['messages', message.chatId], (oldData: any) => {
                    if (!oldData) return oldData;

                    const allMessages = oldData.pages.flatMap((p: any) => p.items);
                    if (allMessages.find((m: any) => m.id === message.id)) return oldData;

                    // Pages are stored newest-first; MessageList reverses the flat array
                    // for display. Prepend to page 0 so the message lands at the bottom.
                    const newPages = [...oldData.pages];
                    newPages[0] = {
                        ...newPages[0],
                        items: [message, ...newPages[0].items],
                        total: (newPages[0].total || 0) + 1
                    };
                    return { ...oldData, pages: newPages };
                });

                // Update chat list cache (move to top, update last message + unread count)
                queryClient.setQueryData(['chats'], (oldData: any) => {
                    if (!oldData) return oldData;

                    let chatToMove: any = null;
                    const newPages = oldData.pages.map((page: any) => {
                        const filteredItems = page.items.filter((c: any) => {
                            if (c.id === message.chatId) {
                                chatToMove = {
                                    ...c,
                                    lastMessage: message,
                                    lastActivityAt: message.sentAt,
                                    unreadCount: (c.unreadCount || 0) + (message.senderUserId !== user?.id ? 1 : 0)
                                };
                                return false;
                            }
                            return true;
                        });
                        return { ...page, items: filteredItems };
                    });

                    if (chatToMove) {
                        newPages[0].items = [chatToMove, ...newPages[0].items];
                    } else {
                        queryClient.invalidateQueries({ queryKey: ['chats'] });
                    }

                    return { ...oldData, pages: newPages };
                });

                // Increment nav badge for messages not sent by the current user
                if (message.senderUserId !== user?.id) {
                    console.log('New message from', message);
                    useNavBadgeStore.getState().incrementMessages();
                    toast.info(`New message from ${message.sender?.fullName || 'Someone'}`);
                }
            };

            const handleChatUpdated = (data: any) => {
                console.log('[Socket] Chat updated:', data);
                queryClient.setQueryData(['chats'], (oldData: any) => {
                    if (!oldData) return oldData;

                    let chatToMove: any = null;
                    const newPages = oldData.pages.map((page: any) => {
                        const filteredItems = page.items.filter((c: any) => {
                            if (c.id === data.chatId) {
                                chatToMove = {
                                    ...c,
                                    lastMessage: data.lastMessage,
                                    unreadCount: data.unreadCount !== undefined ? data.unreadCount : c.unreadCount
                                };
                                return false;
                            }
                            return true;
                        });
                        return { ...page, items: filteredItems };
                    });

                    if (chatToMove) {
                        newPages[0].items = [chatToMove, ...newPages[0].items];
                    }

                    return { ...oldData, pages: newPages };
                });

                queryClient.invalidateQueries({ queryKey: ['chat', data.chatId] });
            };

            const handleMessagesRead = (data: any) => {
                console.log('[Socket] Messages read:', data);
                const { chatId, userId } = data;

                // Mark all messages in the chat as read
                queryClient.setQueryData(['messages', chatId], (oldData: any) => {
                    if (!oldData) return oldData;
                    const newPages = oldData.pages.map((page: any) => ({
                        ...page,
                        items: page.items.map((m: any) =>
                            m.senderUserId === userId
                                ? { ...m, status: 'read', readAt: new Date().toISOString() }
                                : m
                        )
                    }));
                    return { ...oldData, pages: newPages };
                });

                // Reset unread count for this chat in the chat list
                queryClient.setQueryData(['chats'], (oldData: any) => {
                    if (!oldData) return oldData;
                    const newPages = oldData.pages.map((page: any) => ({
                        ...page,
                        items: page.items.map((c: any) =>
                            c.id === chatId ? { ...c, unreadCount: 0 } : c
                        )
                    }));
                    return { ...oldData, pages: newPages };
                });

                // Recompute total unread from updated cache and sync to nav badge
                const chatsData = queryClient.getQueryData<any>(['chats']);
                if (chatsData) {
                    const total = chatsData.pages
                        .flatMap((p: any) => p.items)
                        .reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0);
                    useNavBadgeStore.getState().setUnreadMessages(total);
                }
            };

            const handleMessageDeleted = (data: any) => {
                console.log('[Socket] Message deleted:', data);
                const { chatId, messageId } = data;

                queryClient.setQueryData(['messages', chatId], (oldData: any) => {
                    if (!oldData) return oldData;
                    const newPages = oldData.pages.map((page: any) => ({
                        ...page,
                        items: page.items.map((m: any) =>
                            m.id === messageId
                                ? { ...m, isDeleted: true, content: 'This message was deleted' }
                                : m
                        )
                    }));
                    return { ...oldData, pages: newPages };
                });
            };

            const handleMessageEdited = (message: any) => {
                console.log('[Socket] Message edited:', message);
                queryClient.setQueryData(['messages', message.chatId], (oldData: any) => {
                    if (!oldData) return oldData;
                    const newPages = oldData.pages.map((page: any) => ({
                        ...page,
                        items: page.items.map((m: any) =>
                            m.id === message.id
                                ? { ...m, content: message.content, editedAt: message.editedAt }
                                : m
                        )
                    }));
                    return { ...oldData, pages: newPages };
                });
            };

            // ── Presence events ───────────────────────────────────────────────
            const handleUserOnline = ({ userId }: { userId: string }) => {
                useChatStore.getState().updateActiveChatOnlineStatus(userId, true);
                // Also update any cached chat list items for this user
                queryClient.setQueryData(['chats'], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            items: page.items.map((c: any) =>
                                c.otherParticipant?.id === userId
                                    ? { ...c, otherParticipant: { ...c.otherParticipant, isOnline: true } }
                                    : c
                            ),
                        })),
                    };
                });
            };

            const handleUserOffline = ({ userId }: { userId: string }) => {
                useChatStore.getState().updateActiveChatOnlineStatus(userId, false);
                queryClient.setQueryData(['chats'], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            items: page.items.map((c: any) =>
                                c.otherParticipant?.id === userId
                                    ? { ...c, otherParticipant: { ...c.otherParticipant, isOnline: false } }
                                    : c
                            ),
                        })),
                    };
                });
            };

            // ── Typing events ─────────────────────────────────────────────────
            const handleTypingStart = ({ chatId }: { chatId: string }) => {
                useChatStore.getState().setTyping(chatId, true);
            };

            const handleTypingStop = ({ chatId }: { chatId: string }) => {
                useChatStore.getState().setTyping(chatId, false);
            };

            // ── Booking events ────────────────────────────────────────────────
            const handleBookingUpdated = (data: any) => {
                console.log('[Socket] Booking updated:', data);
                queryClient.invalidateQueries({ queryKey: ['bookings'] });
                queryClient.invalidateQueries({ queryKey: ['booking', data.bookingId] });

                // Increment nav badge so user sees a count even if not on /bookings
                useNavBadgeStore.getState().incrementBookings();

                if (data.message) {
                    toast.success(data.message);
                }
            };

            // ── Wallet events ─────────────────────────────────────────────────
            const handleWalletUpdated = (data: any) => {
                console.log('[Socket] Wallet updated:', data);
                queryClient.invalidateQueries({ queryKey: ['wallet'] });

                const typeLabels: Record<string, string> = {
                    'topup_approved': 'Top-up approved!',
                    'topup_rejected': 'Top-up rejected.',
                    'manual_adjustment': 'Wallet adjusted by admin.',
                };

                if (data.type && typeLabels[data.type]) {
                    toast.success(typeLabels[data.type]);
                }
            };

            socketService.on('new_message', handleNewMessage);
            socketService.on('chat_updated', handleChatUpdated);
            socketService.on('messages_read', handleMessagesRead);
            socketService.on('message_deleted', handleMessageDeleted);
            socketService.on('message_edited', handleMessageEdited);
            socketService.on('booking_updated', handleBookingUpdated);
            socketService.on('wallet_updated', handleWalletUpdated);
            socketService.on('user:online', handleUserOnline);
            socketService.on('user:offline', handleUserOffline);
            socketService.on('typing:start', handleTypingStart);
            socketService.on('typing:stop', handleTypingStop);

            return () => {
                socketService.off('new_message', handleNewMessage);
                socketService.off('chat_updated', handleChatUpdated);
                socketService.off('messages_read', handleMessagesRead);
                socketService.off('message_deleted', handleMessageDeleted);
                socketService.off('message_edited', handleMessageEdited);
                socketService.off('booking_updated', handleBookingUpdated);
                socketService.off('wallet_updated', handleWalletUpdated);
                socketService.off('user:online', handleUserOnline);
                socketService.off('user:offline', handleUserOffline);
                socketService.off('typing:start', handleTypingStart);
                socketService.off('typing:stop', handleTypingStop);
            };
        } else {
            socketService.disconnect();
        }
    }, [isAuthenticated, token, queryClient]);

    return socketService;
};

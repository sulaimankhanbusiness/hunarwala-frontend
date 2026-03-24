'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { socketService } from '@/lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSocket = () => {
    const { token, isAuthenticated, user } = useAuthStore();
    const queryClient = useQueryClient();
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isAuthenticated && token) {
            console.log('[useSocket] Connecting...');
            socketService.connect(token);

            // Global listeners
            const handleNewMessage = (message: any) => {
                console.log('[Socket] New message received:', message);

                // 1. Update messages list cache
                queryClient.setQueryData(['messages', message.chatId], (oldData: any) => {
                    if (!oldData) return oldData;

                    // Check for duplicates
                    const allMessages = oldData.pages.flatMap((p: any) => p.items);
                    if (allMessages.find((m: any) => m.id === message.id)) return oldData;

                    const newPages = [...oldData.pages];
                    const lastPageIdx = newPages.length - 1;

                    newPages[lastPageIdx] = {
                        ...newPages[lastPageIdx],
                        items: [...newPages[lastPageIdx].items, message],
                        total: (newPages[lastPageIdx].total || 0) + 1
                    };

                    return { ...oldData, pages: newPages };
                });

                // 2. Update chat list cache (move to top and update last message)
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
                        // If not found, maybe invalidate to fetch it
                        queryClient.invalidateQueries({ queryKey: ['chats'] });
                    }

                    return { ...oldData, pages: newPages };
                });

                // Show notification if window is not focused or on a different chat
                if (message.senderUserId !== user?.id) {
                    toast.info(`New message from ${message.sender?.fullName || 'Professional'}`);
                }
            };

            const handleChatUpdated = (data: any) => {
                console.log('[Socket] Chat updated:', data);
                // Similar to handleNewMessage chat list logic
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

                // Update messages cache
                queryClient.setQueryData(['messages', chatId], (oldData: any) => {
                    if (!oldData) return oldData;
                    const newPages = oldData.pages.map((page: any) => ({
                        ...page,
                        items: page.items.map((m: any) =>
                            m.senderUserId === userId ? { ...m, status: 'read', readAt: new Date().toISOString() } : m
                        )
                    }));
                    return { ...oldData, pages: newPages };
                });

                // Update unread count in chat list
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
            };

            const handleMessageDeleted = (data: any) => {
                console.log('[Socket] Message deleted:', data);
                const { chatId, messageId } = data;

                queryClient.setQueryData(['messages', chatId], (oldData: any) => {
                    if (!oldData) return oldData;
                    const newPages = oldData.pages.map((page: any) => ({
                        ...page,
                        items: page.items.map((m: any) =>
                            m.id === messageId ? { ...m, isDeleted: true, content: 'This message was deleted' } : m
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
                            m.id === message.id ? { ...m, content: message.content, editedAt: message.editedAt } : m
                        )
                    }));
                    return { ...oldData, pages: newPages };
                });
            };

            const handleBookingUpdated = (data: any) => {
                console.log('[Socket] Booking updated:', data);
                queryClient.invalidateQueries({ queryKey: ['bookings'] });
                queryClient.invalidateQueries({ queryKey: ['booking', data.bookingId] });

                if (data.message) {
                    toast.success(data.message);
                }
            };

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
            socketService.on('booking_updated', handleBookingUpdated);
            socketService.on('wallet_updated', handleWalletUpdated);
            socketService.on('messages_read', handleMessagesRead);
            socketService.on('message_deleted', handleMessageDeleted);
            socketService.on('message_edited', handleMessageEdited);

            return () => {
                socketService.off('new_message', handleNewMessage);
                socketService.off('chat_updated', handleChatUpdated);
                socketService.off('booking_updated', handleBookingUpdated);
                socketService.off('wallet_updated', handleWalletUpdated);
                socketService.off('messages_read', handleMessagesRead);
                socketService.off('message_deleted', handleMessageDeleted);
                socketService.off('message_edited', handleMessageEdited);
            };
        } else {
            socketService.disconnect();
        }
    }, [isAuthenticated, token, queryClient]);

    return socketService;
};

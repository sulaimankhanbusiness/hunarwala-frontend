import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    timestamp: string;
    read: boolean;
    bookingId?: string;
    link?: string;
}

interface NotificationState {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],
            addNotification: (notification) => {
                const newNotification: Notification = {
                    ...notification,
                    id: Math.random().toString(36).substring(7),
                    timestamp: new Date().toISOString(),
                    read: false,
                };
                set((state) => ({
                    notifications: [newNotification, ...state.notifications].slice(0, 20), // Keep last 20
                }));
            },
            markAsRead: (id) => {
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                }));
            },
            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                }));
            },
            clearNotifications: () => {
                set({ notifications: [] });
            },
            getUnreadCount: () => {
                return get().notifications.filter((n) => !n.read).length;
            },
        }),
        {
            name: 'hunarwala-notifications',
        }
    )
);

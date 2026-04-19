import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavBadgeState {
  unreadMessages: number;
  newBookings: number;
  setUnreadMessages: (count: number) => void;
  incrementMessages: () => void;
  clearMessages: () => void;
  incrementBookings: () => void;
  clearBookings: () => void;
}

export const useNavBadgeStore = create<NavBadgeState>()(
  persist(
    (set, get) => ({
      unreadMessages: 0,
      newBookings: 0,
      setUnreadMessages: (count) => set({ unreadMessages: count }),
      incrementMessages: () => set({ unreadMessages: get().unreadMessages + 1 }),
      clearMessages: () => set({ unreadMessages: 0 }),
      incrementBookings: () => set({ newBookings: get().newBookings + 1 }),
      clearBookings: () => set({ newBookings: 0 }),
    }),
    { name: 'hunarwala-nav-badges' }
  )
);

'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import {
  initNotifications,
  getMessagingInstance,
  subscribeForeground,
  getCachedFcmToken,
  setCachedFcmToken,
} from '@/lib/firebase';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { FcmToast } from '@/components/FcmToast';
import api from '@/lib/api';

type NotifType = 'info' | 'success' | 'warning';

function resolveType(dataType?: string): NotifType {
  if (dataType === 'warning') return 'warning';
  if (dataType === 'success') return 'success';
  return 'info';
}

function showFcmToast(title: string, body: string, type: NotifType, link?: string) {
  toast.custom(
    (id) => FcmToast({ id, title, body, type, link }),
    { duration: 7000 },
  );
}

export function useNotifications(token: string | null) {
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    if (!token || typeof window === 'undefined') return;

    // cancelled flag ensures we don't subscribe after unmount
    let cancelled = false;
    let unsubscribeForeground: (() => void) | undefined;

    const setup = async () => {
      // ── 1. Get FCM token ──────────────────────────────────────────────────
      const fcmToken = await initNotifications();
      if (cancelled || !fcmToken) return;

      // ── 2. Register with backend (only when token changes) ────────────────
      const cached = getCachedFcmToken();
      if (fcmToken !== cached) {
        try {
          await api.patch('/users/fcm-token', { token: fcmToken });
          if (!cancelled) setCachedFcmToken(fcmToken);
          console.log('[FCM] Token registered with backend');
        } catch (e) {
          console.error('[FCM] Failed to register token with backend:', e);
        }
      } else {
        console.log('[FCM] Token unchanged — skipping backend update');
      }

      if (cancelled) return;

      // ── 3. Foreground handler ─────────────────────────────────────────────
      // onMessage fires when the app tab is open/visible.
      // Firebase does NOT auto-show OS notifications in foreground so we show
      // a custom in-app toast instead.
      const messaging = await getMessagingInstance();
      if (cancelled || !messaging) return;

      unsubscribeForeground = subscribeForeground(messaging, (title, body, data) => {
        const type = resolveType(data.type);
        addNotification({ title, message: body, type, bookingId: data.bookingId, link: data.link });
        showFcmToast(title, body, type, data.link);
      });
    };

    setup();

    // ── 4. Background handler via SW postMessage ──────────────────────────
    // Fires when a push arrives while the app tab is in the background.
    // The SW posts FCM_MESSAGE to any open clients instead of showing an
    // OS notification, so users get a smooth in-app experience on return.
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'FCM_MESSAGE') return;

      const {
        title = 'HunarWala',
        body  = '',
        data  = {} as Record<string, string>,
      } = event.data as { type: string; title: string; body: string; data: Record<string, string> };

      console.log('[FCM] Background message via SW:', { title, body, data });

      const type = resolveType(data.type);
      addNotification({ title, message: body, type, bookingId: data.bookingId, link: data.link });
      showFcmToast(title, body, type, data.link);
    };

    navigator.serviceWorker.addEventListener('message', handleSWMessage);

    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      unsubscribeForeground?.();
    };
  }, [token, addNotification]);
}

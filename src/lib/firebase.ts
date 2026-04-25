import { initializeApp, getApps } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  type Messaging,
} from 'firebase/messaging';

export const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = typeof window !== 'undefined'
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0])
  : (getApps()[0] ?? initializeApp(firebaseConfig));

let _messaging: Messaging | null = null;

export async function getMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;
  if (_messaging) return _messaging;
  const supported = await isSupported();
  if (!supported) {
    console.warn('[FCM] Not supported in this browser');
    return null;
  }
  _messaging = getMessaging(app);
  return _messaging;
}

const FCM_TOKEN_KEY = 'fcm-token';

/**
 * Steps:
 *  1. Check browser support
 *  2. Request notification permission
 *  3. Register/wait for service worker
 *  4. Get FCM token
 *
 * Returns the token string, or null on any failure.
 */
export async function initNotifications(): Promise<string | null> {
  const messaging = await getMessagingInstance();
  if (!messaging) return null;

  if (!('Notification' in window)) {
    console.warn('[FCM] Notifications API not available');
    return null;
  }

  if (Notification.permission === 'denied') {
    console.warn('[FCM] Notification permission denied');
    return null;
  }

  if (Notification.permission !== 'granted') {
    const result = await Notification.requestPermission();
    if (result !== 'granted') {
      console.warn('[FCM] Notification permission not granted:', result);
      return null;
    }
  }

  if (!('serviceWorker' in navigator)) {
    console.warn('[FCM] Service workers not supported');
    return null;
  }

  let registration: ServiceWorkerRegistration;
  try {
    // Pass config via query string — env vars are unavailable inside the SW
    const swUrl =
      '/firebase-messaging-sw.js?config=' +
      encodeURIComponent(JSON.stringify(firebaseConfig));

    registration = await navigator.serviceWorker.register(swUrl, { scope: '/' });
    // Wait until the SW is active before requesting the token
    await navigator.serviceWorker.ready;
    console.log('[FCM] Service worker registered and ready');
  } catch (e) {
    console.error('[FCM] Service worker registration failed:', e);
    return null;
  }

  try {
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;
    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
    if (!token) {
      console.warn('[FCM] getToken returned empty — check VAPID key and Firebase project settings');
      return null;
    }
    console.log('[FCM] Token obtained:', token.slice(0, 20) + '...');
    return token;
  } catch (e) {
    console.error('[FCM] getToken failed:', e);
    return null;
  }
}

/**
 * Subscribe to foreground messages (app tab is active/visible).
 * Firebase does NOT auto-show OS notifications in the foreground — this
 * handler is responsible for in-app toasts instead.
 *
 * Returns an unsubscribe function.
 */
export function subscribeForeground(
  messaging: Messaging,
  onPayload: (title: string, body: string, data: Record<string, string>) => void,
): () => void {
  return onMessage(messaging, (payload) => {
    console.log('[FCM] Foreground message received:', payload);
    const title = payload.notification?.title ?? 'HunarWalaa';
    const body  = payload.notification?.body  ?? '';
    const data  = (payload.data ?? {}) as Record<string, string>;
    onPayload(title, body, data);
  });
}

export function getCachedFcmToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(FCM_TOKEN_KEY);
}

export function setCachedFcmToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FCM_TOKEN_KEY, token);
}

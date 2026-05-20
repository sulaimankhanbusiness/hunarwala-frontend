importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// ---------------------------------------------------------------------------
// Config is injected at registration time via URL query string.
// Firebase config keys are intentionally public.
// ---------------------------------------------------------------------------
const firebaseConfig = (() => {
  try {
    const param = new URLSearchParams(location.search).get('config');
    return param ? JSON.parse(decodeURIComponent(param)) : {};
  } catch {
    return {};
  }
})();

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ---------------------------------------------------------------------------
// Lifecycle — take control immediately so SW updates apply without requiring
// the user to close all tabs.
// ---------------------------------------------------------------------------
self.addEventListener('install',  ()      => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// ---------------------------------------------------------------------------
// Map notification type → action buttons shown under the notification
// ---------------------------------------------------------------------------
function getActions(type) {
  const dismiss = { action: 'dismiss', title: 'Dismiss' };
  switch (type) {
    // ── Chat ──────────────────────────────────────────────────────────────
    case 'new_message':
    case 'chat_created':
    case 'message_edited':
      return [{ action: 'open', title: 'Open Chat' }, dismiss];

    // ── Booking — new request ─────────────────────────────────────────────
    case 'new_booking':
    case 'booking_request':
      return [{ action: 'open', title: 'View Request' }, dismiss];

    // ── Booking — state changes ───────────────────────────────────────────
    case 'booking_accepted':
    case 'booking_started':
    case 'booking_updated':
    case 'booking_cancelled':
    case 'booking_expired':
    case 'booking_disputed':
      return [{ action: 'open', title: 'View Booking' }, dismiss];

    // ── Booking — completion / review ─────────────────────────────────────
    case 'booking_completed':
    case 'booking_settled':
    case 'review_request':
    case 'job_completed':
      return [{ action: 'open', title: 'Rate Now' }, dismiss];

    // ── Wallet ────────────────────────────────────────────────────────────
    case 'topup_approved':
    case 'topup_rejected':
    case 'manual_adjustment':
    case 'wallet_updated':
      return [{ action: 'open', title: 'View Wallet' }, dismiss];

    // ── Helper profile ────────────────────────────────────────────────────
    case 'helper_approved':
    case 'helper_rejected':
    case 'helper_flagged':
    case 'helper_status':
      return [{ action: 'open', title: 'View Profile' }, dismiss];

    default:
      return [{ action: 'open', title: 'Open App' }, dismiss];
  }
}

// ---------------------------------------------------------------------------
// Resolve the deep-link for a notification based on its data payload
// ---------------------------------------------------------------------------
function resolveLink(data) {
  if (data.link)      return data.link;
  if (data.chatId)    return `/chats?chatId=${data.chatId}`;
  if (data.bookingId) return `/bookings`;
  const type = data.type || '';
  if (type.includes('wallet') || type === 'topup_approved' || type === 'topup_rejected' || type === 'manual_adjustment') return '/wallet';
  if (type === 'helper_approved' || type === 'helper_rejected' || type === 'helper_flagged' || type === 'helper_status') return '/profile';
  return '/';
}

// ---------------------------------------------------------------------------
// Resolve notification tag — each message gets a unique tag so the browser
// never silently replaces an existing notification (same-tag replacement
// suppresses sound/vibration even with renotify:true on most browsers).
// ---------------------------------------------------------------------------
function resolveTag(data) {
  const unique = data.messageId || data.id || Date.now();
  if (data.chatId)    return `chat_${data.chatId}_${unique}`;
  if (data.bookingId) return `booking_${data.bookingId}_${unique}`;
  return `${data.type || 'hunarwala'}_${unique}`;
}

// ---------------------------------------------------------------------------
// Background message handler
//
// This fires ONLY when the app tab is closed or in a background tab.
// When the app is open/visible, Firebase delivers to the main thread via
// onMessage() — the SW does NOT receive it in that case.
//
// Strategy:
//   • Open tab visible  → postMessage so the page can show an in-app toast
//   • No open tabs      → show an OS notification
// ---------------------------------------------------------------------------
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || 'HunarWala';
  const body  = payload.notification?.body  || payload.data?.body  || '';
  const data  = payload.data || {};

  self.clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then((clients) => {
      const visibleClient = clients.find((c) => c.visibilityState === 'visible');

      if (visibleClient) {
        visibleClient.postMessage({ type: 'FCM_MESSAGE', title, body, data });
      } else if (clients.length > 0) {
        clients.forEach((c) => c.postMessage({ type: 'FCM_MESSAGE', title, body, data }));
      } else {
        // App is closed — show a rich OS notification
        const type = data.type || '';
        const link = resolveLink(data);

        const options = {
          body,
          icon:               data.icon || '/logo.png',
          badge:              '/badge-icon.png',
          image:              data.image || undefined,
          data:               { ...data, link },
          tag:                resolveTag(data),
          renotify:           true,
          requireInteraction: false,
          actions:            getActions(type),
        };

        self.registration.showNotification(title, options);
      }
    });
});

// ---------------------------------------------------------------------------
// Notification click — handle action buttons and default tap
// ---------------------------------------------------------------------------
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.link || '/chats';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        const match = clients.find((c) => 'focus' in c);
        if (match) {
          match.postMessage({ type: 'NAVIGATE', url });
          return match.focus();
        }
        return self.clients.openWindow(url);
      })
  );
});

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
  console.log('[FCM SW] Background message received:', payload);

  const title = payload.notification?.title || payload.data?.title || 'HunarWala';
  const body  = payload.notification?.body  || payload.data?.body  || '';
  const data  = payload.data || {};

  self.clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then((clients) => {
      const visibleClient = clients.find((c) => c.visibilityState === 'visible');

      if (visibleClient) {
        // App tab is open and focused — hand off to the page for in-app toast
        visibleClient.postMessage({ type: 'FCM_MESSAGE', title, body, data });
      } else if (clients.length > 0) {
        // App is open but in a background tab — post to all, page will handle it
        clients.forEach((c) => c.postMessage({ type: 'FCM_MESSAGE', title, body, data }));
      } else {
        // App is closed — show OS notification
        self.registration.showNotification(title, {
          body,
          icon:  '/logo.png',
          badge: '/logo.png',
          data:  { ...data, link: data.link || '/' },
        });
      }
    });
});

// ---------------------------------------------------------------------------
// Notification click — focus an existing window or open a new one
// ---------------------------------------------------------------------------
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.link || '/';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        const match = clients.find((c) => c.url.includes(url) && 'focus' in c);
        return match ? match.focus() : self.clients.openWindow(url);
      })
  );
});

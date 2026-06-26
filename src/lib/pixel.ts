declare global {
  interface Window {
    fbq: (type: string, event: string, data?: Record<string, unknown>) => void;
  }
}

export function fbEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', event, data);
}

'use client';

import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  useNotifications(token);
  return <>{children}</>;
}

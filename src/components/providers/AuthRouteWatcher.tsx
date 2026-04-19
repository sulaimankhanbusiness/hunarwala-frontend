'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

const PROTECTED_ROUTES = ['/wallet', '/bookings', '/chats'];

export const AuthRouteWatcher = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, _hasHydrated } = useAuthStore();

    useEffect(() => {
        // Wait for hydration before checking authentication
        if (!_hasHydrated) return;

        const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

        if (!isAuthenticated && isProtectedRoute) {
            router.push('/login');
        }
    }, [isAuthenticated, _hasHydrated, pathname, router]);

    return <>{children}</>;
};

'use client';

import { useSocket } from "@/hooks/useSocket";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    useSocket(); // Initialize the socket and listeners
    return <>{children}</>;
};

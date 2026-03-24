import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000';

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public connect(token: string) {
        if (this.socket?.connected) {
            // If already connected with the same token, don't reconnect
            if ((this.socket as any).auth?.token === token) return;
            this.disconnect();
        }

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('[Socket] Connected to server');
            // Re-register all listeners on reconnect
            this.listeners.forEach((fns, event) => {
                fns.forEach(fn => this.socket?.on(event, fn));
            });
        });

        this.socket.on('disconnect', (reason: any) => {
            console.log('[Socket] Disconnected:', reason);
        });

        this.socket.on('connect_error', (error: any) => {
            console.error('[Socket] Connection error:', error.message);
        });
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public on(event: string, fn: (...args: any[]) => void) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(fn);
        this.socket?.on(event, fn);
    }

    public off(event: string, fn: (...args: any[]) => void) {
        this.listeners.get(event)?.delete(fn);
        this.socket?.off(event, fn);
    }

    public emit(event: string, ...args: any[]) {
        this.socket?.emit(event, ...args);
    }

    public isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

export const socketService = SocketService.getInstance();

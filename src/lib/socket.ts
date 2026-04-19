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
            // Remove then re-add every listener to guarantee exactly-once registration.
            // Without the off() call, listeners added before the socket connected would
            // be registered a second time here, causing every event to fire twice.
            this.listeners.forEach((fns, event) => {
                fns.forEach(fn => {
                    this.socket?.off(event, fn);
                    this.socket?.on(event, fn);
                });
            });
        });

        this.socket.on('disconnect', (_reason: any) => { /* handled by reconnection logic */ });

        this.socket.on('connect_error', (_error: any) => { /* silent — socket retries automatically */ });
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

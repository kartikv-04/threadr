"use client";

import { useSocketManager } from "./useSocketManager";

export function SocketProvider({ children }: { children: React.ReactNode }) {
    useSocketManager();
    return <>{children}</>;
}

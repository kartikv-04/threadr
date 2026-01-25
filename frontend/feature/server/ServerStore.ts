import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ServerState = {
    activeServerId: string | null;
    activeServerName: string | null;

    // Action Fucntions
    setActiveServerId: (serverId: string | null, serverName?: string | null) => void;
    reset: () => void;
}

export const useServerStore = create<ServerState>()(
    persist(
        (set) => ({
            // Intial State 
            activeServerId: null,
            activeServerName: null,

            // Action Fucntions
            setActiveServerId: (serverId, serverName = null) =>
                set({ activeServerId: serverId, activeServerName: serverName }),

            reset: () => set({ activeServerId: null, activeServerName: null }),
        }),
        {
            name: 'server-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
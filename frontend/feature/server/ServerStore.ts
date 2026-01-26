import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ServerState = {
    activeServerId: string | null;
    activeServerName: string | null;
    activeRole: string[] | null;

    // Action Fucntions
    setActiveServerId: (serverId: string | null, serverName?: string | null, role?: string[] | null) => void;
    reset: () => void;
}

export const useServerStore = create<ServerState>()(
    persist(
        (set) => ({
            // Intial State 
            activeServerId: null,
            activeServerName: null,
            activeRole: null,

            // Action Fucntions
            setActiveServerId: (serverId, serverName = null, role = null) =>
                set({ activeServerId: serverId, activeServerName: serverName, activeRole: role }),

            reset: () => set({ activeServerId: null, activeServerName: null, activeRole: null }),
        }),
        {
            name: 'server-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
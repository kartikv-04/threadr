import { create } from "zustand";
import { persist } from "zustand/middleware";

type Server = {
    serverId: string;
    name: string;
    icon?: string;
};

type ServerState = {
    activeServerId: string | null;

    // Action Fucntions
    setActiveServerId: (serverId: string | null) => void;
}

export const useServerStore = create<ServerState>()((set) => ({
    // Intial State 
    activeServerId: null,

    // Action Fucntions
    setActiveServerId: (serverId: string | null) => set({ activeServerId: serverId }),
}))
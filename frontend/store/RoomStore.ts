import { create } from "zustand";

type RoomState = {
    activeRoomId: string | null;

    // Action Functions
    setActiveRoomId: (roomId: string | null) => void;
}

export const useRoomStore = create<RoomState>()((set) => ({
    // Initial State 
    activeRoomId: null,

    // Action Functions
    setActiveRoomId: (roomId: string | null) => set({ activeRoomId: roomId }),
}))
import { create } from "zustand";


type RoomState = {
    activeRoomId: string | null;

    // Action Fucntions
    setActiveRoomId: (roomId: string | null) => void;
}

export const useRoomStore = create<RoomState>()((set) => ({
    // Intial State 
    activeRoomId: null,

    // Action Fucntions
    setActiveRoomId: (roomId: string | null) => set({ activeRoomId: roomId }),
}))
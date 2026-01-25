import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type RoomState = {
    activeRoomId: string | null;
    activeRoomName: string | null;

    // Action Functions
    setActiveRoomId: (roomId: string | null, roomName?: string | null) => void;
    reset: () => void;
}

export const useRoomStore = create<RoomState>()(
    persist(
        (set) => ({
            // Initial State 
            activeRoomId: null,
            activeRoomName: null,

            // Action Functions
            setActiveRoomId: (roomId: string | null, roomName: string | null = null) =>
                set({ activeRoomId: roomId, activeRoomName: roomName }),

            reset: () => set({ activeRoomId: null, activeRoomName: null }),
        }),
        {
            name: 'room-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
    userId: string | null;
    _hasHydrated: boolean;

    // Action Functions
    login: (token: string, id: string) => void;
    logout: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial State Values
            accessToken: null,
            isAuthenticated: false,
            userId: null,
            _hasHydrated: false,


            // Login function - just update state
            login: (token, id) => set({
                accessToken: token,
                userId: id,
                isAuthenticated: true
            }),

            // Logout function - just clear state (used by interceptor)
            logout: () => set({
                accessToken: null,
                userId: null,
                isAuthenticated: false
            }),

            // Helper to update hdration state
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'auth-storage', // key in localStorage
            storage: createJSONStorage(() => localStorage),

            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);
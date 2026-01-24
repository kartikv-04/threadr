import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";

interface AuthState {
    accessToken: string | null;
    userId: string | null;
    _hasHydrated: boolean;

    // Action Functions
    login: (token: string, userId: string) => void;
    logout: () => void;
    logoutWithAPI: () => Promise<void>;
    setHasHydrated : (state : boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial State Values
            accessToken: null,
            userId: null,
            _hasHydrated: false,


            // Login function - just update state
            login: (token, userId) => set({ accessToken: token, userId }),

            // Logout function - just clear state (used by interceptor)
            logout: () => set({ accessToken: null, userId: null }),

            // Helper to update hdration state
            setHasHydrated: (state) => set({ _hasHydrated: state }),

            // Logout with API call - clears cookie on backend
            logoutWithAPI: async () => {
                try {
                    await axios.post(
                        `${process.env.NEXT_BACKEND_URL}/api/v1/u/logout}`,
                        {},
                        { withCredentials: true }
                    );
                } catch (error) {
                    console.error('Logout API error:', error);
                }
                // Always clear local state regardless of API result
                set({
                    accessToken: null
                });
            }
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
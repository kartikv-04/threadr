import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

interface AuthState {
    isLoggedIn: boolean;
    accessToken: string | null;

    // Action Functions
    login: (token: string) => void;
    logout: () => void;
    logoutWithAPI: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial State Values
            isLoggedIn: false,
            accessToken: null,

            // Login function - just update state
            login: (token: string) => set({
                isLoggedIn: true,
                accessToken: token
            }),

            // Logout function - just clear state (used by interceptor)
            logout: () => set({
                isLoggedIn: false,
                accessToken: null
            }),

            // Logout with API call - clears cookie on backend
            logoutWithAPI: async () => {
                try {
                    await axios.post(
                        'http://localhost:5000/api/v1/u/logout',
                        {},
                        { withCredentials: true }
                    );
                } catch (error) {
                    console.error('Logout API error:', error);
                }
                // Always clear local state regardless of API result
                set({
                    isLoggedIn: false,
                    accessToken: null
                });
            }
        }),
        {
            name: 'auth-storage', // key in localStorage
        }
    )
);
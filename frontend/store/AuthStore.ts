import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    isLoggedIn: boolean,
    accessToken: string | null,

    // Action Function
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial State Values
            isLoggedIn: false,
            accessToken: null,

            // Login function
            login: (token: string) => set({
                isLoggedIn: true,
                accessToken: token
            }),

            // Logout Function
            logout: () => set({
                isLoggedIn: false,
                accessToken: null
            })
        }),
        {
            name: 'auth-storage', // key in localStorage
        }
    )
)
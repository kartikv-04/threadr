import {create} from "zustand";

interface AuthState {
    isLoggedIn : boolean,
    accessToken : string | null,

    // Actoin Function
    login : (token : string) => void;
    logout : () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Intial State Values
    isLoggedIn : false,
    accessToken : null,

    // Login function
    login : (token : string) => set({
        isLoggedIn : true,
        accessToken : token
    }),

    // Logout Function
    logout : () => set({
        isLoggedIn : false,
        accessToken : null
    })
}))
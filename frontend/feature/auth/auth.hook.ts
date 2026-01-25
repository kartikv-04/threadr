"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SignInPayload, SignInResponse, SignupPayload, SignupResponse } from "./auth.type";
import { getSignup, getSignin, logout } from "./auth.api";
import { useAuthStore } from "./AuthStore";
import { useRouter } from "next/navigation";
import { useServerStore } from "../server/ServerStore";
import { useRoomStore } from "@/store/RoomStore";

// Hook to Post Signin User
export const useSignIn = () => {
    let loginUser = useAuthStore((state) => state.login);

    const mutation = useMutation({
        mutationFn: (data: SignInPayload) => getSignin(data),
        onSuccess: (res: SignInResponse) => {
            useServerStore.getState().reset();
            useRoomStore.getState().reset();
            loginUser(res.data.user.accessToken, res.data.user.id)
        },
        onError: (error) => console.log("error while signin user", error)
    })
    return mutation;
};

// Hook to Post Signup User
export const useSignup = () => {
    let loginUser = useAuthStore((state) => state.login);

    const mutation = useMutation({
        mutationFn: (data: SignupPayload) => getSignup(data),
        onSuccess: (res: SignupResponse) => {
            useServerStore.getState().reset();
            useRoomStore.getState().reset();
            loginUser(res.data.user.accessToken, res.data.user.id)
        },
        onError: (error) => console.log("error while signin user", error)
    });
    return mutation;
};

export const useLogout = () => {
    const logoutUser = useAuthStore((state) => state.logout);
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            useServerStore.getState().reset();
            useRoomStore.getState().reset();
            logoutUser();
            queryClient.clear();
            router.push("/login");
        },
    });
};
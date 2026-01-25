"use client";
import { useMutation } from "@tanstack/react-query";
import { SignInPayload, SignInResponse, SignupPayload, SignupResponse } from "./auth.type";
import { getSignup, getSignin } from "./auth.api";
import { useAuthStore } from "./AuthStore";

// Hook to Post Signin User
export const useSignIn =  () => {
    let loginUser  = useAuthStore((state) => state.login);

    const mutation = useMutation({
        mutationFn : (data : SignInPayload) => getSignin(data),
        onSuccess : (res : SignInResponse) => {
            loginUser(res.data.user.accessToken, res.data.user.id)
        },
        onError : (error) => console.log("error while signin user", error)
    })
    return mutation;
};

// Hook to Post Signup User
export const useSignup =  () => {
    let loginUser  = useAuthStore((state) => state.login);

    const mutation = useMutation({
        mutationFn : (data : SignupPayload) => getSignup(data),
        onSuccess : (res : SignupResponse) => {
            loginUser(res.data.user.accessToken, res.data.user.id)
        },
        onError : (error) => console.log("error while signin user", error)
    });
    return mutation;
};
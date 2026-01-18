"use client";
import { useMutation } from "@tanstack/react-query";
import { SignInPayload } from "./type";
import { getSignup } from "./api";

// Hook to Post Signup User
export const useSignIn =  () => {
    const mutation = useMutation({
        mutationFn : (data : SignInPayload) => getSignup(data)
    });
    return mutation;
};
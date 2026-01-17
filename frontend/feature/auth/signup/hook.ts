"use client";
import { useMutation } from "@tanstack/react-query";
import { SignupPayload } from "./type";
import { getSignup } from "./api";

// Hook to Post Signup User
export const useSignup =  () => {
    const mutation = useMutation({
        mutationFn : (data : SignupPayload) => getSignup(data)
    });
    return mutation;
};
import { api } from "@/lib/api";
import { SignupPayload, 
        SignupResponse,
        SignInPayload,
        SignInResponse 
    } from "./auth.type";

export const getSignup = async(data : SignupPayload) : Promise<SignupResponse>=> {
    const res = await api.post("/auth/signup", data);
    return res.data;
}

export const getSignin = async(data : SignInPayload) : Promise<SignInResponse>=> {
    const res = await api.post("/auth/signin", data);
    return res.data;
}
import { api } from "@/lib/api";
import { SignInPayload, SignInResponse } from "./type";

export const getSignup = async(data : SignInPayload) : Promise<SignInResponse>=> {
    const res = await api.post("/auth/signin", data);
    return res.data;
}
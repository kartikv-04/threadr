import {api} from "../../lib/api";
import { SignupPayload, SignupResponse } from "./types";

export const getSignup = async(data : SignupPayload) : Promise<SignupResponse>=> {
    const res = await api.post("/auth/signup", data);
    return res.data;
}
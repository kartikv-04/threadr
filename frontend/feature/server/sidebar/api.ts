import { api } from "../../../lib/api";
import { GetServerResponse, CreateServerRequest, NewServerResponse } from "./type";

export const getServer = async (): Promise<GetServerResponse> => {
    try {
        const res = await api.get("/s/");
        // Backend returns: { success, message, data: [...servers] }
        return { server: res.data.data || [] };
    } catch (error: any) {
        // If 404 (no servers found), return empty array instead of throwing
        if (error?.response?.status === 404) {
            return { server: [] };
        }
        throw error;
    }
}

export const createServer = async (data : CreateServerRequest): Promise<NewServerResponse> => {
    try {
        const res = await api.post("/s/", data);
        // Backend returns: { success, message, data: [...servers] }
        return { serverId : res.data.serverId, serverName : res.data.serverName, createdBy : res.data.createdBy, createdAt : res.data.createdAt };
    } catch (error: any) {
        // If 404 (no servers found), return empty array instead of throwing
        if (error?.response?.status === 404) {
            return null as any;
        }
        throw error;
    }
}





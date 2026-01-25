import { api } from "../../lib/api";
import { GetServerResponse, CreateServerRequest, NewServerResponse } from "./server.type";

export const getServer = async (): Promise<GetServerResponse> => {
    try {
        const res = await api.get("/s/");
        const servers = res.data.data;

        // Backend returns: { success, message, data: [...servers] }
        return { server: servers || [] };
    } catch (error: any) {
        // If 404 (no servers found), return empty array instead of throwing
        if (error?.response?.status === 404) {
            return { server: [] };
        }
        throw error;
    }
}

export const createServer = async (payload: CreateServerRequest): Promise<NewServerResponse> => {

    const res = await api.post("/s/", payload);
    const server = res.data;

    // Backend returns: { success, message, data: [...servers] }
    return {
        serverId: server.serverId,
        serverName: server.serverName,
        createdBy: server.createdBy,
        createdAt: server.createdAt
    };



}





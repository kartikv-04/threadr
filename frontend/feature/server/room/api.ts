import { api } from "../../../lib/api";
import { GetRoomResponse, NewRoomRequest, NewRoomResponse } from "./type";

export const getRooms = async (serverId: string): Promise<GetRoomResponse> => {
    try {
        const result = await api.get(`/r/${serverId}`);
        // Backend returns: { success, message, data: { rooms: [...] } }
        return { rooms: result.data.data?.rooms || [] };
    } catch (error: any) {
        // If 404 (no rooms found), return empty array
        if (error?.response?.status === 404) {
            return { rooms: [] };
        }
        throw error;
    }
}

export const createRoom = async (data: NewRoomRequest): Promise<NewRoomResponse> => {
    try {
        const result = await api.post(`/r/${data.serverId}`, { roomName: data.roomName });
        // Backend returns: { success, message, data: {...} }
        return {
            roomId: result.data.data.roomId,
            roomName: result.data.data.roomName,
            serverId: result.data.data.serverId,
            createdAt: result.data.data.createdAt
        };
    } catch (error: any) {
        throw error;
    }
}

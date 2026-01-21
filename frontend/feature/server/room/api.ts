import { api } from "../../../lib/api";
import { GetRoomResponse, NewRoomRequest, NewRoomResponse } from "./type";

export const getRooms = async (): Promise<GetRoomResponse> => {
    try {
        const result = await api.get("/r/");
        // Backend returns: { success, message, data: [...rooms] }
        return { rooms: result.data.data || [] };
    } catch (error: any) {
        // If 404 (no rooms found), return empty array
        if (error?.response?.status === 404) {
            return { rooms: [] };
        }
        throw error;
    }
}

export const creatRooms = async (data: NewRoomRequest): Promise<NewRoomResponse> => {
    try {
        const result = await api.post("/r/", data);
        // Backend returns: { success, message, data: [...rooms] }
        return {
            roomId: result.data.roomId,
            roomName: result.data.roomName,
            serverId: result.data.serverId,
            createdAt: result.data.createdAt || []
    };
} catch (error: any) {
    // If 404 (no rooms found), return empty array
    if (error?.response?.status === 404) {
        return null as any;
    }
    throw error;
}
}



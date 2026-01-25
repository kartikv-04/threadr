import { api } from "../../lib/api";
import { 
  GetRoomResponse, 
  NewRoomRequest, 
  NewRoomResponse, 
  GenerateInviteResponse, 
  GetInviteInfoResponse, 
  JoinServerRequest 
} from "./type";

//  Get Rooms
export const getRooms = async (serverId: string): Promise<GetRoomResponse> => {
    try {
        const { data } = await api.get(`/r/${serverId}`);

        // Optional Chaining (?.) prevents crash if data.data is null
        return { rooms: data.data?.rooms || [] };
    } catch (error: any) {
        if (error?.response?.status === 404) {
            return { rooms: [] };
        }
        throw error;
    }
}

// Create Room
export const createRoom = async (payload: NewRoomRequest): Promise<NewRoomResponse> => {

    const { data } = await api.post(`/r/${payload.serverId}`, { 
        roomName: payload.roomName 
    });
    
    const room = data.data;

    return {
        roomId: room.roomId,
        roomName: room.roomName,
        serverId: room.serverId,
        createdAt: room.createdAt
    };
}

// Generate Invite Link
export const generateInvite = async (serverId: string): Promise<GenerateInviteResponse> => {
    const { data } = await api.post(`/s/${serverId}/invite`);
    return data.data; 
}

//  Get Invite Info (Preview before joining)
export const getInviteInfo = async (code: string): Promise<GetInviteInfoResponse> => {
    const { data } = await api.get(`/invite/${code}`);
    return data.data;
}

// Join Server via Invite
export const joinServer = async (payload: JoinServerRequest): Promise<{ serverId: string }> => {
    const { data } = await api.post(`/invite/join`, payload);
    return data.data;
}
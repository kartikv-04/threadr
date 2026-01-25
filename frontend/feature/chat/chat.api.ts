import { api } from "../../lib/api";
import {
    SendMessageRequest,
    SendMessageResponse,
    GetMessagesRequest,
    GetMessagesResponse
} from "./chat.type";

// Send a message to a room
export const sendMessage = async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const res = await api.post(`/rooms/${data.roomId}/messages`, {
        content: data.content,
        serverId: data.serverId // Pass in body as per REST refactor
    });
    // Backend returns: { success, message, data: {...} }
    return res.data.data;
};

// Get messages from a room with pagination
export const getMessages = async (payload: GetMessagesRequest): Promise<GetMessagesResponse> => {
    try {
        const { data } = await api.get(`/rooms/${payload.roomId}/messages`, {

            params: {
                page: payload.page,
                limit: payload.limit,
                serverId: payload.serverId // Pass in query
            }
        });
        // Backend returns: { success, message, data: [...messages] }
        return { messages: data.data || [] };
    } catch (error: any) {
        // If 404 (no messages found), return empty array
        if (error?.response?.status === 404) {
            return { messages: [] };
        }
        throw error;
    }
};

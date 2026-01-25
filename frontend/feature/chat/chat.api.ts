import { api } from "../../lib/api";
import {
    SendMessageRequest,
    SendMessageResponse,
    GetMessagesRequest,
    GetMessagesResponse
} from "./chat.type";

// Send a message to a room
export const sendMessage = async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const res = await api.post(`/m/${data.serverId}/${data.roomId}`, {
        content: data.content
    });
    // Backend returns: { success, message, data: {...} }
    return res.data.data;
};

// Get messages from a room with pagination
export const getMessages = async (payload: GetMessagesRequest): Promise<GetMessagesResponse> => {
    try {
        const { data } = await api.get(`/m/${payload.serverId}/${payload.roomId}`, {

            params: {
                page: payload.page,
                limit: payload.limit
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

import { api } from "../../lib/api";
import {
    SendMessageRequest,
    SendMessageResponse,
    GetMessagesRequest,
    GetMessagesResponse
} from "./type";

// Send a message to a room
export const sendMessage = async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const res = await api.post(`/m/${data.serverId}/${data.roomId}`, {
        content: data.content
    });
    // Backend returns: { success, message, data: {...} }
    return res.data.data;
};

// Get messages from a room with pagination
export const getMessages = async (data: GetMessagesRequest): Promise<GetMessagesResponse> => {
    try {
        const params = new URLSearchParams();
        if (data.page) params.append('page', data.page.toString());
        if (data.limit) params.append('limit', data.limit.toString());

        const queryString = params.toString();
        const url = `/m/${data.serverId}/${data.roomId}${queryString ? `?${queryString}` : ''}`;

        const res = await api.get(url);
        // Backend returns: { success, message, data: [...messages] }
        return { messages: res.data.data || [] };
    } catch (error: any) {
        // If 404 (no messages found), return empty array
        if (error?.response?.status === 404) {
            return { messages: [] };
        }
        throw error;
    }
};

import { useQuery } from "@tanstack/react-query";
import { getMessages } from "./api";
import { useAuthStore } from "@/store/AuthStore";
import { SendMessageRequest } from "./type";
import { sendMessage as socketSendMessage } from "@/lib/socket";
import { useState } from "react";

// Hook to get messages for a room
export const useGetMessages = (serverId: string | null, roomId: string | null) => {
    const token = useAuthStore(state => state.accessToken);

    return useQuery({
        queryKey: ['messages', serverId, roomId],
        queryFn: () => getMessages({ serverId: serverId!, roomId: roomId! }),
        enabled: !!token && !!serverId && !!roomId,
    });
};

// Hook to send a message
export const useSendMessage = () => {
    const [isSending, setIsSending] = useState(false);

    const mutate = async (data: SendMessageRequest) => {
        setIsSending(true);
        try {
            // Fire-and-forget socket event
            socketSendMessage(data.serverId, data.roomId, data.content);
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsSending(false);
        }
    };

    return { mutate, isPending: isSending };
};

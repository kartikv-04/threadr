import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sendMessage, getMessages } from "./api";
import { useAuthStore } from "@/store/AuthStore";
import { SendMessageRequest } from "./type";

// Hook to get messages for a room
export const useGetMessages = (serverId: string | null, roomId: string | null) => {
    const token = useAuthStore(state => state.accessToken);

    return useQuery({
        queryKey: ['messages', serverId, roomId],
        queryFn: () => getMessages({ serverId: serverId!, roomId: roomId! }),
        enabled: !!token && !!serverId && !!roomId,
        refetchInterval: 5000, // Refetch every 5 seconds for new messages
    });
};

// Hook to send a message
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SendMessageRequest) => sendMessage(data),
        onSuccess: (_, variables) => {
            // Invalidate messages query to refetch after sending
            queryClient.invalidateQueries({
                queryKey: ['messages', variables.serverId, variables.roomId]
            });
        }
    });
};

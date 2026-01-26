import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "./chat.api";
import { useAuthStore } from "@/feature/auth/AuthStore";
import { SendMessageRequest } from "./chat.type";
import { socket } from "@/lib/socket"; // Import the socket instance directly

// 1. Get Messages (Upgraded to Infinite Scroll)
export const useChatScroll = (serverId: string | null, roomId: string | null) => {
    const token = useAuthStore(state => state.accessToken);

    return useInfiniteQuery({
        queryKey: ['messages', serverId, roomId],
        initialPageParam: 1, // Explicitly set start page

        queryFn: ({ pageParam = 1 }) => getMessages({
            serverId: serverId!,
            roomId: roomId!,
            page: pageParam as number,
            limit: 50
        }),

        getNextPageParam: (lastPage, allPages) => {
            return lastPage.messages.length === 50 ? allPages.length + 1 : undefined;
        },

        enabled: !!token && !!serverId && !!roomId,
        staleTime: Infinity, // History never changes, so cache it forever
    });
};

// 2. Send Message (Upgraded to Optimistic Updates)
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SendMessageRequest) => sendMessage(data),

        onError: (error) => {
            // console.error("Failed to send message:", error);
        }
    });
};
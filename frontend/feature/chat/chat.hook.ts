import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage as deleteMessageApi, editMessage as editMessageApi, getMessages, sendMessage } from "./chat.api";
import { useAuthStore } from "@/feature/auth/AuthStore";
import { DeleteMessageRequest, EditMessageRequest, GetMessagesResponse, Message, SendMessageRequest } from "./chat.type";
import { useMessageStore } from "./MessageStore";

const updateMessageInList = (messages: Message[], updatedMessage: Message) =>
    messages.map((message) =>
        message.messageId === updatedMessage.messageId
            ? { ...message, ...updatedMessage }
            : message
    );

const removeMessageFromList = (messages: Message[], messageId: string) =>
    messages.filter((message) => message.messageId !== messageId);

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
    return useMutation({
        mutationFn: (data: SendMessageRequest) => sendMessage(data),

        onError: () => {
        }
    });
};

// 3. Edit Messages
export const useEditMessage = (serverId: string, roomId: string) => {
    const queryClient = useQueryClient();
    const updateMessage = useMessageStore((state) => state.updateMessage);

    return useMutation({
        mutationFn: (data: EditMessageRequest) => editMessageApi(data),

        onSuccess: (updatedMessage) => {
            const normalizedMessage: Message = {
                ...updatedMessage,
                username: updatedMessage.username ?? "",
                roomId: updatedMessage.roomId ?? roomId,
                serverId: updatedMessage.serverId ?? serverId,
            };

            queryClient.setQueryData<InfiniteData<GetMessagesResponse>>(
                ["messages", serverId, roomId],
                (existing) => {
                    if (!existing) return existing;

                    return {
                        ...existing,
                        pages: existing.pages.map((page) => ({
                            ...page,
                            messages: updateMessageInList(page.messages, normalizedMessage),
                        })),
                    };
                }
            );

            updateMessage(normalizedMessage);
        },

        onError: () => {
        }
    });
};

export const useDeleteMessage = (serverId: string, roomId: string) => {
    const queryClient = useQueryClient();
    const removeMessage = useMessageStore((state) => state.removeMessage);

    return useMutation({
        mutationFn: (data: DeleteMessageRequest) => deleteMessageApi(data),

        onSuccess: ({ messageId }) => {
            queryClient.setQueryData<InfiniteData<GetMessagesResponse>>(
                ["messages", serverId, roomId],
                (existing) => {
                    if (!existing) return existing;

                    return {
                        ...existing,
                        pages: existing.pages.map((page) => ({
                            ...page,
                            messages: removeMessageFromList(page.messages, messageId),
                        })),
                    };
                }
            );

            removeMessage(messageId);
        },

        onError: () => {
        }
    });
};

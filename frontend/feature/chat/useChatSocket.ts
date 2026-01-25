import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMessageStore } from "@/feature/chat/MessageStore"; 
import { socket } from "@/lib/socket"; 
import { Message } from "@/feature/chat/chat.type";

export const useChatSocket = (serverId: string, roomId: string) => {
  const queryClient = useQueryClient();
  const { addMessage } = useMessageStore();

  useEffect(() => {
    if (!socket || !socket.connected) return;

    // 1. Join the Room
    socket.emit("join:room", roomId);

    // 2. Listen for incoming messages
    const handleNewMessage = (newMessage: Message) => {
      addMessage(newMessage);
      queryClient.invalidateQueries({
        queryKey: ["messages", serverId, roomId],
      });
    };

    socket.on("send:message:room", handleNewMessage);

    // 3. Cleanup on unmount or room switch
    return () => {
      socket.emit("leave:room", roomId);
      socket.off("send:message:room", handleNewMessage);
    };
  }, [serverId, roomId, addMessage, queryClient]);
};
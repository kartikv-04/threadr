import { useEffect } from "react";
import { useMessageStore } from "@/feature/chat/MessageStore"; 
import { socket } from "@/lib/socket"; 
import { Message } from "@/feature/chat/chat.type";

export const useChatSocket = (serverId: string, roomId: string) => {
  const { addMessage } = useMessageStore();

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const setupSocketListeners = () => {
      socket.emit("join:room", roomId);

      const handleNewMessage = (newMessage: Message) => {
        if (newMessage.roomId === roomId) {
          addMessage(newMessage);
        }
      };

      socket.on("send:message:room", handleNewMessage);

      return () => {
        socket.emit("leave:room", roomId);
        socket.off("send:message:room", handleNewMessage);
      };
    };

    let cleanup: (() => void) | undefined;
    if (socket.connected) {
      cleanup = setupSocketListeners();
    }

    const handleConnect = () => {
      if (cleanup) {
        cleanup();
      }
      cleanup = setupSocketListeners();
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
      if (cleanup) {
        cleanup();
      }
    };
  }, [roomId, addMessage]);
};
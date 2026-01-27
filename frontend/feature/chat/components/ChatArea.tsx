"use client";

import { useEffect, useMemo } from "react";
import { useChatScroll, useSendMessage } from "../chat.hook";
import { useChatSocket } from "../useChatSocket";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useMessageStore } from "@/feature/chat/MessageStore";

import { useAuthStore } from "@/feature/auth/AuthStore";
import { useUser } from "@/feature/auth/auth.hook";

interface ChatAreaProps {
  serverId: string;
  roomId: string;
  roomName: string;
}

export const ChatArea = ({
  serverId,
  roomId,
  roomName,
}: ChatAreaProps) => {
  const { userId } = useAuthStore();
  const { data: user } = useUser(userId);
  // 1. Fetch History (Infinite Scroll)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useChatScroll(serverId, roomId);

  // 2. Connect to Socket Room
  useChatSocket(serverId, roomId);

  // 3. Get Live Messages from Store
  const liveMessages = useMessageStore((state) => state.messages);
  const clearMessages = useMessageStore((state) => state.clearMessages);

  // 4. Send Message Hook
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  // Clear live buffer when switching rooms
  useEffect(() => {
    clearMessages();
  }, [roomId, clearMessages]);

  // 5. MERGE DATA: Combine React Query History + Zustand Live Buffer
  const formattedMessages = useMemo(() => {
    if (!data?.pages) return [...liveMessages];

    // Flatten pages: [[Msg1, Msg2], [Msg3, Msg4]] -> [Msg1, Msg2, Msg3, Msg4]
    const history = data.pages.flatMap((page) => page.messages) || [];

    // Combine and Sort 
    return [...history, ...liveMessages];
  }, [data, liveMessages]);

  const handleSendMessage = (content: string) => {
    sendMessage({ serverId, roomId, content });
  };

  if (status === "error") {
    return (
      <div className="flex-1 flex flex-col bg-neutral-950 items-center justify-center text-red-400">
        <p>Failed to load messages.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 h-full overflow-hidden">
      <ChatHeader roomName={roomName} />

      <MessageList
        messages={formattedMessages}
        isLoading={status === "pending"}
        currentUserId={userId || undefined}
        // Infinite Scroll Props
        loadMore={fetchNextPage}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
      />

      <div className="mt-auto border-t border-neutral-800/60 h-[68px] flex items-center">
        <div className="w-full">
          <MessageInput
            onSend={handleSendMessage}
            disabled={isSending}
            roomName={roomName}
          />
        </div>
      </div>
    </div>
  );
};


export default ChatArea;
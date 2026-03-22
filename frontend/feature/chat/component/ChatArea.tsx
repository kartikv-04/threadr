"use client";

import { useEffect, useMemo, useState } from "react";
import { useChatScroll, useDeleteMessage, useEditMessage, useSendMessage } from "../chat.hook";
import { useChatSocket } from "../useChatSocket";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useMessageStore } from "@/feature/chat/MessageStore";

import { useAuthStore } from "@/feature/auth/AuthStore";
import { useUser } from "@/feature/auth/user.hook";
import type { Message } from "../chat.type";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Trash2 } from "lucide-react";

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
  const { mutate: updateMessage, isPending: isEditing } = useEditMessage(serverId, roomId);
  const { mutate: removeMessage, isPending: isDeleting } = useDeleteMessage(serverId, roomId);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

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
    if (editingMessage) {
      updateMessage(
        {
          roomId,
          messageId: editingMessage.messageId,
          content,
        },
        {
          onSuccess: () => setEditingMessage(null),
        }
      );
      return;
    }

    sendMessage({ serverId, roomId, content });
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  const handleDeleteMessage = (message: Message) => {
    setMessageToDelete(message);
  };

  const handleConfirmDelete = () => {
    if (!messageToDelete) return;

    removeMessage(
      {
        roomId,
        messageId: messageToDelete.messageId,
      },
      {
        onSuccess: () => {
          if (editingMessage?.messageId === messageToDelete.messageId) {
            setEditingMessage(null);
          }
          setMessageToDelete(null);
        },
        onError: () => {
          setMessageToDelete(null);
        },
      }
    );
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setMessageToDelete(null);
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
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
      />

      <div className="mt-auto shrink-0 border-t border-neutral-800/60 bg-neutral-950">
        <div className="w-full">
          <MessageInput
            onSend={handleSendMessage}
            disabled={isSending || isEditing || isDeleting}
            roomName={roomName}
            editingMessage={editingMessage}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!messageToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete message?"
        description="Do you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        isPending={isDeleting}
        icon={<Trash2 size={22} />}
      />
    </div>
  );
};


export default ChatArea;

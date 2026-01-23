"use client";

import { useGetMessages, useSendMessage } from "../hook";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatAreaProps {
    serverId: string;
    roomId: string;
    roomName: string;
    currentUserId?: string;
}

const ChatArea = ({ serverId, roomId, roomName, currentUserId }: ChatAreaProps) => {
    const { data, isLoading, error } = useGetMessages(serverId, roomId);
    const { mutate: sendMessage, isPending: isSending } = useSendMessage();

    const handleSendMessage = (content: string) => {
        sendMessage({
            serverId,
            roomId,
            content
        });
    };

    // Error state
    if (error) {
        return (
            <div className="flex-1 flex flex-col bg-neutral-800">
                <ChatHeader roomName={roomName} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-400 mb-2">Failed to load messages</p>
                        <p className="text-neutral-500 text-sm">Please try again later</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-neutral-800">
            {/* Header */}
            <ChatHeader roomName={roomName} />

            {/* Messages */}
            <MessageList
                messages={data?.messages || []}
                isLoading={isLoading}
                currentUserId={currentUserId}
            />

            {/* Input */}
            <MessageInput
                onSend={handleSendMessage}
                disabled={isSending}
                roomName={roomName}
            />
        </div>
    );
};

export default ChatArea;

"use client";

import { useEffect, useRef } from "react";
import { Message } from "../type";
import MessageItem from "./MessageItem";

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    currentUserId?: string;
}

const MessageList = ({ messages, isLoading, currentUserId }: MessageListProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-neutral-600 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-neutral-500 text-sm">Loading messages...</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-2">
                        <span className="text-3xl">💬</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">No messages yet</h3>
                    <p className="text-neutral-400 text-sm max-w-xs">
                        Be the first to send a message in this room!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto scrollbar-hide py-4"
        >
            {/* Welcome message at top */}
            <div className="px-4 pb-6 mb-4 border-b border-neutral-800">
                <div className="w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center mb-4">
                    <span className="text-3xl">#</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                    Welcome to the room!
                </h2>
                <p className="text-neutral-400">
                    This is the start of the conversation.
                </p>
            </div>

            {/* Messages */}
            <div className="space-y-0.5">
                {messages.map((message, index) => {
                    // Check if we should show avatar (new author or time gap)
                    const prevMessage = messages[index - 1];
                    const showAvatar = !prevMessage ||
                        prevMessage.userId !== message.userId ||
                        (new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime()) > 5 * 60 * 1000; // 5 min gap

                    return (
                        <MessageItem
                            key={message.messageId}
                            message={message}
                            isOwn={message.userId === currentUserId}
                            showAvatar={showAvatar}
                        />
                    );
                })}
            </div>

            {/* Scroll anchor */}
            <div ref={bottomRef} />
        </div>
    );
};

export default MessageList;

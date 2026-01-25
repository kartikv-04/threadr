"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "../chat.type";
import MessageItem from "./MessageItem";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  currentUserId?: string;
  loadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  username?: string;
}

const MessageList = ({
  messages,
  isLoading,
  currentUserId,
  loadMore,
  hasMore,
  isLoadingMore,
  username,
}: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // State to track if  auto-scroll
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // 1. Auto-scroll logic
  useEffect(() => {
    // Only auto-scroll if  already near the bottom OR it's the first load
    if (shouldAutoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldAutoScroll]);

  // 2. Infinite Scroll Observer (Detect hitting the top)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          // Save current scroll height to restore position after loading
          const container = scrollContainerRef.current;
          if (container) {
             const currentScrollHeight = container.scrollHeight;
             
             loadMore();
             
          }
        }
      },
      { threshold: 1.0 }
    );

    if (topRef.current) {
      observer.observe(topRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  // 3. Handle user scroll to disable auto-scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // If user is near bottom (within 100px), enable auto-scroll
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-400">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto scrollbar-hide py-4 px-2 flex flex-col"
    >
      {/* Top Anchor for Infinite Scroll */}
      <div ref={topRef} className="h-4 w-full flex justify-center">
         {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />}
      </div>

      {/* Welcome Message (Only show if no more history to load) */}
      {!hasMore && (
        <div className="px-4 pb-6 mb-4 border-b border-neutral-800 mt-auto">
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
      )}

      {/* Messages List */}
      <div className="flex flex-col space-y-0.5 min-h-0">
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const showAvatar =
            !prevMessage ||
            prevMessage.userId !== message.userId ||
            new Date(message.createdAt).getTime() -
              new Date(prevMessage.createdAt).getTime() >
              5 * 60 * 1000;

          return (
            <MessageItem
              key={`${message.messageId}-${index}`} 
              message={message}
              isOwn={message.userId === currentUserId}
              showAvatar={showAvatar}
              username={username}
            />
          );
        })}
      </div>

      {/* Bottom Anchor */}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
};


export default MessageList;
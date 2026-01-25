"use client";

import { cn } from "@/lib/utils";
import { Message } from "../chat.type";

interface MessageItemProps {
  message: Message;
  isOwn?: boolean;
  showAvatar?: boolean;
}

// Format timestamp to readable time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Get initials from username
const getInitials = (username: string) => {
  return username.charAt(0).toUpperCase();
};

// Generate consistent color from username
const getAvatarColor = (username: string) => {
  const colors = [
    "from-red-500 to-orange-500",
    "from-orange-500 to-yellow-500",
    "from-green-500 to-emerald-500",
    "from-teal-500 to-cyan-500",
    "from-blue-500 to-indigo-500",
    "from-indigo-500 to-purple-500",
    "from-purple-500 to-pink-500",
    "from-pink-500 to-rose-500",
  ];
  const index = username.charCodeAt(0) % colors.length;
  return colors[index];
};

const MessageItem = ({
  message,
  isOwn = false,
  showAvatar = true,
}: MessageItemProps) => {
  return (
    <div
      className={cn(
        "group flex gap-4 py-1 px-4 hover:bg-neutral-800/30 transition-colors",
        "relative",
      )}
    >
      {/* Avatar */}
      {showAvatar ? (
        <div
          className={cn(
            "w-10 h-10 rounded-full flex-shrink-0",
            "bg-gradient-to-br flex items-center justify-center",
            "shadow-md",
            getAvatarColor(message.username),
          )}
        >
          <span className="text-white font-semibold text-sm">
            {getInitials(message.username)}
          </span>
        </div>
      ) : (
        <div className="w-10 flex-shrink-0" />
      )}

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header: Username + Timestamp */}
        {showAvatar && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span
              className={cn(
                "font-semibold text-sm hover:underline cursor-pointer",
                isOwn ? "text-indigo-400" : "text-white",
              )}
            >
              {message.username}
            </span>
            <span className="text-[11px] text-neutral-500">
              {formatTime(message.createdAt)}
            </span>
            {message.isEdited && (
              <span className="text-[10px] text-neutral-600">(edited)</span>
            )}
          </div>
        )}

        {/* Message Text */}
        <p className="text-neutral-200 text-[15px] leading-relaxed break-words">
          {message.content}
        </p>
      </div>

      {/* Hover Actions (placeholder for future) */}
      <div className="absolute right-4 top-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-0.5 bg-neutral-900 border border-neutral-700 rounded-md shadow-lg p-0.5">
          {/* Future: emoji react, edit, delete buttons */}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

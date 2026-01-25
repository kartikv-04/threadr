"use client";

import { cn } from "@/lib/utils";
import { Message } from "../chat.type";

interface MessageItemProps {
  message: Message;
  isOwn?: boolean;
  showAvatar?: boolean;
  username?: string; // The logged-in user's name
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getInitials = (username: string = "U") => username.charAt(0).toUpperCase();

const getAvatarColor = (username: string = "User") => {
  const name = username || "User";
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
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const MessageItem = ({
  message,
  isOwn = false,
  showAvatar = true,
  username,
}: MessageItemProps) => {
  // Use either the message username or the prop (fallback)
  const displayName = isOwn ? (username || message.username) : message.username;

  return (
    <div
      className={cn(
        "group flex gap-4 py-[2px] px-4 w-full transition-colors relative",
        // Discord uses a very subtle grey/white tint on hover
        "hover:bg-[#2e3035]/50", 
        !showAvatar && "mt-[-4px]" // Tighten spacing for consecutive messages
      )}
    >
      {/* Avatar Section */}
      <div className="flex-shrink-0 w-10">
        {showAvatar ? (
          <div
            className={cn(
              "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center shadow-md mt-[4px]",
              getAvatarColor(displayName)
            )}
          >
            <span className="text-white font-semibold text-sm">
              {getInitials(displayName)}
            </span>
          </div>
        ) : (
          /* Show time on hover when avatar is hidden (Discord style) */
          <div className="opacity-0 group-hover:opacity-100 text-[10px] text-neutral-500 text-center mt-[6px] transition-opacity">
             {new Date(message.createdAt).getHours()}:{new Date(message.createdAt).getMinutes()}
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {showAvatar && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span
              className={cn(
                "font-semibold text-[15px] hover:underline cursor-pointer",
                isOwn ? "text-indigo-400" : "text-white"
              )}
            >
              {displayName}
            </span>
            <span className="text-[11px] text-neutral-500 font-medium">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}

        <p className="text-[#DBDEE1] text-[15px] leading-relaxed break-words whitespace-pre-wrap">
          {message.content}
        </p>
      </div>

      {/* Hover Toolbar (Placeholder for Edit/Delete) */}
      <div className="absolute -top-4 right-4 opacity-0 group-hover:opacity-100 transition-all z-10">
        <div className="flex bg-[#2B2D31] border border-[#1E1F22] rounded-[4px] shadow-sm p-1">
           {/* Add your Edit/Delete icons here later */}
           <div className="w-6 h-6 hover:bg-neutral-700 rounded cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
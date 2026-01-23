"use client";

import { Hash, Users, Bell, Pin, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
    roomName: string;
}

const ChatHeader = ({ roomName }: ChatHeaderProps) => {
    return (
        <div className={cn(
            "flex items-center justify-between h-12 px-4",
            "bg-neutral-800 border-b border-neutral-900",
            "shadow-sm"
        )}>
            {/* Left side - Room info */}
            <div className="flex items-center gap-2">
                <Hash size={20} className="text-neutral-500" />
                <h1 className="font-semibold text-white">{roomName}</h1>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-1">
                <button
                    className="p-2 rounded hover:bg-neutral-700/50 text-neutral-400 hover:text-neutral-200 transition-colors"
                    title="Pinned messages"
                >
                    <Pin size={18} />
                </button>
                <button
                    className="p-2 rounded hover:bg-neutral-700/50 text-neutral-400 hover:text-neutral-200 transition-colors"
                    title="Notification settings"
                >
                    <Bell size={18} />
                </button>
                <button
                    className="p-2 rounded hover:bg-neutral-700/50 text-neutral-400 hover:text-neutral-200 transition-colors"
                    title="Member list"
                >
                    <Users size={18} />
                </button>

                {/* Search */}
                <div className="ml-2 relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className={cn(
                            "w-36 px-2 py-1 rounded",
                            "bg-neutral-900 text-sm text-neutral-300",
                            "placeholder-neutral-500",
                            "focus:outline-none focus:ring-1 focus:ring-neutral-600",
                            "transition-all focus:w-48"
                        )}
                    />
                    <Search size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;

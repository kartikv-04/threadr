"use client";

import { cn } from "@/lib/utils";
import { Hash, Volume2, ChevronDown, Plus, Settings } from "lucide-react";
import { useGetRooms } from "../hook";
import { useServerStore } from "@/store/ServerStore";
import { useState } from "react";

interface Room {
    roomId: string;
    roomName: string;
    serverId: string;
    type?: "text" | "voice";
}

interface RoomSidebarProps {
    serverName?: string;
}

interface ChannelCategoryProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

// Channel Category Component (collapsible)
const ChannelCategory = ({ title, children, defaultOpen = true }: ChannelCategoryProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 w-full px-2 py-1 text-xs font-semibold text-neutral-400 hover:text-neutral-200 uppercase tracking-wide"
            >
                <ChevronDown
                    size={12}
                    className={cn(
                        "transition-transform duration-200",
                        !isOpen && "-rotate-90"
                    )}
                />
                {title}
            </button>
            {isOpen && <div className="space-y-[2px]">{children}</div>}
        </div>
    );
};

// Individual Channel Item
interface ChannelItemProps {
    room: Room;
    isActive?: boolean;
    onClick?: () => void;
}

const ChannelItem = ({ room, isActive, onClick }: ChannelItemProps) => {
    const isVoice = room.type === "voice";

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 w-full px-2 py-1.5 mx-2 rounded text-sm",
                "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50",
                "transition-colors duration-100 group",
                isActive && "bg-neutral-700/50 text-white"
            )}
            style={{ width: "calc(100% - 16px)" }}
        >
            {isVoice ? (
                <Volume2 size={18} className="text-neutral-500 flex-shrink-0" />
            ) : (
                <Hash size={18} className="text-neutral-500 flex-shrink-0" />
            )}
            <span className="truncate">{room.roomName}</span>

            {/* Action icons on hover */}
            <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings size={14} className="text-neutral-500 hover:text-neutral-300" />
            </div>
        </button>
    );
};

// Main Room Sidebar Component
const RoomSidebar = ({ serverName = "Server" }: RoomSidebarProps) => {
    const { data, isPending, error } = useGetRooms();
    const { activeServerId } = useServerStore();
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

    // Filter rooms by active server
    const rooms: Room[] = (data?.rooms || []).filter(
        (room) => room.serverId === activeServerId
    );

    // Separate text and voice channels
    const textChannels = rooms.filter((r) => r.type !== "voice");
    const voiceChannels = rooms.filter((r) => r.type === "voice");

    return (
        <aside className="flex flex-col w-60 h-screen bg-neutral-900">
            {/* Server Header */}
            <div className="flex items-center justify-between h-12 px-4 border-b border-neutral-950 shadow-sm hover:bg-neutral-800/50 cursor-pointer transition-colors">
                <h2 className="font-semibold text-white truncate">{serverName}</h2>
                <ChevronDown size={18} className="text-neutral-400" />
            </div>

            {/* Channels List */}
            <div className="flex-1 overflow-y-auto py-3 scrollbar-hide">
                {isPending ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-red-400 text-sm text-center py-4">
                        Failed to load channels
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="text-neutral-500 text-sm text-center py-4">
                        No channels yet
                    </div>
                ) : (
                    <>
                        {/* Text Channels */}
                        {textChannels.length > 0 && (
                            <ChannelCategory title="Text Channels">
                                {textChannels.map((room) => (
                                    <ChannelItem
                                        key={room.roomId}
                                        room={room}
                                        isActive={activeRoomId === room.roomId}
                                        onClick={() => setActiveRoomId(room.roomId)}
                                    />
                                ))}
                            </ChannelCategory>
                        )}

                        {/* Voice Channels */}
                        {voiceChannels.length > 0 && (
                            <ChannelCategory title="Voice Channels">
                                {voiceChannels.map((room) => (
                                    <ChannelItem
                                        key={room.roomId}
                                        room={room}
                                        isActive={activeRoomId === room.roomId}
                                        onClick={() => setActiveRoomId(room.roomId)}
                                    />
                                ))}
                            </ChannelCategory>
                        )}

                        {/* If no type is specified, show all as text */}
                        {textChannels.length === 0 && voiceChannels.length === 0 && (
                            <ChannelCategory title="Channels">
                                {rooms.map((room) => (
                                    <ChannelItem
                                        key={room.roomId}
                                        room={room}
                                        isActive={activeRoomId === room.roomId}
                                        onClick={() => setActiveRoomId(room.roomId)}
                                    />
                                ))}
                            </ChannelCategory>
                        )}
                    </>
                )}
            </div>

            {/* User Panel (bottom) */}
            <div className="flex items-center gap-2 h-14 px-2 bg-neutral-950/50 border-t border-neutral-800">
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">U</span>
                </div>
                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">Username</p>
                    <p className="text-xs text-neutral-400 truncate">Online</p>
                </div>
            </div>
        </aside>
    );
};

export default RoomSidebar;

"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Hash, ChevronDown, Plus, Settings, X, Mic, Headphones, Cog } from "lucide-react";
import { useGetRooms} from "../hook";
import { useServerStore } from "@/store/ServerStore";
import { useRoomStore } from "@/store/RoomStore";
import { joinRoom } from "@/lib/socket";
import { useMemo } from "react";
import { CreateRoomModal } from "./CreateRoomModal";

interface Room {
    roomId: string;
    roomName: string;
    serverId: string;
}

interface RoomSidebarProps {
    serverName?: string;
}

// Room Item Component
interface RoomItemProps {
    room: Room;
    isActive?: boolean;
    onClick?: () => void;
}

const RoomItem = ({ room, isActive, onClick }: RoomItemProps) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 w-full px-2 py-1.5 mx-2 rounded-md text-sm",
                "text-neutral-400 hover:text-neutral-100",
                "transition-all duration-150 ease-out group",
                isActive
                    ? "bg-neutral-700/60 text-white"
                    : "hover:bg-neutral-800/60"
            )}
            style={{ width: "calc(100% - 16px)" }}
        >
            <Hash
                size={18}
                className={cn(
                    "flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"
                )}
            />
            <span className="truncate font-medium">{room.roomName}</span>

            {/* Action icons on hover */}
            <div className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-1 rounded hover:bg-neutral-600/50 cursor-pointer">
                    <Settings size={14} className="text-neutral-400 hover:text-neutral-200" />
                </div>
            </div>
        </button>
    );
};

// Rooms Section Header
interface RoomsSectionProps {
    onAddClick: () => void;
}

const RoomsSection = ({ onAddClick }: RoomsSectionProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex items-center justify-between w-full px-2 py-1.5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 hover:text-neutral-200 uppercase tracking-wider transition-colors"
            >
                <ChevronDown
                    size={12}
                    className={cn(
                        "transition-transform duration-200",
                        !isOpen && "-rotate-90"
                    )}
                />
                Rooms
            </button>
            <button
                onClick={onAddClick}
                className="p-0.5 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 transition-all"
                title="Create Room"
            >
                <Plus size={16} />
            </button>
        </div>
    );
};

// Main Room Sidebar Component
const RoomSidebar = ({ serverName = "Server" }: RoomSidebarProps) => {
    const { activeServerId } = useServerStore();
    const { activeRoomId, setActiveRoomId } = useRoomStore();
    const { data, isPending, error } = useGetRooms(activeServerId);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const rooms = useMemo(() => data?.rooms || [], [data?.rooms]);

    useEffect(()=> {
        if(!activeRoomId) return ;

        console.log("Joining room", activeRoomId);
        joinRoom(activeRoomId);

        return () => {
            console.log("Leaviing room now", activeRoomId);
        }
    }, [activeRoomId]);

    const handleRoomSelect = useCallback((roomId : string) => {
        setActiveRoomId(roomId);
    }, [setActiveRoomId]);

    return (
        <>
            <aside className="flex flex-col w-60 min-w-[240px] h-screen bg-neutral-900">
                {/* Server Header */}
                <div className="flex items-center justify-between h-12 px-4 border-b border-neutral-950/80 shadow-md hover:bg-neutral-800/40 cursor-pointer transition-all duration-150">
                    <h2 className="font-bold text-white truncate">{serverName}</h2>
                    <ChevronDown size={18} className="text-neutral-400" />
                </div>

                {/* Rooms List */}
                <div className="flex-1 overflow-y-auto py-3 scrollbar-hide">
                    <RoomsSection onAddClick={() => setIsCreateModalOpen(true)} />

                    {isPending ? (
                        <div className="flex items-center justify-center py-6">
                            <div className="w-5 h-5 border-2 border-neutral-600 border-t-indigo-500 rounded-full animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-red-400 text-sm text-center py-4 px-4">
                            Failed to load rooms
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="text-neutral-500 text-xs text-center py-4 px-4">
                            No rooms yet. Click + to create one.
                        </div>
                    ) : (
                        <div className="space-y-0.5">
                            {rooms.map((room) => (
                                <RoomItem
                                    key={room.roomId}
                                    room={room}
                                    isActive={activeRoomId === room.roomId}
                                    onClick={()=> handleRoomSelect(room.roomId)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* User Panel (bottom) - Always visible */}
                <div className="flex items-center gap-2 h-[52px] px-2 bg-neutral-950/80 border-t border-neutral-800/50">
                    {/* User Avatar with status */}
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <span className="text-white text-sm font-semibold">U</span>
                        </div>
                        {/* Online status dot */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-neutral-950" />
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">Username</p>
                        <p className="text-[11px] text-neutral-400 truncate">Online</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-0.5">
                        <button className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 transition-all" title="Mute">
                            <Mic size={16} />
                        </button>
                        <button className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 transition-all" title="Deafen">
                            <Headphones size={16} />
                        </button>
                        <button className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 transition-all" title="Settings">
                            <Cog size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Create Room Modal */}
            {activeServerId && (
                <CreateRoomModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    serverId={activeServerId}
                />
            )}
        </>
    );
};

export default RoomSidebar;

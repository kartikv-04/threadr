"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
// Added UserPlus, LogOut, Trash for the menu
import {
  Hash,
  ChevronDown,
  Plus,
  Settings,
  X,
  Mic,
  Headphones,
  Cog,
  UserPlus,
  Trash,
  LogOut,
} from "lucide-react";
import { useGetRooms } from "../hook";
import { useServerStore } from "@/feature/server/ServerStore";
import { useRoomStore } from "@/store/RoomStore";
import { joinRoom } from "@/lib/socket";
import { CreateRoomModal } from "./CreateRoomModal";
import { InviteModal } from "./InviteModal";
import { useAuthStore } from "@/feature/auth/AuthStore";

interface Room {
  roomId: string;
  roomName: string;
  serverId: string;
}

interface RoomSidebarProps {
  serverName?: string;
}

// Room Item Component (No changes)
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
        isActive ? "bg-neutral-700/60 text-white" : "hover:bg-neutral-800/60",
      )}
      style={{ width: "calc(100% - 16px)" }}
    >
      <Hash
        size={18}
        className={cn(
          "flex-shrink-0 transition-colors",
          isActive
            ? "text-white"
            : "text-neutral-500 group-hover:text-neutral-300",
        )}
      />
      <span className="truncate font-medium">{room.roomName}</span>

      {/* Action icons on hover */}
      <div className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-1 rounded hover:bg-neutral-600/50 cursor-pointer">
          <Settings
            size={14}
            className="text-neutral-400 hover:text-neutral-200"
          />
        </div>
      </div>
    </button>
  );
};

// Rooms Section Header (No changes)
const RoomsSection = ({ onAddClick }: { onAddClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex items-center justify-between w-full px-2 py-1.5 mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 hover:text-neutral-200 uppercase tracking-wider transition-colors"
      >
        <ChevronDown
          size={12}
          className={cn(
            "transition-transform duration-200",
            !isOpen && "-rotate-90",
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

import { useUser } from "@/feature/auth/user.hook";

export const RoomSidebar = ({ serverName = "Server" }: RoomSidebarProps) => {
  const { activeServerId } = useServerStore();
  const { activeRoomId, setActiveRoomId } = useRoomStore();
  const { data, isPending, error } = useGetRooms(activeServerId);
  const { userId } = useAuthStore();
  const { data: user } = useUser(userId);

  // State for Modals & Menu
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <--- NEW STATE

  const rooms = useMemo(() => data?.rooms || [], [data?.rooms]);

  useEffect(() => {
    if (!activeRoomId) return;
    joinRoom(activeRoomId);
    return () => {
      // console.log("Leaving room", activeRoomId);
    };
  }, [activeRoomId]);

  const handleRoomSelect = useCallback(
    (roomId: string) => {
      setActiveRoomId(roomId);
    },
    [setActiveRoomId]
  );

  // Handler for Invite Click
  const handleInvite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop menu from closing immediately if needed
    setIsInviteModalOpen(true);
    setIsMenuOpen(false);
    // TODO: Open your Invite Modal here
  };

  return (
    <>
      <aside className="flex flex-col w-60 min-w-[240px] h-screen bg-neutral-900 relative">
        {/* ---------------- SERVER HEADER (DROPDOWN TRIGGER) ---------------- */}
        <div className="relative shadow-md">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between h-12 px-4 border-b border-neutral-950/80 hover:bg-neutral-800/40 cursor-pointer transition-all duration-150"
          >
            <h2 className="font-bold text-white truncate text-[15px]">
              {serverName}
            </h2>
            {/* Rotate Chevron when open */}
            <ChevronDown
              size={18}
              className={cn(
                "text-neutral-400 transition-transform",
                isMenuOpen && "rotate-180"
              )}
            />
          </button>

          {/* ---------------- DROPDOWN MENU ---------------- */}
          {isMenuOpen && (
            <>
              {/* Backdrop to close menu when clicking outside */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menu Items */}
              <div className="absolute top-14 left-2 right-2 z-50 bg-neutral-950 rounded-md border border-neutral-800 shadow-xl overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-100">
                {/* 1. Invite Option (Highlighted) */}
                <button
                  onClick={handleInvite}
                  className="w-full flex items-center justify-between px-2 py-2 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-sm transition-colors group cursor-pointer mb-1"
                >
                  <span className="font-medium text-sm">Invite People</span>
                  <UserPlus size={16} />
                </button>

                {/* Divider */}
                <div className="h-[1px] bg-neutral-800 my-1 mx-1" />

                {/* 2. Standard Settings */}
                <button className="w-full flex items-center justify-between px-2 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 rounded-sm transition-colors cursor-pointer">
                  <span className="font-medium text-sm">
                    Server Settings
                  </span>
                  <Settings size={16} />
                </button>

                <button className="w-full flex items-center justify-between px-2 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 rounded-sm transition-colors cursor-pointer">
                  <span className="font-medium text-sm">Create Channel</span>
                  <Plus size={16} />
                </button>

                {/* Divider */}
                <div className="h-[1px] bg-neutral-800 my-1 mx-1" />

                {/* 3. Danger Zone */}
                <button className="w-full flex items-center justify-between px-2 py-2 text-rose-500 hover:bg-rose-500 hover:text-white rounded-sm transition-colors cursor-pointer">
                  <span className="font-medium text-sm">Delete Server</span>
                  <Trash size={16} />
                </button>
              </div>
            </>
          )}
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
              No rooms yet.
            </div>
          ) : (
            <div className="space-y-0.5 mt-1">
              {rooms.map((room) => (
                <RoomItem
                  key={room.roomId}
                  room={room}
                  isActive={activeRoomId === room.roomId}
                  onClick={() => handleRoomSelect(room.roomId)}
                />
              ))}
            </div>
          )}
        </div>

        {/* User Panel (bottom) - Unchanged */}
        <div className="flex items-center gap-2 h-[52px] px-2 bg-neutral-950/80 border-t border-neutral-800/50">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-neutral-950" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.username}
            </p>
            <p className="text-[11px] text-neutral-400 truncate">Online</p>
          </div>
          <div className="flex items-center gap-0.5">
            <button className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 transition-all">
              <Mic size={16} />
            </button>
            <button className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 transition-all">
              <Headphones size={16} />
            </button>
            <button className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 transition-all">
              <Cog size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Modals */}
      {activeServerId && (
        <>
          <CreateRoomModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            serverId={activeServerId}
          />
          <InviteModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            serverId={activeServerId}
            serverName={serverName}
          />
        </>
      )}
    </>
  );
};



export default RoomSidebar;

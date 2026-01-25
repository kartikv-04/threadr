"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Hash,
  ChevronDown,
  Plus,
  Settings,
  Mic,
  Headphones,
  Cog,
  UserPlus,
  Trash,
  LogOut,
  User,
} from "lucide-react";
import { useGetRooms, useDeleteRoom, useCreateRoom } from "../hook";
import { useServerStore } from "@/feature/server/ServerStore";
import { useRoomStore } from "@/store/RoomStore";
import { joinRoom } from "@/lib/socket";
import { CreateRoomModal } from "./CreateRoomModal";
import { InviteModal } from "./InviteModal";
import { UserPanel } from "@/components/UserPanel";
import { useDeleteServer } from "@/feature/server/server.hook";
import { ConfirmModal } from "@/components/ConfirmModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Room {
  roomId: string;
  roomName: string;
  serverId: string;
}

// Room Item Component
interface RoomItemProps {
  room: Room;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: (roomId: string) => void;
}

const RoomItem = ({ room, isActive, onClick, onDelete }: RoomItemProps) => {
  return (
    <div className="group relative mx-2">
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm",
          "text-neutral-400 hover:text-neutral-100",
          "transition-all duration-150 ease-out",
          isActive ? "bg-neutral-700/60 text-white" : "hover:bg-neutral-800/60",
        )}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div className="p-1 rounded hover:bg-neutral-600/50 cursor-pointer">
                <Settings
                  size={14}
                  className="text-neutral-400 hover:text-neutral-200"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="start"
              className="w-48 bg-neutral-950 border-neutral-800 text-neutral-200"
            >
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:bg-red-800 focus:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(room.roomId);
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete Room</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </button>
    </div>
  );
};

// Rooms Section Header
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

export const RoomSidebar = () => {
  const { activeServerId, activeServerName, setActiveServerId } = useServerStore();
  const { activeRoomId, setActiveRoomId } = useRoomStore();
  const { data, isPending, error } = useGetRooms(activeServerId);

  const { mutate: deleteServer } = useDeleteServer();
  const { mutate: deleteRoom } = useDeleteRoom();

  // State for Modals & Menu
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Deletion Modal States
  const [isDeleteServerModalOpen, setIsDeleteServerModalOpen] = useState(false);
  const [isDeleteRoomModalOpen, setIsDeleteRoomModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<{ id: string, name: string } | null>(null);

  const rooms = useMemo(() => data?.rooms || [], [data?.rooms]);

  useEffect(() => {
    if (!activeRoomId) return;
    joinRoom(activeRoomId);
  }, [activeRoomId]);

  const handleRoomSelect = useCallback(
    (roomId: string, roomName: string) => {
      setActiveRoomId(roomId, roomName);
    },
    [setActiveRoomId]
  );

  const handleDeleteServer = () => {
    setIsDeleteServerModalOpen(true);
    setIsMenuOpen(false);
  };

  const confirmDeleteServer = () => {
    if (activeServerId) {
      deleteServer(activeServerId, {
        onSuccess: () => {
          setActiveServerId(null);
          setIsDeleteServerModalOpen(false);
        }
      });
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    const room = rooms.find(r => r.roomId === roomId);
    if (room) {
      setRoomToDelete({ id: room.roomId, name: room.roomName });
      setIsDeleteRoomModalOpen(true);
    }
  };

  const confirmDeleteRoom = () => {
    if (activeServerId && roomToDelete) {
      deleteRoom({ serverId: activeServerId, roomId: roomToDelete.id }, {
        onSuccess: () => {
          if (activeRoomId === roomToDelete.id) {
            setActiveRoomId(null);
          }
          setIsDeleteRoomModalOpen(false);
          setRoomToDelete(null);
        }
      });
    }
  };

  const handleInvite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInviteModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <aside className="flex flex-col w-60 min-w-[240px] h-screen bg-neutral-950 relative border-r border-neutral-800/60">
        {/* ---------------- SERVER HEADER (DROPDOWN TRIGGER) ---------------- */}
        <div className="relative shadow-md">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between h-12 px-4 border-b border-neutral-800/60 hover:bg-neutral-800/40 cursor-pointer transition-all duration-150"
          >
            <h2 className="font-bold text-white truncate text-[15px]">
              {activeServerName || "Server"}
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
                {/* 1. Invite Option */}
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

                <button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 rounded-sm transition-colors cursor-pointer"
                >
                  <span className="font-medium text-sm">Create Room</span>
                  <Plus size={16} />
                </button>

                {/* Divider */}
                <div className="h-[1px] bg-neutral-800 my-1 mx-1" />

                {/* 3. Danger Zone */}
                <button
                  onClick={handleDeleteServer}
                  className="w-full flex items-center justify-between px-2 py-2 text-red-600 hover:bg-red-900 hover:text-white rounded-sm transition-colors cursor-pointer"
                >
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
                  onClick={() => handleRoomSelect(room.roomId, room.roomName)}
                  onDelete={handleDeleteRoom}
                />
              ))}
            </div>
          )}
        </div>

        {/* User Panel (bottom) */}
        <div className="mt-auto pb-4">
          <UserPanel />
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
            serverName={activeServerName || "Server"}
          />
          <ConfirmModal
            isOpen={isDeleteServerModalOpen}
            onClose={() => setIsDeleteServerModalOpen(false)}
            onConfirm={confirmDeleteServer}
            title="Delete server"
            confirmText="Delete server"
            isPending={false} // Add isPending from hook if needed
            description={
              <>
                This will permanently delete <span className="font-semibold text-neutral-200">“{activeServerName || "this server"}”</span> and all of its data.<br />
                <span className="text-red-400 font-medium">This action cannot be undone.</span>
              </>
            }
          />
          <ConfirmModal
            isOpen={isDeleteRoomModalOpen}
            onClose={() => setIsDeleteRoomModalOpen(false)}
            onConfirm={confirmDeleteRoom}
            title="Delete room"
            confirmText="Delete room"
            isPending={false}
            description={
              <>
                Are you sure you want to delete <span className="text-red-400">#{roomToDelete?.name || "this room"}</span>?<br />
                This will remove all messages and history.
              </>
            }
          />
        </>
      )}
    </>
  );
};

export default RoomSidebar;

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ServerSidebar } from "@/feature/server/component/ServerSidebar";
import { RoomSidebar } from "@/feature/room/components/RoomSidebar";
import { ChatArea } from "@/feature/chat/component/ChatArea";
import { useServerStore } from "@/feature/server/ServerStore";
import { useRoomStore } from "@/store/RoomStore";
import { useAuthStore } from "@/feature/auth/AuthStore";
import { Mic, Headphones, Cog } from "lucide-react";
import { UserPanel } from "@/components/UserPanel";


// Home Sidebar - Shows when no server is selected
const HomeSidebar = () => {
  return (
    <aside className="flex flex-col w-60 min-w-[240px] h-screen bg-neutral-950">
      {/* Header */}
      <div className="flex items-center h-12 px-4 border-b border-neutral-800/60 shadow-md">
        <h2 className="font-bold text-white">Direct Messages</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-3 px-2">
        <p className="text-neutral-500 text-sm text-center mt-8">
          Select a server to view rooms
        </p>
      </div>

      {/* User Panel */}
      <div className="mt-auto pb-4">
        <UserPanel />
      </div>
    </aside>
  );
};

export default function Page() {
  const router = useRouter();
  const { activeServerId } = useServerStore();
  const { activeRoomId, activeRoomName, setActiveRoomId } = useRoomStore();
  const { accessToken, userId, _hasHydrated } = useAuthStore();

  // Reset room when server changes
  useEffect(() => {
    setActiveRoomId(null);
  }, [activeServerId, setActiveRoomId]);

  useEffect(() => {
    if (_hasHydrated && !accessToken) {
      router.push("/login");
    }
  }, [accessToken, _hasHydrated, router]);

  // Show loading while checking auth
  if (!_hasHydrated) {
    return (
      <div className="flex h-screen bg-neutral-950 items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-600 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!accessToken) return null;

  return (
    <div className="flex h-screen bg-neutral-950">
      {/* Server Sidebar (leftmost - server icons) */}
      <ServerSidebar />

      {/* Room Sidebar or Home Sidebar */}
      {activeServerId ? <RoomSidebar /> : <HomeSidebar />}

      {/* Main Content Area - Chat or Empty State */}
      {activeServerId && activeRoomId ? (
        <ChatArea
          serverId={activeServerId}
          roomId={activeRoomId}
          roomName={activeRoomName || "room"}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-neutral-950 text-white/40">
          {activeServerId ? (
            <p className="text-lg">Select a room to start chatting</p>
          ) : (
            <p className="text-lg">Select a server from the sidebar</p>
          )}
        </div>
      )}
    </div>
  );
}

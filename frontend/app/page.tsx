"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ServerSidebar } from "@/feature/server/sidebar";
import { RoomSidebar } from "@/feature/server/room";
import { ChatArea } from "@/feature/chat";
import { useServerStore } from "@/store/ServerStore";
import { useRoomStore } from "@/store/RoomStore";
import { useAuthStore } from "@/store/AuthStore";
import { Mic, Headphones, Cog } from "lucide-react";

// User Panel Component - Shows at bottom when no server selected
const UserPanel = () => {
    return (
        <div className="flex items-center gap-2 h-13 px-2 bg-neutral-950/80 border-t border-neutral-800/50">
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
    );
};

// Home Sidebar - Shows when no server is selected
const HomeSidebar = () => {
    return (
        <aside className="flex flex-col w-60 min-w-[240px] h-screen bg-neutral-900">
            {/* Header */}
            <div className="flex items-center h-12 px-4 border-b border-neutral-950/80 shadow-md">
                <h2 className="font-bold text-white">Direct Messages</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-3 px-2">
                <p className="text-neutral-500 text-sm text-center mt-8">
                    Select a server to view rooms
                </p>
            </div>

            {/* User Panel */}
            <UserPanel />
        </aside>
    );
};

export default function Page() {
    const router = useRouter();
    const { activeServerId } = useServerStore();
    const { activeRoomId } = useRoomStore();
    const { accessToken, userId, _hasHydrated } = useAuthStore();

    useEffect(() => {
        if ( _hasHydrated && !accessToken) {
            router.push("/login");
        }
    }, [accessToken, _hasHydrated, router]);

    // Show loading while checking auth
    if (!_hasHydrated) {
        return (
            <div className="flex h-screen bg-neutral-900 items-center justify-center">
                <div className="w-8 h-8 border-2 border-neutral-600 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    if(!accessToken) return null;




    return (
        <div className="flex h-screen bg-neutral-900">
            {/* Server Sidebar (leftmost - server icons) */}
            <ServerSidebar />

            {/* Room Sidebar or Home Sidebar */}
            {activeServerId ? (
                <RoomSidebar serverName="Server" />
            ) : (
                <HomeSidebar />
            )}

            {/* Main Content Area - Chat or Empty State */}
            {activeServerId && activeRoomId ? (
                <ChatArea
                    serverId={activeServerId}
                    roomId={activeRoomId}
                    roomName="general"
                    currentUserId={userId || undefined}
                />
            ) : (
                <div className="flex-1 flex items-center justify-center text-white/40">
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
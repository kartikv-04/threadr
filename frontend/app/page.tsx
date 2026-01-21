"use client";

import { ServerSidebar } from "@/feature/server/sidebar";
import { RoomSidebar } from "@/feature/server/room";
import { useServerStore } from "@/store/ServerStore";

export default function Page() {
    const { activeServerId } = useServerStore();

    return (
        <div className="flex h-screen bg-neutral-900">
            {/* Server Sidebar (leftmost - server icons) */}
            <ServerSidebar />

            {/* Room Sidebar (channels/rooms list) - show only when a server is selected */}
            {activeServerId && (
                <RoomSidebar serverName="Game Dev Hub" />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center text-white/50">
                {activeServerId ? (
                    <p>Select a channel to start chatting</p>
                ) : (
                    <p>Select a server from the sidebar</p>
                )}
            </div>
        </div>
    );
}
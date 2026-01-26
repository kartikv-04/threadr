"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { House, Plus } from "@phosphor-icons/react";
import ServerIcon from "./ServerIcon";
import ActionButton from "./ActionButton";
import CreateServerModal from "./CreateServerModal";
import { useGetServer } from "../server.hook";
import { useServerStore } from "@/feature/server/ServerStore";

interface Server {
  serverId: string;
  name: string;
  icon?: string;
  role: string[];
}

export const ServerSidebar = () => {
  const { data, isPending, error } = useGetServer();
  const { activeServerId, setActiveServerId } = useServerStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const servers: Server[] = data?.server || [];

  return (
    <>
      <aside className="flex flex-col items-center w-[72px] min-w-[72px] h-screen bg-neutral-950 pt-3 overflow-y-auto overflow-x-hidden scrollbar-hide border-r border-neutral-800/60">
        {/* Home Button */}
        <ActionButton
          icon={<House size={28} weight="fill" />}
          label="Direct Messages"
          onClick={() => setActiveServerId(null)}
          variant="default"
        />

        {/* Separator */}
        <div className="w-8 my-2">
          <Separator className="bg-neutral-800 h-[2px] rounded-full" />
        </div>

        {/* Server List */}
        <div className="flex flex-col gap-2 flex-1">
          {/* ... (servers code) */}
          {isPending ? (
            <div className="flex items-center justify-center w-12 h-12 mx-3">
              <div className="w-6 h-6 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-xs text-center px-2">
              Error loading
            </div>
          ) : servers.length === 0 ? (
            <div className="text-neutral-500 text-xs text-center px-2">
              No servers
            </div>
          ) : (
            servers.map((server) => (
              <ServerIcon
                key={server.serverId}
                server={{
                  id: server.serverId,
                  name: server.name,
                  imageUrl: server.icon,
                }}
                isActive={activeServerId === server.serverId}
                onClick={() => setActiveServerId(server.serverId, server.name, server.role)}
              />
            ))
          )}
        </div>

        <div className="mt-auto pb-4 w-full flex">
          <div className="flex items-center justify-center h-[52px] border-t border-neutral-800/60 pt-2">
            <ActionButton
              icon={<Plus size={24} weight="bold" />}
              label="Add a Server"
              variant="success"
              onClick={() => setIsCreateModalOpen(true)}
            />
          </div>
        </div>
      </aside>

      {/* Create Server Modal */}
      <CreateServerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default ServerSidebar;

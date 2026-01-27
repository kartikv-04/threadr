"use client";

import { cn } from "@/lib/utils";
import { Server } from "../server.type";

interface ServerIconProps {
  server: Server;
  isActive?: boolean;
  onClick?: () => void;
}

const ServerIcon = ({ server, isActive, onClick }: ServerIconProps) => {
  return (
    <div className="relative group flex items-center justify-center">
      {/* Active/Hover Indicator Pill */}
      <div
        className={cn(
          "absolute left-0 w-1 rounded-r-full transition-all duration-200",
          isActive ? "h-10 bg-white" : "h-0 group-hover:h-5 bg-white",
        )}
      />

      {/* Server Button */}
      <button
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-center w-12 h-12 mx-3 rounded-[24px] transition-all duration-300 overflow-hidden",
          "hover:rounded-[16px] bg-neutral-700 hover:bg-indigo-500",
          isActive && "rounded-[16px] bg-indigo-500",
          "group-hover:rounded-[16px]",
        )}
      >
        {server.imageUrl ? (
          <img
            src={server.imageUrl}
            alt={server.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-semibold text-lg">
            {server.name.charAt(0).toUpperCase()}
          </span>
        )}

        {/* Notification Badge */}
        {server.unreadCount && server.unreadCount > 0 && (
          <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-4 border-neutral-950">
            {server.unreadCount > 99 ? "99+" : server.unreadCount}
          </div>
        )}
      </button>

      {/* Tooltip */}
      <div className="absolute left-full ml-4 px-3 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
        {server.name}
        {/* Arrow */}
        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-neutral-900" />
      </div>
    </div>
  );
};

export default ServerIcon;

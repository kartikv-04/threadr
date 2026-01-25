"use client";

import { Mic, Headphones, Cog, LogOut, User, Settings } from "lucide-react";
import { useAuthStore } from "@/feature/auth/AuthStore";
import { useUser } from "@/feature/auth/user.hook";
import { useLogout } from "@/feature/auth/auth.hook";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserPanel = () => {
    const { userId } = useAuthStore();
    const { data: user } = useUser(userId);
    const { mutate: logout } = useLogout();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 h-[52px] px-2 bg-neutral-950 border-t border-neutral-800/60 cursor-pointer hover:bg-neutral-800/40 transition-colors">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <span className="text-white text-sm font-semibold">
                                {user?.username?.charAt(0).toUpperCase() || "U"}
                            </span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-neutral-950" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                            {user?.username || "Loading..."}
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
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="top"
                align="start"
                className="w-56 bg-neutral-950 border-neutral-800 text-neutral-200"
            >
                <DropdownMenuLabel className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-semibold">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                        </span>
                    </div>
                    <span className="font-semibold">{user?.username || "User"}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-neutral-800" />
                <DropdownMenuItem className="cursor-pointer focus:bg-neutral-800 focus:text-white">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-neutral-800 focus:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-neutral-800" />
                <DropdownMenuItem
                    className="cursor-pointer text-red-500 focus:bg-red-500 focus:text-white"
                    onClick={() => logout()}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

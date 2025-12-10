"use client";

import { useEffect, useState } from "react";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useChannelStore } from "@/store/channel.store";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import {
        Hash,
        LogOut,
        ChevronDown,
        MessageSquare,
        Mic,
        Headphones,
        MoreVertical,
        Pencil,
        Trash,
        Settings,
        Plus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
} from "@/components/ui/dialog";
import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
        Popover,
        PopoverContent,
        PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Sidebar() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const toggleInfoSidebar = useUIStore((state) => state.toggleInfoSidebar);

    const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
    const fetchWorkspaces = useWorkspaceStore((state) => state.fetchWorkspaces);
    const setCurrentWorkspace = useWorkspaceStore((state) => state.setCurrentWorkspace);

    const channels = useChannelStore((state) => state.channels);
    const currentChannel = useChannelStore((state) => state.currentChannel);
    const fetchChannels = useChannelStore((state) => state.fetchChannels);
    const setCurrentChannel = useChannelStore((state) => state.setCurrentChannel);

    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [renameValue, setRenameValue] = useState("");

    // Channel Action States
    const [channelToRename, setChannelToRename] = useState<any>(null);
    const [channelToDelete, setChannelToDelete] = useState<any>(null);
    const [channelRenameValue, setChannelRenameValue] = useState("");

    useEffect(() => {
        if (currentWorkspace) {
            setRenameValue(currentWorkspace.name);
        }
    }, [currentWorkspace]);

    const handleRename = async () => {
        if (!currentWorkspace || !renameValue.trim()) return;
        try {
            await api.patch(`/workspaces/${currentWorkspace._id}`, { name: renameValue });
            await fetchWorkspaces(); // Refresh list
            setIsRenameOpen(false);
        } catch (error) {

        }
    };

    const handleDelete = async () => {
        if (!currentWorkspace) return;
        try {
            await api.delete(`/workspaces/${currentWorkspace._id}`);
            await fetchWorkspaces();
            setCurrentWorkspace(null as any); // Clear current
            setIsDeleteOpen(false);
        } catch (error: any) {
            console.error("Failed to delete workspace:", error);
            alert(error.response?.data?.error || "Failed to delete workspace");
        }
    };

    const handleChannelRename = async () => {
        if (!channelToRename || !channelRenameValue.trim()) return;
        try {
            await api.patch(`/channels/${channelToRename._id}`, { name: channelRenameValue });
            if (currentWorkspace) await fetchChannels(currentWorkspace._id);
            setChannelToRename(null);
            setChannelRenameValue("");
        } catch (error) {

        }
    };

    const handleChannelDelete = async () => {
        if (!channelToDelete) return;
        try {
            await api.delete(`/channels/${channelToDelete._id}`);
            if (currentWorkspace) await fetchChannels(currentWorkspace._id);
            if (currentChannel?._id === channelToDelete._id) {
                setCurrentChannel(null as any);
            }
            setChannelToDelete(null);
        } catch (error) {

        }
    };

    const { getSocket } = require("@/lib/socket");

    // ... (existing state)

    // Socket: Join Workspace Room
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !currentWorkspace) return;

        if (!socket.connected) socket.connect();

        socket.emit("join-workspace", currentWorkspace._id);

        function onChannelNew(newChannel: any) {
            if (currentWorkspace && newChannel.workspace === currentWorkspace._id) {
                // We need to update the store. 
                // Since fetchChannels overwrites, we can just append or refetch.
                // Refetch is safer.
                fetchChannels(currentWorkspace._id);
            }
        }

        socket.on("channel:new", onChannelNew);

        return () => {
            socket.emit("leave-workspace", currentWorkspace._id);
            socket.off("channel:new", onChannelNew);
        };
    }, [currentWorkspace, fetchChannels]);

    // ... (existing handlers)



    useEffect(() => {
        if (currentWorkspace) {
            fetchChannels(currentWorkspace._id);
        }
    }, [currentWorkspace, fetchChannels]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950 text-zinc-400 border-r border-zinc-800">
            {/* Workspace Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-950 shadow-sm bg-zinc-900 flex-shrink-0">
                <div
                    onClick={toggleInfoSidebar}
                    className="flex-1 font-bold text-white truncate cursor-pointer hover:bg-zinc-800 p-2 -ml-2 rounded-md transition-all mr-2 border border-transparent hover:border-zinc-700"
                >
                    {currentWorkspace?.name || "Select Workspace"}
                </div>

                {currentWorkspace && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors outline-none">
                                <MoreVertical className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-zinc-200">
                            <DropdownMenuItem
                                onClick={() => setIsRenameOpen(true)}
                                className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Channel
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />

                            <DropdownMenuItem
                                onClick={() => setIsRenameOpen(true)}
                                className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Rename Workspace
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem
                                onClick={() => setIsDeleteOpen(true)}
                                className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-950/30 focus:bg-red-950/30 focus:text-red-300"
                            >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Workspace
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Rename Workspace Dialog */}
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-white">Rename Workspace</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Enter a new name for your workspace.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            placeholder="Workspace Name"
                            className="bg-zinc-950 border-zinc-800 text-white focus:border-primary"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleRename} className="bg-primary hover:bg-primary/90 text-white">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Workspace Alert */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Workspace</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            Are you sure you want to delete <span className="font-bold text-white">{currentWorkspace?.name}</span>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700 border-none">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Channel List */}
            <ScrollArea className="flex-1 px-2 py-4">
                {currentWorkspace ? (
                    <div className="space-y-4">
                        <div>
                            <div className="px-2 mb-2 flex items-center justify-between group">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                    Text Channels
                                </h3>
                            </div>
                            <div className="space-y-0.5">
                                {channels.map((channel) => (
                                    <div
                                        key={channel._id}
                                        className={`group w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-all duration-200 ${currentChannel?._id === channel._id
                                            ? "bg-zinc-800 text-white"
                                            : "hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-300"
                                            }`}
                                    >
                                        <button
                                            onClick={() => setCurrentChannel(channel)}
                                            className="flex items-center gap-2 flex-1 overflow-hidden outline-none"
                                        >
                                            <Hash className={`h-4 w-4 shrink-0 ${currentChannel?._id === channel._id ? "text-zinc-400" : "text-zinc-500 group-hover:text-zinc-400"
                                                }`} />
                                            <span className="truncate font-medium">{channel.name}</span>
                                        </button>

                                        {/* Channel Actions Dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    className="hidden group-hover:block data-[state=open]:block p-0.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors outline-none"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreVertical className="h-3 w-3" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                side="right"
                                                align="start"
                                                sideOffset={5}
                                                className="w-40 bg-zinc-900 border-zinc-800 text-zinc-200"
                                            >
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setChannelToRename(channel);
                                                        setChannelRenameValue(channel.name);
                                                    }}
                                                    className="cursor-pointer flex items-center gap-2 hover:bg-zinc-800 focus:bg-zinc-800"
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                    <span>Rename</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-zinc-800" />
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setChannelToDelete(channel);
                                                    }}
                                                    className="cursor-pointer flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 focus:bg-red-950/30 focus:text-red-300"
                                                >
                                                    <Trash className="h-3 w-3" />
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))}
                                {channels.length === 0 && (
                                    <div className="px-2 py-4 text-center">
                                        <p className="text-xs text-zinc-600 mb-2">No channels yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4 opacity-50">
                        <MessageSquare className="h-12 w-12 mb-4 text-zinc-600" />
                        <p className="text-sm">Select or create a workspace to see channels.</p>
                    </div>
                )}
            </ScrollArea>

            {/* Channel Rename Dialog */}
            <Dialog open={!!channelToRename} onOpenChange={(open) => !open && setChannelToRename(null)}>
                <DialogContent className="bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-white">Rename Channel</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Enter a new name for the channel.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={channelRenameValue}
                            onChange={(e) => setChannelRenameValue(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            placeholder="channel-name"
                            className="bg-zinc-950 border-zinc-800 text-white focus:border-primary"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleChannelRename} className="bg-primary hover:bg-primary/90 text-white">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Channel Delete Alert */}
            <AlertDialog open={!!channelToDelete} onOpenChange={(open) => !open && setChannelToDelete(null)}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Channel</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            Are you sure you want to delete <span className="font-bold text-white">#{channelToDelete?.name}</span>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleChannelDelete} className="bg-red-600 text-white hover:bg-red-700 border-none">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* User Footer */}
            <div className="p-2 bg-[#0c0c0e] border-t border-zinc-900">
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-zinc-800/50 transition-colors group">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 flex-1 outline-none text-left">
                                <div className="relative">
                                    <Avatar className="h-8 w-8 border border-zinc-800">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                                        <AvatarFallback className="bg-primary/20 text-primary font-medium text-xs">
                                            {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#0c0c0e]" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-bold text-white truncate group-hover:text-zinc-200 transition-colors">
                                        {user?.username || "User"}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 truncate">Online</p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="top" className="w-56 bg-zinc-900 border-zinc-800 text-zinc-200 mb-2">
                            <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-950/30 focus:bg-red-950/30 focus:text-red-300"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Log Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center">
                        <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
                            <Mic className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
                            <Headphones className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

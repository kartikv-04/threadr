"use client";

import { useEffect, useState, useRef } from "react";
import { useChannelStore } from "@/store/channel.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useAuthStore } from "@/store/auth.store";
import { useMessageStore } from "@/store/message.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Hash, Send, Loader2, MessageSquare, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function ChatPane() {
    const user = useAuthStore((state) => state.user);
    const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
    const currentChannel = useChannelStore((state) => state.currentChannel);
    const fetchChannels = useChannelStore((state) => state.fetchChannels);
    const setCurrentChannel = useChannelStore((state) => state.setCurrentChannel);
    const messages = useMessageStore((state) => state.messages);
    const fetchMessages = useMessageStore((state) => state.fetchMessages);
    const sendMessage = useMessageStore((state) => state.sendMessage);
    const addMessage = useMessageStore((state) => state.addMessage);
    const updateMessage = useMessageStore((state) => state.updateMessage);
    const { getSocket } = require("@/lib/socket");

    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [newChannelName, setNewChannelName] = useState("");
    const [creatingChannel, setCreatingChannel] = useState(false);

    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        if (!socket.connected) {
            socket.connect();
        }

        function onMessageNew(newMessage: any) {
            // Only add if it belongs to current channel to be safe
            // Use toString() to ensure we compare strings (handle ObjectId vs string)
            if (currentChannel && newMessage.channel.toString() === currentChannel._id.toString()) {
                addMessage(newMessage);
            }
        }

        function onMessageUpdate(updatedMessage: any) {
            if (currentChannel && updatedMessage.channel.toString() === currentChannel._id.toString()) {
                updateMessage(updatedMessage._id, updatedMessage.content);
            }
        }

        socket.on("connect", () => {

        });

        socket.on("message:new", onMessageNew);
        socket.on("message:update", onMessageUpdate);

        return () => {
            socket.off("message:new", onMessageNew);
            socket.off("message:update", onMessageUpdate);
        };
    }, [currentChannel, addMessage, updateMessage]);

    // Join/Leave Channel Room
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !currentChannel) return;

        socket.emit("join-channel", currentChannel._id);

        return () => {
            socket.emit("leave-channel", currentChannel._id);
        };
    }, [currentChannel]);

    // Fetch initial messages
    useEffect(() => {
        if (currentChannel) {
            fetchMessages(currentChannel._id);
        }
    }, [currentChannel, fetchMessages]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !currentChannel) return;

        setSending(true);
        try {
            await sendMessage(currentChannel._id, content);
            setContent("");
        } catch (error) {

        } finally {
            setSending(false);
        }
    };

    const handleCreateChannel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChannelName.trim() || !currentWorkspace) return;

        setCreatingChannel(true);
        try {
            const res = await api.post("/channels", {
                name: newChannelName,
                workspaceId: currentWorkspace._id
            });
            const newChannel = res.data.data;
            await fetchChannels(currentWorkspace._id);
            setCurrentChannel(newChannel);
            setNewChannelName("");
        } catch (error) {

        } finally {
            setCreatingChannel(false);
        }
    };

    const handleEditClick = (msg: any) => {
        setEditingMessageId(msg._id);
        setEditContent(msg.content);
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditContent("");
    };

    const handleSaveEdit = async () => {
        if (!editingMessageId || !editContent.trim()) return;
        try {
            await api.patch(`/messages/${editingMessageId}`, { content: editContent });
            updateMessage(editingMessageId, editContent);
            setEditingMessageId(null);
            setEditContent("");
        } catch (error) {

        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSaveEdit();
        } else if (e.key === "Escape") {
            handleCancelEdit();
        }
    };

    if (!currentWorkspace) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 text-zinc-500 p-8">
                <div className="max-w-md text-center space-y-6">
                    <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto border border-zinc-800">
                        <MessageSquare className="h-10 w-10 text-zinc-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Mini Chat</h2>
                        <p className="text-zinc-400">
                            You don&apos;t have any workspaces yet. Create one from the sidebar to get started.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentChannel) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-8">
                <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center mb-4 border border-zinc-800">
                            <Hash className="w-6 h-6 text-zinc-400" />
                        </div>
                        <CardTitle className="text-xl text-white">Create a Channel</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Start a new discussion in <span className="text-primary font-medium">{currentWorkspace.name}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateChannel} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="channelName" className="text-zinc-300">Channel Name</Label>
                                <Input
                                    id="channelName"
                                    placeholder="e.g. general"
                                    value={newChannelName}
                                    onChange={(e) => setNewChannelName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                    className="bg-zinc-950 border-zinc-800 text-white focus:border-primary"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={!newChannelName.trim() || creatingChannel}
                            >
                                {creatingChannel ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Channel"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="h-14 px-6 flex items-center border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
                <Hash className="h-5 w-5 text-zinc-400 mr-2" />
                <div>
                    <h2 className="font-bold text-white">{currentChannel.name}</h2>
                    {currentChannel.description && (
                        <p className="text-xs text-zinc-400">{currentChannel.description}</p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden relative">
                <ScrollArea className="h-full w-full p-4">
                    <div className="space-y-6 pb-4">
                        {messages.map((msg, index) => {
                            // Handle both populated and unpopulated sender
                            const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender?._id;
                            const isSelf = senderId?.toString() === user?._id?.toString();

                            const showAvatar = index === 0 ||
                                (typeof messages[index - 1].sender === 'string'
                                    ? messages[index - 1].sender
                                    : messages[index - 1].sender?._id) !== senderId;

                            return (
                                <div
                                    key={msg._id}
                                    className={`flex gap-3 group ${isSelf ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    {/* Avatar */}
                                    <div className={`w-8 flex-shrink-0 ${!showAvatar ? "opacity-0" : ""}`}>
                                        <Avatar className="h-8 w-8 border border-zinc-800">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender.username}`} />
                                            <AvatarFallback className={`${isSelf ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400"}`}>
                                                {msg.sender.username?.charAt(0).toUpperCase() || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    {/* Message Content */}
                                    <div className={`flex flex-col max-w-[70%] ${isSelf ? "items-end" : "items-start"} relative`}>
                                        {showAvatar && !isSelf && (
                                            <span className="text-xs text-zinc-500 ml-1 mb-1">{msg.sender.username}</span>
                                        )}

                                        {editingMessageId === msg._id ? (
                                            <div className="w-full min-w-[300px] bg-zinc-900 p-2 rounded-lg border border-zinc-700">
                                                <Textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    className="min-h-[60px] bg-zinc-950 border-zinc-800 text-white mb-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                />
                                                <div className="flex items-center justify-end gap-2 text-xs">
                                                    <span className="text-zinc-500 mr-2">escape to cancel • enter to save</span>
                                                    <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-6 px-2 text-zinc-400 hover:text-white">
                                                        Cancel
                                                    </Button>
                                                    <Button size="sm" onClick={handleSaveEdit} className="h-6 px-2 bg-primary hover:bg-primary/90 text-white">
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative group/message">
                                                <div
                                                    className={`px-4 py-2 text-sm shadow-sm max-w-full break-words ${isSelf
                                                        ? "bg-[#1557c2] text-white rounded-l-2xl rounded-tr-none rounded-br-2xl ml-auto"
                                                        : "bg-zinc-800 text-zinc-200 rounded-r-2xl rounded-tl-none rounded-bl-2xl mr-auto"
                                                        }`}
                                                >
                                                    {msg.content}
                                                    {msg.isEdited && (
                                                        <span className="text-[10px] opacity-60 ml-1">(edited)</span>
                                                    )}
                                                </div>

                                                {/* Edit Button (Floating) */}
                                                {isSelf && (
                                                    <div className="absolute -top-4 right-0 hidden group-hover/message:flex bg-zinc-900 border border-zinc-800 rounded-md shadow-lg overflow-hidden">
                                                        <button
                                                            onClick={() => handleEditClick(msg)}
                                                            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {!editingMessageId && (
                                            <span className="text-[10px] text-zinc-600 mt-1 px-1" suppressHydrationWarning>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-zinc-950 flex-shrink-0">
                <form onSubmit={handleSend} className="relative">
                    <Input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`Message #${currentChannel.name}`}
                        className="pr-12 bg-zinc-900 border-zinc-800 focus:border-primary/50 py-6 text-white placeholder:text-zinc-600 rounded-2xl"
                        disabled={sending}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                        disabled={!content.trim() || sending}
                    >
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}

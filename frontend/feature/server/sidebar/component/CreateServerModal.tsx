"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateServer } from "../hook";

interface CreateServerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateServerModal = ({ isOpen, onClose }: CreateServerModalProps) => {
    const [serverName, setServerName] = useState("");
    const { mutate, isPending } = useCreateServer();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!serverName.trim()) return;

        mutate(
            { userId: "", serverName: serverName.trim() }, // userId will be injected by backend from auth
            {
                onSuccess: () => {
                    setServerName("");
                    onClose();
                },
                onError: (error) => {
                    console.error("Failed to create server:", error);
                }
            }
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-neutral-800 rounded-lg shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
                    <h2 className="text-xl font-semibold text-white">Create a Server</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-neutral-300 text-sm mb-6">
                        Give your new server a personality with a name. You can always change it later.
                    </p>

                    {/* Server Name Input */}
                    <div className="space-y-2">
                        <label
                            htmlFor="serverName"
                            className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide"
                        >
                            Server Name
                        </label>
                        <input
                            id="serverName"
                            type="text"
                            value={serverName}
                            onChange={(e) => setServerName(e.target.value)}
                            placeholder="Enter server name"
                            className={cn(
                                "w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-md",
                                "text-white placeholder-neutral-500",
                                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                                "transition-all duration-200"
                            )}
                            autoFocus
                            disabled={isPending}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!serverName.trim() || isPending}
                            className={cn(
                                "px-6 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                "bg-indigo-600 text-white",
                                "hover:bg-indigo-500",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                            )}
                        >
                            {isPending ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateServerModal;

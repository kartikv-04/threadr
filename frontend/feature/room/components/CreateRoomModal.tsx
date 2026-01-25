import { useState } from "react";
import { useCreateRoom } from "../hook";
import { Hash, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Create Room Modal
interface CreateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    serverId: string;
}

export const CreateRoomModal = ({ isOpen, onClose, serverId }: CreateRoomModalProps) => {
    const [roomName, setRoomName] = useState("");
    const { mutate, isPending } = useCreateRoom();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName.trim()) return;

        mutate(
            { userId: "", roomName: roomName.trim(), serverId },
            {
                onSuccess: () => {
                    setRoomName("");
                    onClose();
                }
            }
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700/50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-neutral-800/80">
                    <h2 className="text-xl font-bold text-white">Create Room</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700/50 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 pt-2">
                    <p className="text-neutral-400 text-sm mb-4">
                        Create a new room to chat with your server members.
                    </p>

                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                        Room Name
                    </label>
                    <div className="relative">
                        <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            placeholder="new-room"
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-neutral-900 rounded-lg",
                                "text-white placeholder-neutral-500",
                                "border border-neutral-700 focus:border-indigo-500",
                                "focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                                "transition-all duration-200"
                            )}
                            autoFocus
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!roomName.trim() || isPending}
                            className={cn(
                                "px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                "bg-indigo-600 text-white",
                                "hover:bg-indigo-500 active:scale-[0.98]",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                            )}
                        >
                            {isPending ? "Creating..." : "Create Room"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
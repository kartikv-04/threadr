"use client";

import { useState, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Plus, SendHorizontal } from "lucide-react";

interface MessageInputProps {
    onSend: (content: string) => void;
    disabled?: boolean;
    placeholder?: string;
    roomName?: string;
}

const MessageInput = ({
    onSend,
    disabled = false,
    placeholder,
    roomName = "room"
}: MessageInputProps) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        const trimmed = message.trim();
        if (!trimmed || disabled) return;

        onSend(trimmed);
        setMessage("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="px-4 py-2">
            <div className={cn(
                "flex items-center gap-2 rounded-lg",
                "bg-neutral-700/50",
                "border border-neutral-600/50",
                "focus-within:border-neutral-500",
                "transition-colors"
            )}>
                {/* Add attachment button */}
                <button
                    className={cn(
                        "flex-shrink-0 p-3 rounded-lg",
                        "text-neutral-400 hover:text-neutral-200",
                        "transition-colors",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={disabled}
                    title="Add attachment"
                >
                    <Plus size={20} />
                </button>

                {/* Message input */}
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || `Message #${roomName}`}
                    disabled={disabled}
                    rows={1}
                    className={cn(
                        "flex-1 bg-transparent resize-none",
                        "text-white placeholder-neutral-500",
                        "py-3 pr-2",
                        "focus:outline-none",
                        "max-h-36 overflow-y-auto",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    style={{ minHeight: '24px' }}
                />

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    className={cn(
                        "flex-shrink-0 p-3 mr-1 rounded-lg",
                        "transition-all duration-150",
                        message.trim() && !disabled
                            ? "text-indigo-400 hover:text-indigo-300 hover:bg-neutral-600/50"
                            : "text-neutral-600 cursor-not-allowed"
                    )}
                    title="Send message"
                >
                    <SendHorizontal size={20} />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;

"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PencilLine, Plus, SendHorizontal, X } from "lucide-react";
import type { Message } from "../chat.type";

interface MessageInputProps {
    onSend: (content: string) => void;
    disabled?: boolean;
    placeholder?: string;
    roomName?: string;
    editingMessage?: Message | null;
    onCancelEdit?: () => void;
}

const MessageInput = ({
    onSend,
    disabled = false,
    placeholder,
    roomName = "room",
    editingMessage = null,
    onCancelEdit
}: MessageInputProps) => {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Focus on mount and whenever input becomes enabled
    useEffect(() => {
        if (!disabled) {
            inputRef.current?.focus();
        }
    }, [disabled]);

    useEffect(() => {
        if (editingMessage) {
            setMessage(editingMessage.content);
            inputRef.current?.focus();
        } else {
            setMessage("");
        }
    }, [editingMessage]);

    const handleSend = () => {
        const trimmed = message.trim();
        if (!trimmed || disabled) return;

        onSend(trimmed);
        if (!editingMessage) {
            setMessage("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="px-4 py-3">
            {editingMessage && (
                <div className="mb-2 flex items-center justify-between rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                    <div className="flex items-center gap-2">
                        <PencilLine size={14} />
                        <span>Editing message</span>
                    </div>
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="rounded p-1 text-amber-100/80 transition hover:bg-amber-500/10 hover:text-amber-50"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
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
                    type="button"
                >
                    <Plus size={20} />
                </button>

                <textarea
                    ref={inputRef}
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
                    title={editingMessage ? "Save message" : "Send message"}
                    type="button"
                >
                    <SendHorizontal size={20} />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;

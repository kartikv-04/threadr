"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateServer } from "../server.hook";
import { useAuthStore } from "@/feature/auth/AuthStore"; // Import Auth Store

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateServerModal = ({ isOpen, onClose }: CreateServerModalProps) => {
  const [serverName, setServerName] = useState("");

  // 1. Get User ID from store to send valid data
  const userId = useAuthStore((state) => state.userId);

  // 2. Destructure 'error' and 'isError' from the hook
  const { mutate, isPending, isError, error } = useCreateServer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!serverName.trim()) return;

    mutate(
      {
        // Fallback to empty string only if store is not ready (rare)
        userId: userId || "",
        serverName: serverName.trim(),
      },
      {
        onSuccess: () => {
          setServerName("");
          onClose();
        },
        // Error is handled by the UI 
        onError: (err) => console.error(err),
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Soft glow */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-600/10 blur-[120px]" />

        <div
          role="dialog"
          aria-modal="true"
          className="relative bg-neutral-900/90 backdrop-blur-xl border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 text-center relative">

            <h2 className="text-2xl font-semibold text-white">
              Create a server
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Your space for conversations and threads.
            </p>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 pb-6">
            <div className="space-y-2">
              <label
                htmlFor="serverName"
                className="block text-xs font-semibold text-neutral-400 uppercase tracking-wide"
              >
                Server name
              </label>

              <input
                id="serverName"
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="Server Name"
                disabled={isPending}
                className={cn(
                  "w-full px-4 py-2 rounded-lg",
                  "bg-neutral-800 border border-neutral-700",
                  "text-white placeholder-neutral-500",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                  "transition-all",
                  isError && "border-red-500 focus:ring-red-500",
                )}
                autoFocus
              />

              {/* Error */}
              {isError && (
                <p className="text-xs text-red-400 mt-1">
                  {(error as any)?.response?.data?.message ||
                    "Failed to create server. Please try again."}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!serverName.trim() || isPending}
                className={cn(
                  "px-6 py-2 text-sm font-medium rounded-lg",
                  "bg-indigo-600 text-white",
                  "hover:bg-indigo-500",
                  "shadow-lg shadow-indigo-600/30",
                  "transition-all",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                )}
              >
                {isPending ? "Creating…" : "Create server"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateServerModal;

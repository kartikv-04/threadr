"use client";

import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: React.ReactNode;
    confirmText?: string;
    isPending?: boolean;
}

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    isPending = false,
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Subtle danger glow */}
                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-red-600/10 blur-[120px]" />

                <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/95 backdrop-blur-xl shadow-2xl">
                    {/* Header */}
                    <div className="px-6 pt-8 pb-6 text-center">
                        {/* Icon */}
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600/10 ring-1 ring-red-600/30">
                            <AlertTriangle className="text-red-500" size={26} />
                        </div>

                        <h2 className="text-2xl font-semibold text-white">
                            {title}
                        </h2>

                        <div className="mt-3 text-sm text-neutral-400 leading-relaxed">
                            {description}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-neutral-800" />

                    {/* Actions */}
                    <div className="px-6 py-5 flex flex-col-reverse sm:flex-row justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={isPending}
                            className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={isPending}
                            className={cn(
                                "px-6 py-2 text-sm font-semibold rounded-lg transition-all",
                                "bg-red-700 text-white hover:bg-red-800",
                                "shadow-lg shadow-red-600/30",
                                "active:scale-[0.97]",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            )}
                        >
                            {isPending ? "Processing…" : confirmText}
                        </button>
                    </div>

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-800 transition"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

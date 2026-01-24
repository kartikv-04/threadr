import { useState, useEffect } from "react";
import { useGenerateInvite } from "../hook";
import { X, Copy, Check, Link, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    serverId: string;
    serverName: string;
}

export const InviteModal = ({ isOpen, onClose, serverId, serverName }: InviteModalProps) => {
    const [inviteLink, setInviteLink] = useState("");
    const [copied, setCopied] = useState(false);
    const { mutate: generateInvite, isPending } = useGenerateInvite();

    const handleGenerate = () => {
        generateInvite(serverId, {
            onSuccess: (data) => {
                setInviteLink(data.url);
            }
        });
    };

    const onCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    useEffect(() => {
        if (isOpen && !inviteLink) {
            handleGenerate();
        }
    }, [isOpen]);

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
                    <h2 className="text-xl font-bold text-white">Invite People</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700/50 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-neutral-400 text-sm mb-4">
                        Invite your friends to <span className="font-bold text-indigo-400">{serverName}</span>!
                    </p>

                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                        Server Invite Link
                    </label>

                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Link size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                            <input
                                readOnly
                                value={isPending ? "Generating..." : inviteLink}
                                className={cn(
                                    "w-full pl-10 pr-4 py-3 bg-neutral-900 rounded-lg",
                                    "text-white placeholder-neutral-500",
                                    "border border-neutral-700 focus:border-indigo-500",
                                    "focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                                    "transition-all duration-200"
                                )}
                            />
                            {isPending && (
                                <Loader2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 animate-spin" />
                            )}
                        </div>
                        <button
                            onClick={onCopy}
                            disabled={!inviteLink || isPending}
                            className={cn(
                                "flex items-center justify-center p-3 rounded-lg transition-all duration-200",
                                copied ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white hover:bg-indigo-500",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                    </div>

                    <p className="text-neutral-500 text-[11px] mt-4">
                        Your invite link will expire in 6 hours.
                    </p>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={handleGenerate}
                            disabled={isPending}
                            className="text-xs font-semibold text-indigo-400 hover:underline disabled:opacity-50"
                        >
                            Generate new link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

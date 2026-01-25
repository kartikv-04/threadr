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

export const InviteModal = ({
  isOpen,
  onClose,
  serverId,
  serverName,
}: InviteModalProps) => {
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { mutate: generateInvite, isPending } = useGenerateInvite();

  const handleGenerate = () => {
    generateInvite(serverId, {
      onSuccess: (data) => {
        setInviteLink(data.url);
      },
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Wrapper */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Subtle glow */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-600/10 blur-[120px]" />

        <div className="relative bg-neutral-900/90 backdrop-blur-xl border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 text-center">
            {/* Icon badge */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
              <Link size={22} />
            </div>

            <h2 className="text-2xl font-semibold text-white">Invite people</h2>
            <p className="text-sm text-neutral-400 mt-1">
              Share this link to invite others to{" "}
              <span className="text-indigo-400 font-medium">{serverName}</span>
            </p>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
              Invite link
            </label>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  readOnly
                  value={isPending ? "Generating invite link…" : inviteLink}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg",
                    "bg-neutral-800 border border-neutral-700",
                    "text-white text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
                    "transition-all",
                  )}
                />
                {isPending && (
                  <Loader2
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 animate-spin"
                  />
                )}
              </div>

              <button
                onClick={onCopy}
                disabled={!inviteLink || isPending}
                className={cn(
                  "h-11 w-11 flex items-center justify-center rounded-lg transition-all",
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-500",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
                title="Copy link"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-[11px] text-neutral-500">
                Invite links expire after 6 hours.
              </p>

              <button
                onClick={handleGenerate}
                disabled={isPending}
                className="text-xs font-medium text-indigo-400 hover:underline disabled:opacity-50"
              >
                Generate new link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

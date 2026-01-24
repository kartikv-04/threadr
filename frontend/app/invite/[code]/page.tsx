"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetInviteInfo, useJoinServer } from "@/feature/server/room/hook";
import { useAuthStore } from "@/store/AuthStore";
import { useServerStore } from "@/store/ServerStore";
import { Loader2, Server, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
    params: Promise<{ code: string }>;
}

export default function InvitePage({ params }: PageProps) {
    const { code } = use(params);
    const router = useRouter();
    const { accessToken, _hasHydrated } = useAuthStore();

    const { data: invite, isLoading: isChecking, error } = useGetInviteInfo(code);
    const { mutate: join, isPending: isJoining } = useJoinServer();

    const handleJoin = () => {
        if (!accessToken) {
            router.push(`/login?redirect=/invite/${code}`);
            return;
        }

        if (invite) {
            join({
                inviteCode: code,
                serverId: invite.serverId
            }, {
                onSuccess: (data) => {
                    useServerStore.getState().setActiveServerId(data.serverId);
                    router.push("/");
                }
            });
        }
    };

    if (!_hasHydrated || isChecking) {
        return (
            <div className="flex flex-col h-screen bg-neutral-900 items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-neutral-400 animate-pulse font-medium">Checking invite...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-neutral-900 items-center justify-center">
                <div className="max-w-md w-full mx-4 p-8 bg-neutral-800 rounded-2xl border border-neutral-700 shadow-2xl text-center">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserPlus className="text-rose-500" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Invalid Invite</h1>
                    <p className="text-neutral-400 mb-8">
                        This invite link is invalid or has expired. Please ask for a new link to join the server.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-3 bg-neutral-700 text-white rounded-xl font-semibold hover:bg-neutral-600 transition-all active:scale-[0.98]"
                    >
                        Back to safety
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-neutral-900 items-center justify-center">
            <div className="max-w-md w-full mx-4 p-8 bg-neutral-800 rounded-2xl border border-neutral-700 shadow-2xl">
                {/* Branding or Server Icon */}
                <div className="flex justify-center mb-8">
                    {invite?.serverIcon ? (
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <img
                                src={invite.serverIcon}
                                alt={invite.serverName}
                                className="relative w-24 h-24 rounded-3xl shadow-xl object-cover border-4 border-neutral-700"
                            />
                        </div>
                    ) : (
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-xl border-4 border-neutral-700">
                                <Server className="text-white" size={40} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center mb-10">
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-2 px-6 py-1 bg-neutral-900/50 rounded-full inline-block">
                        Invitation Received
                    </p>
                    <h1 className="text-3xl font-extrabold text-white truncate px-2">
                        {invite?.serverName}
                    </h1>
                </div>

                <button
                    onClick={handleJoin}
                    disabled={isJoining}
                    className={cn(
                        "w-full py-4 bg-indigo-600 text-white rounded-xl font-extrabold text-lg",
                        "hover:bg-indigo-500 active:scale-[0.98] transition-all duration-200",
                        "shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed",
                        "flex items-center justify-center gap-2"
                    )}
                >
                    {isJoining ? (
                        <>
                            <Loader2 size={24} className="animate-spin" />
                            Joining...
                        </>
                    ) : (
                        "Accept Invitation"
                    )}
                </button>

                <div className="mt-8 pt-6 border-t border-neutral-700/50">
                    <p className="text-neutral-500 text-[11px] text-center uppercase tracking-tighter leading-relaxed">
                        By joining, you agree to follow the server's rules and guidelines.
                        Make sure to be respectful to all members.
                    </p>
                </div>
            </div>
        </div>
    );
}

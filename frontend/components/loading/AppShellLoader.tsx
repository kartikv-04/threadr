"use client";

import { MessageCircleMore } from "lucide-react";
import { Skeleton } from "./Skeleton";

export const AppShellLoader = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-neutral-950 text-white">
            <aside className="flex w-[72px] min-w-[72px] flex-col items-center gap-3 border-r border-neutral-800/60 bg-neutral-950 px-3 pt-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-[20px] border border-indigo-500/20 bg-neutral-900 text-indigo-300 shadow-[0_0_40px_rgba(99,102,241,0.12)]">
                    <MessageCircleMore size={22} />
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-neutral-950" />
                </div>
                <Skeleton className="h-12 w-12 rounded-[18px]" />
                <Skeleton className="h-12 w-12 rounded-[18px]" />
                <Skeleton className="h-12 w-12 rounded-[18px]" />
            </aside>

            <aside className="flex w-60 min-w-[240px] flex-col border-r border-neutral-800/60 bg-neutral-950">
                <div className="border-b border-neutral-800/60 px-4 py-4">
                    <Skeleton className="h-5 w-28 rounded-full" />
                </div>
                <div className="space-y-3 px-3 py-4">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                    <Skeleton className="h-9 w-[85%] rounded-lg" />
                    <Skeleton className="h-9 w-[92%] rounded-lg" />
                    <Skeleton className="h-9 w-[76%] rounded-lg" />
                </div>
                <div className="mt-auto border-t border-neutral-800/60 px-3 py-4">
                    <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/70 p-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-24 rounded-full" />
                            <Skeleton className="h-3 w-16 rounded-full" />
                        </div>
                    </div>
                </div>
            </aside>

            <main className="relative flex flex-1 flex-col overflow-hidden bg-neutral-950">
                <div className="border-b border-neutral-800/60 px-6 py-4">
                    <Skeleton className="h-5 w-40 rounded-full" />
                </div>

                <div className="flex-1 px-6 py-6">
                    <div className="mb-8 max-w-md rounded-3xl border border-neutral-800/80 bg-neutral-900/60 p-5 backdrop-blur-sm">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                                <MessageCircleMore size={18} />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-24 rounded-full" />
                                <Skeleton className="h-4 w-40 rounded-full" />
                            </div>
                        </div>
                        <Skeleton className="h-3 w-full rounded-full" />
                        <Skeleton className="mt-2 h-3 w-[82%] rounded-full" />
                    </div>

                    <div className="space-y-5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2 pt-1">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-24 rounded-full" />
                                        <Skeleton className="h-3 w-16 rounded-full" />
                                    </div>
                                    <Skeleton className="h-3 w-[70%] rounded-full" />
                                    <Skeleton className="h-3 w-[52%] rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-neutral-800/60 px-6 py-4">
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4">
                        <Skeleton className="h-4 w-56 rounded-full" />
                    </div>
                </div>
            </main>
        </div>
    );
};

"use client";

import { Hash } from "lucide-react";
import { Skeleton } from "./Skeleton";

export const MessageListLoader = () => {
    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-2 py-4">
                <div className="mb-6 border-b border-neutral-800 px-4 pb-6">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 text-neutral-500">
                        <Hash size={28} />
                    </div>
                    <Skeleton className="h-7 w-52 rounded-full" />
                    <Skeleton className="mt-3 h-4 w-72 rounded-full" />
                </div>

                <div className="space-y-5">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="flex gap-4 px-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="min-w-0 flex-1 pt-1">
                                <div className="mb-2 flex items-center gap-2">
                                    <Skeleton className="h-4 w-24 rounded-full" />
                                    <Skeleton className="h-3 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-[62%] rounded-full" />
                                <Skeleton className="mt-2 h-4 w-[46%] rounded-full" />
                                {index % 2 === 0 && (
                                    <Skeleton className="mt-2 h-4 w-[78%] rounded-full" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

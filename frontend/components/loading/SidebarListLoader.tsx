"use client";

import { Skeleton } from "./Skeleton";

interface SidebarListLoaderProps {
    rows?: number;
    compact?: boolean;
}

export const SidebarListLoader = ({
    rows = 4,
    compact = false,
}: SidebarListLoaderProps) => {
    if (compact) {
        return (
            <div className="flex flex-col items-center gap-2 px-3">
                {Array.from({ length: rows }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-12 rounded-[18px]" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-2 px-2 py-2">
            {Array.from({ length: rows }).map((_, index) => (
                <div key={index} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                    <Skeleton className="h-5 w-5 rounded-md" />
                    <Skeleton className="h-4 flex-1 rounded-full" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                </div>
            ))}
        </div>
    );
};

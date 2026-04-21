"use client";

import { cn } from "@/lib/utils";

interface InlineLoaderProps {
    label?: string;
    className?: string;
}

export const InlineLoader = ({
    label,
    className,
}: InlineLoaderProps) => {
    return (
        <div className={cn("flex items-center gap-2 text-neutral-400", className)}>
            <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-indigo-400/80 animate-[pulse_1.2s_ease-in-out_infinite]" />
                <span className="h-2 w-2 rounded-full bg-indigo-400/55 animate-[pulse_1.2s_ease-in-out_0.15s_infinite]" />
                <span className="h-2 w-2 rounded-full bg-indigo-400/35 animate-[pulse_1.2s_ease-in-out_0.3s_infinite]" />
            </div>
            {label && <span className="text-xs font-medium tracking-wide">{label}</span>}
        </div>
    );
};

"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ActionButtonProps {
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    variant?: "default" | "success" | "danger";
}

const ActionButton = ({ icon, label, onClick, variant = "default" }: ActionButtonProps) => {
    return (
        <div className="relative group flex items-center justify-center">
            {/* Button */}
            <button
                onClick={onClick}
                className={cn(
                    "flex items-center justify-center w-12 h-12 mx-3 rounded-[24px] transition-all duration-300",
                    "hover:rounded-[16px]",
                    variant === "default" && "bg-neutral-700 hover:bg-indigo-500 text-neutral-200 hover:text-white",
                    variant === "success" && "bg-neutral-700 hover:bg-emerald-500 text-emerald-500 hover:text-white",
                    variant === "danger" && "bg-neutral-700 hover:bg-red-500 text-red-500 hover:text-white"
                )}
            >
                {icon}
            </button>

            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                {label}
                {/* Arrow */}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-neutral-900" />
            </div>
        </div>
    );
};

export default ActionButton;

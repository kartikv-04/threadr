"use client";

import { Monitor, Smartphone } from "lucide-react";

export const MobileWarning = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950 p-6 text-center lg:hidden">
      <div className="relative mb-8">
        <div className="absolute -inset-4 rounded-full bg-indigo-600/20 blur-xl animate-pulse" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-neutral-900 border border-white/10">
          <Smartphone size={48} className="text-neutral-400" />
        </div>
        <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 border-4 border-neutral-950">
          <Monitor size={18} className="text-white" />
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white mb-3">
        Best experienced on Desktop
      </h1>
      <p className="max-w-[280px] text-neutral-400 leading-relaxed mb-8">
        Threadr is optimized for wider screens to provide the best possible chat experience. Please switch to a laptop or computer.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-[280px]">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-left">
          <p className="text-sm font-medium text-white mb-1">Why desktop?</p>
          <p className="text-xs text-neutral-500">
            Our multi-pane workspace layout and real-time features are designed for larger displays.
          </p>
        </div>
      </div>
    </div>
  );
};

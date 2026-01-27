"use client";

import { useGetInviteInfo, useJoinServer } from "../invite.hook";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Globe, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface JoinServerModalProps {
  inviteCode: string;
}

export const JoinServerModal = ({ inviteCode }: JoinServerModalProps) => {
  const { data, isLoading, isError, error } = useGetInviteInfo(inviteCode);
  const { mutate: join, isPending } = useJoinServer();
  const router = useRouter();

  const handleJoin = () => {
    if (data) {
      join({ inviteCode, serverId: data.serverId });
    }
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-md"
      onClick={handleClose}
    />

    {/* Modal Wrapper */}
    <div className="relative z-10 w-full max-w-md mx-4">
      {/* Subtle glow */}
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="relative bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <h2 className="text-2xl font-semibold text-white">
            You’ve been invited
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Join a server and start chatting
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {isLoading && (
            <p className="text-center text-neutral-400">
              Loading server information…
            </p>
          )}

          {isError && (
            <p className="text-center text-sm text-red-400">
              {(error as any)?.response?.data?.message ||
                "This invite link is invalid or has expired."}
            </p>
          )}

          {data && (
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Server avatar */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden">
                {data.icon ? (
                  <img
                    src={data.icon}
                    alt={data.serverName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Globe className="h-10 w-10 text-indigo-400" />
                )}
              </div>

              <h3 className="text-xl font-semibold text-white">
                {data.serverName}
              </h3>

              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Users size={16} />
                <span>{data.memberCount} members</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-800">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            onClick={handleJoin}
            disabled={isLoading || isPending || !data}
            className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
          >
            {isPending ? "Joining…" : "Join server"}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

};

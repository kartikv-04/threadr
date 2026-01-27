"use client";

import { JoinServerModal } from "@/feature/invite/components/JoinServerModal";
import { useParams } from "next/navigation";

export default function InvitePage() {
    const params = useParams();
    const inviteCode = params.inviteCode as string;

    return <JoinServerModal inviteCode={inviteCode} />;
}

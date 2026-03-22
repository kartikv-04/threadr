// ==========================================
// INVITE TYPES
// ==========================================

export type GenerateInviteRequest = {
    serverId: string;
    userId: string;             // The ID of the user creating the invite
    options?: {
        expiresAt?: string;     // e.g., "30m", "1h", "7d", "never"
        maxUses?: number;       // e.g., 1, 10, 0 (unlimited)
    };
}

export type GenerateInviteResponse = {
    url: string;                // Full link: "http://site.com/invite/abc-123"
    code: string;               // Just code: "abc-123"
    expiresAt: Date | null;     // useful for UI to show "Expires in 5 mins"
    isPermanent: boolean;
}

export type InviteValidResponse = {
    serverId: string,
    serverName: string,
    serverIcon: string,
}

export type JoinInviteReqest = {
    userId: string,
    serverId: string,
    inviteCode: string
}


export type GetMemberRequest = {
    userId: string;
    serverId: string;
}

export type GetMemberResponse = {
    members: {
        userId: string;
        username: string;
        avatar?: string;
        role: string;
    }[];
}

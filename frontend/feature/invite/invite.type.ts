export type GetInviteInfoResponse = {
    serverId: string;
    serverName: string;
    memberCount: number;
    icon: string | null;
};

export type JoinServerResponse = {
    serverId: string;
    roomId: string;
};

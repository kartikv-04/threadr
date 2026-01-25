export type GetRoomRequest = {
    userId: string;
    serverId: string;
}

export type GetRoomResponse = {
    rooms: {
        serverId: string,
        roomId: string;
        roomName: string;
    }[];
}

export type NewRoomRequest = {
    userId: string;
    roomName: string;
    serverId: string;
}

export type NewRoomResponse = {
    roomId: string;
    roomName: string;
    serverId: string;
    createdAt: Date;
}

export type GenerateInviteResponse = {
    url: string;
    code: string;
    expiresAt: string | null;
    isPermanent: boolean;
}

export type GetInviteInfoResponse = {
    serverId: string;
    serverName: string;
    serverIcon?: string;
}

export type JoinServerRequest = {
    inviteCode: string;
    serverId: string;
}
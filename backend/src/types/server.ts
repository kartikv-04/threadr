// ==========================================
// SERVER TYPES
// ==========================================

// Used for internal service calls or request bodies
export type CreateServerRequest = {
    userId: string;
    serverName: string;
}

export type NewServerResponse = {
    serverId: string;
    roomId: string;
    serverName: string;
    createdBy: string;
    createdAt: Date;

}

export type GetServerRequest = {
    userId: string;
}

export type GetServerResponse = {
    serverId: string;
    name: string;
    icon?: string;
    role: string[];
}[];

export type DeleteServerReqest = {
    userId: string,
    serverId: string
}

export type LeaveServerRequest = {
    userId: string,
    serverId: string
}
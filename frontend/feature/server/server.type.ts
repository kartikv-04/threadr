export type GetServerRequest = {
    userId: string;
}

export type GetServerResponse = {
    server: {
        serverId: string;
        name: string;
        icon?: string;
    }[];
}

// Type used by ServerIcon component
export type Server = {
    id: string;
    name: string;
    imageUrl?: string;
    unreadCount?: number;
}

export type CreateServerRequest = {
    userId: string;
    serverName: string;
}

export type NewServerResponse = {
    serverId: string;
    serverName: string;
    createdBy: string;
    createdAt: Date;
}
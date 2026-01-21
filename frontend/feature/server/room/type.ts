export type GetRoomRequest = {
    userId: string;
    serverId: string;
}

export type GetRoomResponse = {
    rooms: {
        serverId :string,
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
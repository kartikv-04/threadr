import  { Types } from "mongoose";

// ==========================================
// AUTH TYPES
// ==========================================

export type SignupRequest = {
    username: string;
    name: string;
    email: string;
    password: string;
}

export type SigninRequest = {
    email: string;
    password: string;
}

export type SignupResponse = {
    user: {
        id: string; // serialized ObjectId
        username: string;
        name: string;
        email: string;
        accessToken: string;
    },
    // Optional server info if created during signup
    server?: {
        serverId: string;
        roomId: string;
        serverName: string;
        roomName: string;
    },
    refreshToken: string;
    
}

export type SigninResponse = {
    user: {
        id: string; // serialized ObjectId
        username: string;
        name: string;
        email: string;
        accessToken: string;
    },
    refreshToken: string;
    
}


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
    serverName: string;
    createdBy: string;
    createdAt: Date;

}

export type GetServerRequest = {
    userId: string;
}

export type GetServerResponse = {
    servers: {
        serverId: string;
        name: string;
        icon?: string;
    }[];
}

export type DeleteServerReqest = {
    userId : string,
    serverId : string
}


// ==========================================
// MEMBER TYPES
// ==========================================

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

// ==========================================
// ROOM TYPES
// ==========================================

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

export type GetRoomRequest = {
    userId: string;
    serverId: string;
}

export type GetRoomResponse = {
    rooms: {
        roomId: string;
        roomName: string;
    }[];
}

export type DeleteRoomRequest = {
    userId : string,
    serverId : string,
    roomId : string
}

// ==========================================
// MESSAGE TYPES
// ==========================================

export type SendMessageRequest = {
    userId: string; // The sender
    serverId: string;
    roomId: string;
    content: string;
}

export type MessageResponse = {
    messageId: string;
    content: string;
    userId: string; // ID of the sender (User Model)
    username: string; // Display name
    isEdited: boolean;
    createdAt: Date;
    // Optional: Only include if you need to show Reply UI
    replyTo?: string; 
}

export interface GetMessagesRequest {
    userId: string;
    serverId: string;
    roomId: string;
    page?: number;  // Optional: Default to 1
    limit?: number; // Optional: Default to 50
}
import { Types, Schema } from "mongoose"

// types file, contains all types required for request and response

// Type for Function arguments in Signup
export type SignupArg = {
    username: string,
    name: string,
    email: string,
    password: string
}

// Return signup function type
export type UserResponse = {
    data: {
        id: Types.ObjectId,
        username: string,
        name: string,
        email: string,
        accessToken: string,
        server?: {
            serverName: string,
            roomName: string
        }
    },
    refreshToken: string
}

// Signin function type
export type SigninArg = {
    email: string,
    password: string
}

export type CreateServer = {
    userId: Types.ObjectId,
    serverName: string,
}

export type NewServerResponse = {
    serverName: string,
    members: string[],
    createdBy: string,
    createdAt: Date
}

export type GetMemberRequest = {
    userId: string,
    serverId: string
}

export type GetMemberResponse = {
    members: string[]
}

// Request type or creating new Room
export type NewRoomRequest = {
    userId: string,
    roomName: string,
    serverId: string
}

// Response type for creating new Room
export type ReturnNewRoom = {
    roomId: Types.ObjectId
    roomName: string,
    serverId: Schema.Types.ObjectId
}

// Request Type for GetAllRooms for Server
export type getRoomRequest = {
    userId: string,
    serverId: string
}

// Response Type for GetAllRomm 
export type GetRoomResponse = {
    roomId: Types.ObjectId
    roomName: string
    serverId: Schema.Types.ObjectId
}[]

// Request Type for Sendmessgae
export type SendMessage = {
    userId: Types.ObjectId,
    serverId: Types.ObjectId,
    roomId: Types.ObjectId,
    content: string
}

// Response Type for Sendmessage
export type SendMessageResponse = {
    messageId: string,
    content: string,
    isEdited: boolean,
    userId: string,
    sentBy: string,
    createdAt: Date
}

export type GetServerType = {
    userId: Types.ObjectId
}

export type GetServerResponse = {
    findServer: {
        serverId: string;
        name: string;
    }[];
};

export type PersonalServer = {
    userId: string
}

export type PersonalServerResponse = {
    serverName: string
}

export interface GetMessages {
    userId: string;
    serverId: string;
    roomId: string;
    page?: number;  // Optional: Default to 1
    limit?: number; // Optional: Default to 50
}

export interface MessageResponse {
    messageId: string;
    content: string;
    userId: string;
    username: string; // Added this to display name in UI
    isEdited: boolean;
    createdAt: Date;
}
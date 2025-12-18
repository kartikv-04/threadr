import { Types, Schema } from "mongoose"

// types file, contains all types required for request and response

// Type for Function arguments in Signup
export type SignupArg = {
    username : string,
    name : string,
    email : string,
    password : string
}

// Return signup function type
export type UserResponse = {
        id : Types.ObjectId,
        username : string,
        name : string,
        email : string,
        token : string,
        server : Promise<string>
}

// Signin function type
export type SigninArg = {
    email : string,
    password : string,
    token : string
}

export type CreateServer = {
    userId : Types.ObjectId,
    serverName : string,
}

export type NewServerResponse = { 
    serverName : string,
    members : string[],
    createdBy : string,
    createdAt : Date
}

export type GetMemberRequest = {
    userId : Types.ObjectId,
    serverId : Types.ObjectId
}

export type GetMemberResponse = {
    members : string[]
}

// Request type or creating new Room
export type NewRoomRequest = {
    userId : Schema.Types.ObjectId,
    roomName : string,
    serverId : Types.ObjectId
}

// Response type for creating new Room
export type ReturnNewRoom = {
    roomId : Types.ObjectId
    roomName : string,
    serverId : Schema.Types.ObjectId
}

// Request Type for GetAllRooms for Server
export type getRoomRequest = {
    userId : Types.ObjectId,
    serverId : Types.ObjectId
}

// Response Type for GetAllRomm 
export type GetRoomResponse = {
    roomId : Types.ObjectId,
    roomName : string,
}

// Request Type for Sendmessgae
export type SendMessage = {
    userId : Types.ObjectId,
    serverId : Types.ObjectId,
    roomId : Types.ObjectId,
    content : string
}

// Response Type for Sendmessage
export type SendMessageResponse = {
    messageId : string,
    content : string,
    isEdited : boolean,
    userId : string,
    sentBy : string,
    createdAt : Date
}

export type GetServerType = {
    userId : Types.ObjectId
}

export type GetServerResponse = {
    findServer: {
        serverId: string;
        name: string;
    }[];
};

export type PersonalServer = {
    userId : string
}

export type PersonalServerResponse = {
    serverName : string
}
import type { Types } from "mongoose"
import { serverModel } from "../models/server.model.js"
import logger from "../config/logger.js"

type CreateServer = {
    userId : Types.ObjectId,
    serverName : string,
}

type NewServerResponse = { 
    serverName : string,
    members : string[],
    createdBy : string,
    createdAt : Date
}

type GetMemberRequest = {
    userId : Types.ObjectId,
    serverId : Types.ObjectId
}

type GetMemberResponse = {
    members : string[]
}

export const createServer = async ( data : CreateServer) : Promise<NewServerResponse> => {
    try {
        // Validate incoming details
        if (!data.userId || !data.serverName?.trim){
            logger.warn("Server name and userid are required!!");
            throw new Error("Server and userid are required!");
        }

        // Create server and add creator as member
        const newServer = await serverModel.create({
            name : data.serverName,
            createdBy : data.userId,
            members : [data.userId]
        })

        // Populate createdBy and members in one
        await newServer.populate("createdBy","username");
        await newServer.populate("members", "username");

        // Create build response for as any type for typescript
        const populatedResponse = newServer as any;

        // create clean Response JSON
        return {
            serverName : populatedResponse.name,
            members : populatedResponse.members.map((member : any)=>member.username),
            createdBy : populatedResponse.createdBy.username as string,
            createdAt : populatedResponse.createdAt
        };
    }
    catch (err : any){
        logger.error({err}, "Error creating Server, Try again Later!!");
        throw new Error("Error creating Server try again Later!");
    }
}

export const getServerMembers = async ( data : GetMemberRequest) : Promise<GetMemberResponse> => {
    try {
        // Validate incoming fields
        if( !data.userId || !data.serverId) {
            logger.warn("Missing userId or serverId in getServerMembers");
            throw new Error("Invalid request details");
        }

        // Find the server
        const findServer = await serverModel.findById(data.serverId);
        if (!findServer) {
            logger.warn(`Server not found: ${data.serverId}`);
            throw new Error("Server not found");
        }

        // check if user is itself part of server?
        const ifMember = findServer?.members.includes(data.userId);

        if (!ifMember){
            logger.warn(`Unauthorized access attempt by user ${data.userId} to server ${data.serverId}`);
            throw new Error("Unauthorized: You are not a member of this server");
        }

        // Populate serverl model to get all memebrs username
        await findServer?.populate("members", "username");

        const populateResponse = findServer as any;

        // Return with correct Json format and details
        return {
            members : populateResponse.members.map(( user : any)=>user.username)
        }
    }
}
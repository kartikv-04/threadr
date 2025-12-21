import type { CreateServer, NewServerResponse, GetMemberRequest, GetMemberResponse, GetServerType, GetServerResponse } from "../types/types.js";
import { serverModel } from "../models/server.model.js"
import logger from "../config/logger.js"


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
            serverId : populatedResponse._id,
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
    catch(err : any){
        logger.error({err}, "Could not get the memeber's username");
        throw new Error("Error fetching memebers, try again!");
    }
}

export const getServerList = async ( data : GetServerType) : Promise<GetServerResponse> => {
    // Check and validate data
    if (!data.userId){
        logger.error("Userid not provided!!");
        throw new Error("Empty userid provided, try again!");
    }
    
    // Find Server of which user is part of
    const findServer = await serverModel
        .find({members : data.userId})
        .select("._id name")
        .lean();
    
    if(!findServer){
        logger.info("user is not yet part of any server");
        throw new Error("No server found!");
    }

    // create formatted response strucutre
    const formattedServers = findServer.map(server => ({
        serverId: server._id.toString(),
        name: server.name
    }));

    // Return the populated server
    return{ findServer : formattedServers};

    

}
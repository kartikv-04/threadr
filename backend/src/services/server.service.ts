import type { CreateServerRequest, NewServerResponse, GetMemberRequest, GetMemberResponse, GetServerRequest, GetServerResponse, DeleteServerReqest } from "../types/types.js";
import { serverModel } from "../models/server.model.js"
import logger from "../config/logger.js"
import { NotFoundError, UnauthorizedError, ValidationError } from "../helper/errorClass.js";
import { memberModel } from "../models/member.model.js";
import { roomModel } from "../models/room.model.js";


export const createServer = async (data: CreateServerRequest): Promise<NewServerResponse> => {
    // Validate incoming details
    if (!data.userId || !data.serverName?.trim()) {
        logger.warn("Server name and userid are required!!");
        throw new ValidationError("Server and userid are required!");
    }

    // Create server and add creator as member
    const newServer = await serverModel.create({
        name: data.serverName,
        createdBy: data.userId,
    })

    if (!newServer) {
        logger.error("Error in create server function");
        throw new Error("Error in server function")
    }

    logger.debug("New Server has been created by user");

    // Add user to member model
    const newMember = await memberModel.create({
        server: newServer._id,
        user: data.userId,
        role: "admin",
        isBanned: false
    })

    logger.debug("New Member is created");

    // Populate createdBy and members in one
    await newServer.populate("createdBy", "username");

    // Create build response for as any type for typescript
    const populatedResponse = newServer as any;

    // Create clean Response JSON
    return {
        serverId: populatedResponse._id,
        serverName: populatedResponse.name,
        createdBy: populatedResponse.createdBy.username as string,
        createdAt: populatedResponse.createdAt
    };
}

export const getServerList = async (data: GetServerRequest): Promise<GetServerResponse> => {
    // Check and validate data
    if (!data.userId) {
        logger.error("Userid not provided!!");
        throw new ValidationError("Empty userid provided, try again!");
    }

    // Find Server of which user is part of
    const serverArray = await memberModel
        .find({ user: data.userId })
        .populate("server", "_id name icon")
        .exec();

    if (serverArray.length === 0) {
        logger.info("user is not yet part of any server");
        throw new NotFoundError("No server found!");
    }
    
    const formatedServer = serverArray.map( list => {
        const server = list.server as any as { _id : string, name: string; icon: string };
             return {
                serverId : server._id.toString(),
                name: server.name,
                icon: server.icon
            };
        
    })

    return formatedServer as any;
}

export const deleteServers = async (data: DeleteServerReqest): Promise<void> => {
    // Check fields are not empty
    if (!data.userId || !data.serverId) {
        throw new ValidationError("All Fields are Required!");
    };

    // Find associated user in member model
    const findMember = await memberModel.findOne({ user: data.userId, server : data.serverId });
    if (!findMember) {
        throw new NotFoundError("Member Not Found");
    };

    // Check if Member is admin?
    if (!findMember.role.includes("admin")) {  // check role 
        throw new UnauthorizedError("Not Authorized to delete Server");
    };

    // Delete the server and all room and messages belonging to these server
    await Promise.all([
        serverModel.deleteOne({_id : data.serverId}),  // Delete Server
        roomModel.deleteMany({server : data.serverId}),  // Deletes all roomDoc where they are part of these server
        memberModel.deleteMany({server : data.serverId}) // Deletes All member who were part of these server
        
    ])

}
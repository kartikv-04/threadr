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

    try {
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

    }
    catch (err: any) {
        logger.error("Error in member model", err);
        throw new Error("Error in memebr creartion", err)
    }

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

export const getServerMembers = async (data: GetMemberRequest): Promise<GetMemberResponse> => {
    // Validate incoming fields
    if (!data.userId || !data.serverId) {
        logger.warn("Missing userId or serverId in getServerMembers");
        throw new ValidationError("Invalid request details");
    }

    const findServer = await serverModel.findById(data.serverId);
    if (!findServer) {
        logger.warn(`Server not found: ${data.serverId}`);
        throw new NotFoundError("Server not found");
    }

    // check if user is itself part of server?
    const ifMember = findServer?.members.some(member => member.toString() === data.userId);

    if (!ifMember) {
        logger.warn(`Unauthorized access attempt by user ${data.userId} to server ${data.serverId}`);
        throw new UnauthorizedError("Unauthorized: You are not a member of this server");
    }

    // Populate serverl model to get all memebrs username
    await findServer?.populate("members", "username");

    const populateResponse = findServer as any;

    // Return with correct Json format and details
    return {
        members: populateResponse.members.map((user: any) => user.username)
    }
}

export const getServerList = async (data: GetServerRequest): Promise<GetServerResponse> => {
    // Check and validate data
    if (!data.userId) {
        logger.error("Userid not provided!!");
        throw new ValidationError("Empty userid provided, try again!");
    }

    // Find Server of which user is part of
    const findServer = await serverModel
        .find({ members: data.userId })
        .select("._id name")
        .lean();

    if (!findServer) {
        logger.info("user is not yet part of any server");
        throw new NotFoundError("No server found!");
    }

    // create formatted response strucutre
    const formattedServers = findServer.map(server => ({
        serverId: server._id.toString(),
        name: server.name,
        icon: server.icon

    }));

    // Return the populated server
    return {
        servers: formattedServers
    };



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
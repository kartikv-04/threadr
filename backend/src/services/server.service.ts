import type { CreateServer, NewServerResponse, GetMemberRequest, GetMemberResponse, GetServerType, GetServerResponse } from "../types/types.js";
import { serverModel } from "../models/server.model.js"
import logger from "../config/logger.js"
import { NotFoundError, UnauthorizedError, ValidationError } from "../helper/errorClass.js";


export const createServer = async (data: CreateServer): Promise<NewServerResponse> => {
    // Validate incoming details
    if (!data.userId || !data.serverName?.trim) {
        logger.warn("Server name and userid are required!!");
        throw new ValidationError("Server and userid are required!");
    }

    // Create server and add creator as member
    const newServer = await serverModel.create({
        name: data.serverName,
        createdBy: data.userId,
        members: [data.userId]
    })

    // Populate createdBy and members in one
    await newServer.populate("createdBy", "username");
    await newServer.populate("members", "username");

    // Create build response for as any type for typescript
    const populatedResponse = newServer as any;

    // Create clean Response JSON
    return {
        serverId: populatedResponse._id,
        serverName: populatedResponse.name,
        members: populatedResponse.members.map((member: any) => member.username),
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

    // Find the server
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

export const getServerList = async (data: GetServerType): Promise<GetServerResponse> => {
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
        name: server.name
    }));

    // Return the populated server
    return { findServer: formattedServers };



}
import type { CreateServerRequest, NewServerResponse, GetServerRequest, GetServerResponse, DeleteServerReqest, LeaveServerRequest } from "../types/types.js";
import { serverModel } from "../models/server.model.js"
import logger from "../config/logger.js"
import { NotFoundError, ForbiddenError, ValidationError } from "../helper/errorClass.js";
import { memberModel } from "../models/member.model.js";
import { roomModel } from "../models/room.model.js";
import { createRoom } from "./room.service.js";


export const createServer = async (data: CreateServerRequest): Promise<NewServerResponse> => {
    // Validate incoming details
    if (!data.userId || !data.serverName?.trim()) {
        logger.warn("Missing required fields for server creation.");
        throw new ValidationError("Server name and user ID are required.");
    }

    // Create server and add creator as member
    const newServer = await serverModel.create({
        name: data.serverName,
        createdBy: data.userId,
    })

    if (!newServer) {
        logger.error("Internal error during server creation.");
        throw new Error("Could not create server. Please try again later.");
    }

    logger.debug("New Server has been created by user");

    // Add user to member model
    await memberModel.create({
        server: newServer._id,
        user: data.userId,
        role: "admin",
        isBanned: false
    })

    logger.debug("New Member is created");

    // Create Default general room For each server created
    const roomData = {
        userId: data.userId,
        roomName: "general",
        serverId: newServer._id.toString()
    };

    const newGeneralRoom = await createRoom(roomData);
    logger.debug("General room created");

    // Populate createdBy and members in one
    await newServer.populate("createdBy", "username");

    // Create build response for as any type for typescript
    const populatedResponse = newServer as any;

    // Create clean Response JSON
    return {
        serverId: populatedResponse._id,
        roomId: newGeneralRoom.roomId,
        serverName: populatedResponse.name,
        createdBy: populatedResponse.createdBy.username as string,
        createdAt: populatedResponse.createdAt
    };
}

export const getServerList = async (data: GetServerRequest): Promise<GetServerResponse> => {
    // Check and validate data
    if (!data.userId) {
        logger.error("User ID not provided for server list retrieval.");
        throw new ValidationError("User ID is required.");
    }

    // Find Server of which user is part of
    const serverArray = await memberModel
        .find({ user: data.userId })
        .populate("server", "_id name icon")
        .exec();

    if (serverArray.length === 0) {
        logger.info("User has no server memberships.");
        throw new NotFoundError("No servers found.");
    }

    const formatedServer = serverArray.map(list => {
        const server = list.server as any as { _id: string, name: string; icon: string };
        return {
            serverId: server._id.toString(),
            name: server.name,
            icon: server.icon,
            role: list.role
        };

    })

    return formatedServer as any;
}

export const deleteServers = async (data: DeleteServerReqest): Promise<void> => {
    // Check fields are not empty
    if (!data.userId || !data.serverId) {
        throw new ValidationError("Required fields are missing.");
    };

    // Find associated user in member model
    const findMember = await memberModel.findOne({ user: data.userId, server: data.serverId });
    if (!findMember) {
        throw new NotFoundError("Member Not Found");
    };

    // Check if Member is admin?
    if (!findMember.role.includes("admin")) {  // check role 
        throw new ForbiddenError("Only server admin can delete this server.");
    };

    // Delete the server and all room and messages belonging to these server
    await Promise.all([
        serverModel.deleteOne({ _id: data.serverId }),  // Delete Server
        roomModel.deleteMany({ server: data.serverId }),  // Deletes all roomDoc where they are part of these server
        memberModel.deleteMany({ server: data.serverId }) // Deletes All member who were part of these server

    ])

}

export const leaveServer = async (data: LeaveServerRequest): Promise<void> => {
    // Validate
    if (!data.userId || !data.serverId) {
        throw new ValidationError("Required fields are missing.");
    }

    // Check if user is member
    const findMember = await memberModel.findOne({ user: data.userId, server: data.serverId });
    if (!findMember) {
        throw new NotFoundError("Member Not Found");
    }

    // If user is admin, check if they are the last admin
    if (findMember.role.includes("admin")) {
        const adminCount = await memberModel.countDocuments({
            server: data.serverId,
            role: "admin"
        });

        if (adminCount <= 1) {
            throw new ValidationError("As the last admin, you cannot leave. Delete the server instead or transfer ownership.");
        }
    }

    // Leave server (remove from member model)
    await memberModel.deleteOne({ _id: findMember._id });

    logger.info(`User ${data.userId} left server ${data.serverId}`);
}
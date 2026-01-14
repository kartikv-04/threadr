import logger from "../config/logger.js"
import { roomModel } from "../models/room.model.js"
import { serverModel } from "../models/server.model.js"
import type { NewRoomRequest, NewRoomResponse, GetRoomRequest, GetRoomResponse } from "../types/types.js"
import { NotFoundError, UnauthorizedError, ValidationError } from "../helper/errorClass.js";



export const createRoom = async (data: NewRoomRequest): Promise<NewRoomResponse> => {

    // Validate and check incoming details
    if (!data.userId || !data.roomName || !data.serverId) {
        logger.error("Provide All Details!!");
        throw new ValidationError("Provide All Details!!");
    }

    // Logic to allow only admin of server to create new channel/room
    const serverAdmin = await serverModel.findById(data.serverId);

    if (!serverAdmin) {
        throw new NotFoundError("Server Not Found");
    }

    if (data.userId.toString() !== serverAdmin.createdBy.toString()) {
        logger.error("Only admin can create Room within Server!");
        throw new UnauthorizedError("Only admin can create Room within Server!")
    }

    // Create new Room for Server
    const newRoom = await roomModel.create({
        roomName: data.roomName,
        createdBy : data.userId,
        server: data.serverId,
        createdAt : new Date()
    })

    // Log new Room creation
    logger.info(`New Room created Under Server : ${data.serverId}`);

    // Return essentials details for room creation
    return {
        roomId: newRoom._id.toString(),
        roomName: newRoom.roomName,
        serverId: data.serverId.toString(),
        createdAt : newRoom.createdAt
    }
}

export const getRooms = async (data: GetRoomRequest): Promise<GetRoomResponse> => {
    // Check if user is part of server who trying to get room of perticular server?
    const userServer = await serverModel.findById(data.serverId);

    if (!userServer) {
        throw new NotFoundError("Server Not Found");
    }

    // Check all member userid to ensure user is admin or member of server!
    const isMember = userServer.members.some((id) => id.toString() == data.userId);

    if (!isMember) {
        logger.error("You are not allowed to get room list");
        throw new UnauthorizedError("you are not allowed to get rooms list");
    }

    // Now get all rooms whihc are part of these server
    const getRooms = await roomModel.find({ server: data.serverId });

    if (!getRooms || getRooms.length === 0) {
        logger.info("No Room was found for these Server!");
        throw new NotFoundError("No Room was found for these Server!");
    }

    // Log Successfull that Rooms Found
    logger.info("Rooms found successfully");

    // Return All details with room name, and id and etc...
    const allRooms = getRooms.map((room) => ({
        roomId: room._id.toString(),
        roomName: room.roomName,
        isDefault : room.isDefault || false
    }));

    // Return All Room Details
    return {
        rooms : allRooms
    };

}
import logger from "../config/logger.js"
import { roomModel } from "../models/room.model.js"
import { serverModel } from "../models/server.model.js"
import type { NewRoomRequest, NewRoomResponse, GetRoomRequest, GetRoomResponse, DeleteRoomRequest } from "../types/types.js"
import { NotFoundError, UnauthorizedError, ValidationError } from "../helper/errorClass.js";
import { memberModel } from "../models/member.model.js";



export const createRoom = async (data: NewRoomRequest): Promise<NewRoomResponse> => {

    // Validate and check incoming details
    if (!data.userId || !data.roomName || !data.serverId) {
        logger.error("Provide All Details!!");
        throw new ValidationError("Provide All Details!!");
    }

    // Logic to allow only admin of server to create new channel/room
    const serverAdmin = await memberModel.findOne({user : data.userId, server : data.serverId})

    if (!serverAdmin) {
        throw new UnauthorizedError("Only admin can create Room within Server!")
    }

    // Create new Room for Server
    const newRoom = await roomModel.create({
        roomName: data.roomName,
        createdBy: data.userId,
        server: data.serverId,
        createdAt: new Date()
    })

    // Log new Room creation
    logger.info(`New Room created Under Server : ${data.serverId}`);

    // Return essentials details for room creation
    return {
        roomId: newRoom._id.toString(),
        roomName: newRoom.roomName,
        serverId: data.serverId.toString(),
        createdAt: newRoom.createdAt
    }
}

export const getRooms = async (data: GetRoomRequest): Promise<GetRoomResponse> => {
    // Check fields if are empty
    if (!data.userId || !data.serverId) {
        throw new ValidationError("All fields are required");
    }

    // Check if user is member or not
    const isMember = await memberModel.findOne({ user: data.userId });
    if (!isMember) {
        throw new NotFoundError("User npt Found");
    };

    // find all rooms for these server
    let findRooms;
    const findRoomsForUser = await roomModel.find({ server: data.serverId, isPrivate: false });  //returns all public rooms
    const findRoomsForAdmin = await roomModel.find({ server: data.serverId });  //returns all rooms

    // if user is admin return all rooms if not return only public rooms
    isMember.role.includes("admin") ? findRooms = findRoomsForAdmin : findRooms = findRoomsForUser;

    const roomList = findRooms.map(room => { 
        const rooms = room as any as {server : string, _id : string, roomName : string};
        return {
            serverId : rooms.server,
            roomId: rooms._id.toString(),
            roomName: rooms.roomName
        }
    });

    return { rooms: roomList };

}

export const deleteRoom = async (data: DeleteRoomRequest): Promise<void> => {
    // Check fields are not empty
    if (!data.userId || !data.serverId || !data.roomId) {
        throw new ValidationError("All Fields are Required!");
    };

    // Find associated user in member model
    const findMember = await memberModel.findOne({ user: data.userId, server: data.serverId});
    if (!findMember) {
        throw new NotFoundError("Member Not Found");
    };

    // Check if Member is admin?
    if (!findMember.role.includes("admin")) {  // check role 
        throw new UnauthorizedError("Not Authorized to delete Server");
    };

    // Delete the room
    const deleteResult = await roomModel.deleteOne({ 
        _id: data.roomId, 
        server: data.serverId 
    });

    // Check if a room was actually deleted
    if (deleteResult.deletedCount === 0) {
        throw new NotFoundError("Room not found or already deleted.");
    }

}
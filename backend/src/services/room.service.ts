import { Types, Schema } from "mongoose"
import logger from "../config/logger.js"
import { roomModel } from "../models/room.model.js"
import { serverModel } from "../models/server.model.js"
import type { NewRoomRequest, ReturnNewRoom, getRoomRequest, GetRoomResponse } from "../types/types.js"



export const createRoom = async ( data : NewRoomRequest) : Promise<ReturnNewRoom> => {
    try {
        // Validate and check incoming details
        if( !data.userId || !data.roomName || !data.serverId) {
            logger.error("Provide All Details!!");
            throw new Error("Provide All Details!!");
        }

        // Logic to allow only admin of server to create new channel/room
        const serverAdmin = await serverModel.findById(data.serverId);
        if (data.userId !== serverAdmin?.createdBy){
            logger.error("Only admin can create Room within Server!");
            throw new Error("Only admin can ")
        }

        // Create new Room for Server
        const newRoom = await roomModel.create({
            roomName : data.roomName,
            serverId : data.serverId
        })

        // Log new Room creation
        logger.info(`New Room created Under Server : ${}`)

        // Return essentials details for room creation
        return {
            roomId : newRoom._id,
            roomName : newRoom.roomName,
            serverId : newRoom.server
        }
    }
    catch (err : any){
        logger.error({err}, "Error creating Room!");
        throw new Error( "Error creating Room!");
    }
}

export const getRooms = async ( data : getRoomRequest) : Promise<GetRoomResponse> => {
    try {
        // Check if user is part of server who trying to get room of perticular server?
        const userServer = await serverModel.findById(data.serverId);
        
        // Check all member userid to ensure user is admin or member of server!
        const getMemebrId = userServer?.members.filter((id, index)=> id == data.userId);

        if(!getMemebrId){
            logger.error("You are not allowed to get room list");
            throw new Error("you are not allowed to get rooms list");
        }

        // Now get all rooms whihc are part of these server
        const getRooms = await roomModel.findOne({server : data.serverId});

        if(!getRooms){
            logger.info("No Room was found for these Server!");
            throw new Error("No Room was found for these Server!");
        }

        // Log Successfull that Rooms Found
        logger.info("Rooms found successfully");

        // Return All details with room name, and id and etc...
        return {
            roomId : getRooms._id,
            roomName : getRooms.roomName
        }

    }
    catch(error : any){
        logger.error("Error getting room list details");
        throw new Error("Error getting room list details!");
    }
    
}
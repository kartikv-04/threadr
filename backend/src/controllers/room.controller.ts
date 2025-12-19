import logger from "../config/logger.js";
import type { Request, Response } from "express";
import { createRoom, getRooms } from "../services/room.service.js";

// 1. Create a room
export const newRoom = async (req : Request, res : Response) => {
    try {
        // 1. Destrucutre the req body
        const {userId, serverId, roomName} = req.body;

        // 2. Create data object to store variable
        const data = {
            userId,
            serverId,
            roomName
        }

        // 3. Creat room
        const result = await createRoom( data );

        // 4. Return new room
        return res.status(201).json({
            success : true,
            message : "New Room created Successfully",
            data : result
        })
    }
    // Handle Error appropriately
    catch(error : any){
        logger.error(`Error creating new room with serverid : ${error}`);
        return res.status(500).json({
            success : false,
            message : "Error Creating New Room!!"
        });
    }
}

// 2. Get Room List
export const getRoom = async (req : Request, res : Response) => {
    try {
        // 1. Get userId and serverId from query parameters (RESTful approach for GET requests)
        const userId = req.query.userId as string;
        const serverId = req.query.serverId as string;

        // 2. Validate required parameters
        if (!userId || !serverId) {
            return res.status(400).json({
                success : false,
                message : "userId and serverId are required as query parameters"
            });
        }

        // 3. Create data object
        const data = {
            userId,
            serverId
        }

        // 4. Get rooms
        const result = await getRooms( data );

        // 5. Return response
        return res.status(200).json({
            success : true,
            message : "Room Fetched Successfully",
            data : result
        })
    }
    // Handle the error using catch
    catch(error :any){
        logger.error(`Error fetching room names`, error);
        return res.status(500).json({
            success : false,
            message : error.message || "Error getting room list"
        })
    }

}
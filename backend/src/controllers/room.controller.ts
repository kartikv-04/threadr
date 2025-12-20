import logger from "../config/logger.js";
import type { Request, Response } from "express";
import { createRoom, getRooms } from "../services/room.service.js";

// 1. Create a room
export const newRoom = async (req: Request, res: Response) => {
    try {
        // 1. Get userId
        const userId = (req as any)?.user.id;

        // 2. Validate userId
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized : TokenNot Found"
            })
        }

        // 3. Get serverId and roomName
        const { serverId } = req.params;

        // 4. Validate and check serverId
        if (!serverId) {
            return res.status(400).json({
                success: false,
                message: "ServerId Not Found, try try again!!"
            })
        }

        // 5. Get Room name thorugh req body
        const roomName = req.body.roomName;

        // 6. Check and validate roomName
        if (!roomName) {
            return res.status(400).json({
                success: "false",
                message: "Room name Not Found, Try again!"
            })
        }

        // 7. Create data object
        const data = {
            userId,
            roomName,
            serverId
        }

        // 8. Creat room
        const result = await createRoom(data);

        // 9. Return new room
        return res.status(201).json({
            success: true,
            message: "New Room created Successfully",
            data: result
        })
    }
    // Handle Error appropriately
    catch (error: any) {
        logger.error(`Error creating new room with serverid : ${error}`);
        return res.status(500).json({
            success: false,
            message: "Error Creating New Room!!"
        });
    }
}

// 2. Get Room List
export const getRoom = async (req: Request, res: Response) => {
    try {
        // 1. Get userId 
        const userId = (req as any)?.user.id;

        // 2. Validate and check userID
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized : Token not found"
            })
        }

        // 3. Get serverId through params
        const { serverId } = req.params

        // 4. Validate serverId 
        if (!serverId) {
            return res.status(400).json({
                success: false,
                message: "serverId is required in URL Path"
            });
        }

        // 5. Create data object
        const data = {
            userId,
            serverId
        }

        // 6. Get rooms
        const result = await getRooms(data);

        // 7. Return response
        return res.status(200).json({
            success: true,
            message: "Room Fetched Successfully",
            data: result
        })
    }
    // Handle the error using catch
    catch (error: any) {
        logger.error(`Error fetching room names`, error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error getting room list"
        })
    }

}
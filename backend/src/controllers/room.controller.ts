import logger from "../config/logger.js";
import type { Request, Response } from "express";
import { createRoom, getRooms } from "../services/room.service.js";
import { asyncHandler } from "../helper/asyncHandler.js";
import { NewRoom, GetRoomListSchema } from "../validator/zod.js";

// 1. Create a room
export const newRoom = asyncHandler(async (req: Request, res: Response) => {
    // 1. Get userId
    const userId = (req as any)?.user.id;

    // 2. Get serverId and roomName
    const { serverId } = req.params;
    const roomName = req.body.roomName;

    // 3. Validation
    const validatedData = NewRoom.parse({ userId, serverId, roomName });

    // 4. Creat room
    const result = await createRoom(validatedData as any);

    logger.info(`New Room Created Successfully : ${validatedData.roomName}`);

    // 5. Return new room
    return res.status(201).json({
        success: true,
        message: "New Room created Successfully",
        data: result
    })
});

// 2. Get Room List
export const getRoom = asyncHandler(async (req: Request, res: Response) => {
    // 1. Get userId 
    const userId = (req as any)?.user.id;
    const { serverId } = req.params

    // 2. Validate
    const validatedData = GetRoomListSchema.parse({ userId, serverId });

    // 3. Get rooms
    const result = await getRooms(validatedData);

    logger.info("Room list Fetched Successfully");

    // 4. Return response
    return res.status(200).json({
        success: true,
        message: "Room Fetched Successfully",
        data: result
    })
});
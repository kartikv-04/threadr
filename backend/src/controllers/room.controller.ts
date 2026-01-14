import logger from "../config/logger.js";
import type { Request, Response } from "express";
import { createRoom, getRooms } from "../services/room.service.js";
import { asyncHandler } from "../helper/asyncHandler.js";
import { NewRoom, GetRoomListSchema } from "../validator/zod.js";
import { ValidationError } from "../helper/errorClass.js";

//  Create a room
export const newRoom = asyncHandler(async (req: Request, res: Response) => {
    //  Get userId
    const userId = (req as any)?.user.id.toString();

    //  Get serverId and roomName
    const { serverId } = req.params;
    const roomName = req.body.roomName;

    logger.debug(`userId : ${userId}`);
    logger.debug(`serverId : ${serverId}`);
    logger.debug(`roomName : ${roomName}`);

    //  Validation
    const validatedData = NewRoom.safeParse({ userId, serverId, roomName });

    // Handle Error
    if(!validatedData.success){
            logger.error(validatedData.error, "Validation error");
            throw new ValidationError("Validation Failed!")
        }

    //  Creat room
    const result = await createRoom(validatedData.data);

    logger.info(`New Room Created Successfully : ${result.roomName}`);

    //  Return new room
    return res.status(201).json({
        success: true,
        message: "New Room created Successfully",
        data: result
    })
});

//  Get Room List
export const getRoom = asyncHandler(async (req: Request, res: Response) => {
    //  Get userId 
    const userId = (req as any)?.user.id;
    const { serverId } = req.params

    //  Validate
    const validatedData = GetRoomListSchema.safeParse({ userId, serverId });

    // Handle Error
    if(!validatedData.success){
        throw new ValidationError("Validation Failed!")
    }

    //  Get rooms
    const result = await getRooms(validatedData.data);

    logger.info("Room list Fetched Successfully");

    //  Return response
    return res.status(200).json({
        success: true,
        message: "Room Fetched Successfully",
        data: result
    })
});
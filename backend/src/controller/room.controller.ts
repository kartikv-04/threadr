import logger from "../config/logger.js";
import type { Request, Response } from "express";
import { createRoom, getRooms, deleteRoom } from "../service/room.service.js";
import { asyncHandler } from "../helper/asyncHandler.js";

//  Create a room
export const newRoom = asyncHandler(async (req: Request, res: Response) => {
    //  Get userId
    const userId = (req as any).user.id.toString() as string;

    //  Get serverId and roomName
    const { serverId } = req.params as { serverId: string };
    const { roomName } = req.body as { roomName: string };

    logger.debug(`userId : ${userId}`);
    logger.debug(`serverId : ${serverId}`);
    logger.debug(`roomName : ${roomName}`);

    //  Creat room
    const result = await createRoom({ userId, serverId, roomName });

    logger.info(`New Room Created Successfully : ${result.roomName}`);

    // Emit event to server room
    const io = req.app.get("io");
    if (io) {
        io.to(`server:${serverId}`).emit("room:created", result);
    }

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
    const userId = (req as any).user.id.toString() as string;
    const { serverId } = req.params as { serverId: string };

    //  Get rooms
    const result = await getRooms({ userId, serverId });

    logger.info("Room list Fetched Successfully");

    //  Return response
    return res.status(200).json({
        success: true,
        message: "Room Fetched Successfully",
        data: result
    })
});

// Controller function For deleting Server
export const deleteRoomController = asyncHandler(async (req: Request, res: Response) => {
    // Get user id
    const userId = (req as any).user.id.toString() as string;
    const { serverId, roomId } = req.params as { serverId: string; roomId: string };

    // Delete Server
    await deleteRoom({ userId, serverId, roomId });

    // Emit event to server room
    const io = req.app.get("io");
    if (io) {
        io.to(`server:${serverId}`).emit("room:deleted", { roomId, serverId });
    }

    //  Return result
    return res.status(204).send();
});

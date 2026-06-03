import type { Request, Response } from "express";
import { createServer, getServerList, deleteServers, leaveServer } from "../services/server.service.js";
import logger from "../config/logger.js";
import { asyncHandler } from "../helper/asyncHandler.js";

// Controller function for New Server
export const newServer = asyncHandler(async (req: Request, res: Response) => {
    // Get user id
    const userId = (req as any).user.id.toString() as string;

    const { serverName } = req.body as { serverName: string };

    //  Create server by using function
    const result = await createServer({ userId, serverName });

    logger.info(`New Server Created : ${result.serverName}`);

    //  Return result
    return res.status(201).json({
        success: true,
        message: "NewServer Created Successfully",
        data: result
    })
});

//  Controller Function For Getting All Server Name
export const serverName = asyncHandler(async (req: Request, res: Response) => {
    //  Get userId 
    const userId = (req as any).user.id.toString() as string;

    //  Get All Server names using correct service function
    const result = await getServerList({ userId });

    logger.info("Server Names Fetched Successfully");

    //  Return the Response
    return res.status(200).json({
        success: true,
        message: "All Servers Fetched Successfully",
        data: result
    })
});

// Controller function For deleting Server
export const deleteServer = asyncHandler(async (req: Request, res: Response) => {
    // Get user id
    const userId = (req as any).user.id.toString() as string;
    const { serverId } = req.params as { serverId: string };

    // Delete Server
    await deleteServers({ userId, serverId });

    // Emit event to server room
    const io = req.app.get("io");
    if (io) {
        io.to(`server:${serverId}`).emit("server:deleted", { serverId });
    }

    //  Return result
    return res.status(204).send();
});

// Controller function For leaving Server
export const leaveServerController = asyncHandler(async (req: Request, res: Response) => {
    // Get user id
    const userId = (req as any).user.id.toString() as string;
    const { serverId } = req.params as { serverId: string };

    // Leave Server
    await leaveServer({ userId, serverId });

    //  Return success
    return res.status(200).json({
        success: true,
        message: "Left server successfully"
    });
});



import type { Request, Response } from "express";
import { createServer, getServerList, deleteServers, leaveServer } from "../services/server.service.js";
import logger from "../config/logger.js";
import { asyncHandler } from "../helper/asyncHandler.js";
import { NewServer, GetServerListSchema, DeleteServerSchema, LeaveServerSchema } from "../validator/zod.js";
import { ValidationError } from "../helper/errorClass.js";

// Controller function for New Server
export const newServer = asyncHandler(async (req: Request, res: Response) => {
    // Get user id
    const userId = (req as any)?.user.id.toString();

    //  Destructure the req body
    const { serverName } = req.body

    //  Validate using Zod
    const validatedData = NewServer.safeParse({ userId, serverName });

    // Handle Erorr
    if (!validatedData.success) {
        throw new ValidationError("Validation Failed!")
    }

    //  Create server by using function
    const result = await createServer(validatedData.data as any);

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
    const userId = (req as any)?.user.id.toString();

    //  Validate userId
    const validatedData = GetServerListSchema.safeParse({ userId });

    // Handle Error
    if (!validatedData.success) {
        throw new ValidationError("Validation Failed!")
    }

    //  Get All Server names using correct service function
    const result = await getServerList(validatedData.data as any);

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
    const userId = (req as any)?.user.id.toString();

    //  Destructure the req body
    const { serverId } = req.params;

    //  Validate using Zod
    const validatedData = DeleteServerSchema.safeParse({ userId, serverId });

    // Handle Erorr
    if (!validatedData.success) {
        throw new ValidationError("Validation Failed!")
    }

    // Delete Server
    await deleteServers(validatedData.data as any);

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
    const userId = (req as any)?.user.id.toString();

    //  Destructure the req body
    const { serverId } = req.params;

    //  Validate using Zod
    const validatedData = LeaveServerSchema.safeParse({ userId, serverId });

    // Handle Error
    if (!validatedData.success) {
        throw new ValidationError("Validation Failed!")
    }

    // Leave Server
    await leaveServer(validatedData.data as any);

    //  Return success
    return res.status(200).json({
        success: true,
        message: "Left server successfully"
    });
});



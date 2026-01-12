import type { Request, Response } from "express";
import { createServer, getServerMembers, getServerList } from "../services/server.service.js";
import logger from "../config/logger.js";
import { asyncHandler } from "../helper/asyncHandler.js";
import { NewServer, GetServerMemberSchema, GetServerListSchema } from "../validator/zod.js";

// 1. Controller function for New Server
export const newServer = asyncHandler(async (req: Request, res: Response) => {
    // Get user id
    const userId = (req as any)?.user.id;

    // 1. Destructure the req body
    const { serverName } = req.body

    // 2. Validate using Zod
    const validatedData = NewServer.parse({ userId, serverName });

    // 3. Create server by using function
    const result = await createServer(validatedData as any);

    logger.info(`New Server Created : ${validatedData.serverName}`);

    // 4. Return result
    return res.status(201).json({
        success: true,
        message: "NewServer Created Successfully",
        data: result
    })
});

// 2. Controller Function For Getting Server Members
export const serverMember = asyncHandler(async (req: Request, res: Response) => {
    // 1. Get userId 
    const userId = (req as any)?.user.id;
    const { serverId } = req.params;

    // 2. Validate
    const validatedData = GetServerMemberSchema.parse({ userId, serverId });

    // 3. Get Result from Service Function
    const result = await getServerMembers(validatedData);

    logger.info("Server Membrs Fetched Succssfully");

    // 4. Send the Result to User
    return res.status(200).json({
        success: true,
        message: "Members Fetched Successfully",
        data: result
    })
});

// 3. Controller Function For Getting All Server Name
export const serverName = asyncHandler(async (req: Request, res: Response) => {
    // 1. Get userId 
    const userId = (req as any)?.user.id

    // 2. Validate userId
    const validatedData = GetServerListSchema.parse({ userId });

    // 3. Get All Server names using correct service function
    const result = await getServerList(validatedData as any);

    logger.info("Server Names Fetched Successfully");

    // 4. Return the Response
    return res.status(200).json({
        success: true,
        message: "All Servers Fetched Successfully",
        data: result
    })
});


import type { Request, Response } from "express";
import { createServer, getServerMembers, getServerList } from "../services/server.service.js";
import logger from "../config/logger.js";
import { asyncHandler } from "../helper/asyncHandler.js";
import { NewServer, GetServerMemberSchema, GetServerListSchema } from "../validator/zod.js";
import { ValidationError } from "../helper/errorClass.js";

// 1. Controller function for New Server
export const newServer = asyncHandler(async (req: Request, res: Response) => {
    // Get user id
    const userId = (req as any)?.user.id.toString();

    //  Destructure the req body
    const { serverName } = req.body

    //  Validate using Zod
    const validatedData = NewServer.safeParse({ userId, serverName });

    // Handle Erorr
    if(!validatedData.success){
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

//  Controller Function For Getting Server Members
export const serverMember = asyncHandler(async (req: Request, res: Response) => {
    //  Get userId 
    const userId = (req as any)?.user.id;


    const { serverId } = req.params;

    //  Validate
    const validatedData = GetServerMemberSchema.safeParse({ userId, serverId });

    // Handle Error
    if(!validatedData.success){
        throw new ValidationError("Validation Failed!")
    }

    //  Get Result from Service Function
    const result = await getServerMembers(validatedData.data);

    logger.info("Server Membrs Fetched Succssfully");

    //  Send the Result to User
    return res.status(200).json({
        success: true,
        message: "Members Fetched Successfully",
        data: result
    })
});

//  Controller Function For Getting All Server Name
export const serverName = asyncHandler(async (req: Request, res: Response) => {
    //  Get userId 
    const userId = (req as any)?.user.id

    //  Validate userId
    const validatedData = GetServerListSchema.safeParse({ userId });

    // Handle Error
    if(!validatedData.success){
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


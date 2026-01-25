import type { Request, Response } from "express";
import { recieveMessage, sendMessageService } from "../services/message.service.js";
import logger from "../config/logger.js";
import { asyncHandler } from "../helper/asyncHandler.js";
import { RecieveMessage, SendMessageSchema } from "../validator/zod.js";
import { z } from "zod";
import { ValidationError } from "../helper/errorClass.js";

// 1. Send Message Controller
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    // 1 Destructure req body
    const userId = (req as any)?.user?.id?.toString();
    const { roomId } = req.params;
    const { content, serverId } = req.body;

    //  Validate
    const validatedData = SendMessageSchema.safeParse({ userId, serverId, roomId, content });

    // Handle Error
    if (!validatedData.success) {
        throw new ValidationError("Validation Failed!")
    }

    //  Send Message
    const result = await sendMessageService(validatedData.data);

    // Emit socket event for real-time update
    const io = req.app.get("io");
    if (io) {
        io.to(roomId).emit("send:message:room", result);
    } else {
        logger.warn("Socket.io instance not found on app, real-time update failed");
    }

    logger.info("Message Sent Successfully");

    //  Send Response
    return res.status(201).json({
        success: true,
        message: "New message created and sended successfully",
        data: result
    })
});

//  Recieve Message
export const getMessage = asyncHandler(async (req: Request, res: Response) => {
    //  Get parameters from query (RESTful approach for GET requests)
    const userId = (req as any)?.user?.id?.toString();

    // Get roomId from params. serverId will be fetched from room in service or passed via query if needed.
    const { roomId } = req.params;
    const serverId = req.query.serverId as string;

    //  Validate Basic Fields
    const validatedData = RecieveMessage.safeParse({ userId, serverId, roomId });

    // Hanlde Error
    if (!validatedData.success) {
        throw new ValidationError("Validation Failed!")
    }

    //  Get page and limit parameter from and handle pagination
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    //  Ensure safety and negative value by early findings
    if (page < 1 || limit < 1 || limit > 100) { //max limit: 100
        throw new z.ZodError([{
            path: ["page"],
            message: "Invalid page or limit parameters",
            code: "custom"
        }]);
    }

    //  Create data object
    const data = {
        ...validatedData.data,
        page,
        limit
    }

    //  Receive message
    const result = await recieveMessage(data);

    logger.info("Message Recieved Successfully");

    //  Send Response
    return res.status(200).json({
        success: true,
        message: "Message Fetched Successfully",
        data: result
    })
});
import type { Request, Response } from "express";
import { recieveMessage, sendMessageService } from "../services/message.service.js";
import logger from "../config/logger.js";
import { asyncHandler } from "../helper/asyncHandler.js";
import { RecieveMessage, SendMessageSchema } from "../validator/zod.js";
import { z } from "zod";

// 1. Send Message Controller
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    // 1 Destructure req body
    const userId = (req as any)?.user.id;
    const { serverId, roomId } = req.params;
    const { content } = req.body;

    // 2. Validate
    const validatedData = SendMessageSchema.parse({ userId, serverId, roomId, content });

    // 3. Send Message
    const result = await sendMessageService(validatedData);

    logger.info("Message Sent Successfully");

    // 4. Send Response
    return res.status(201).json({
        success: true,
        message: "New message created and sended successfully",
        data: result
    })
});

// 2. Recieve Message
export const getMessage = asyncHandler(async (req: Request, res: Response) => {
    // 1. Get parameters from query (RESTful approach for GET requests)
    const userId = (req as any)?.user.id;

    // 2.Get serverId and roomId from params
    const { serverId, roomId } = req.params;

    // 3. Validate Basic Fields
    const validatedData = RecieveMessage.parse({ userId, serverId, roomId });

    // 4. Get page and limit parameter from and handle pagination
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    // 5. Ensure safety and negative value by early findings
    if (page < 1 || limit < 1 || limit > 100) { //max limit: 100
        throw new z.ZodError([{
            path: ["page"],
            message: "Invalid page or limit parameters",
            code: "custom"
        }]);
    }

    // 6. Create data object
    const data = {
        ...validatedData,
        page,
        limit
    }

    // 7. Receive message
    const result = await recieveMessage(data);

    logger.info("Message Recieved Successfully");

    // 8. Send Response
    return res.status(200).json({
        success: true,
        message: "Message Fetched Successfully",
        data: result
    })
});
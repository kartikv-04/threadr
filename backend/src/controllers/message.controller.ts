import type { Request, Response } from "express";
import { recieveMessage, sendMessageService } from "../services/message.service.js";

// 1. Send Message Controller
export const sendMessage = async (req: Request, res: Response) => {
    try {
        // 1 Destructure req body
        const { userId, serverId, roomId, content } = req.body;

        // 2. Create data object
        const data = {
            userId,
            serverId,
            roomId,
            content
        }

        // 3. Send Message
        const result = await sendMessageService(data);

        // 4. Send Response
        return res.status(201).json({
            success: true,
            message: "New message created and sended successfully",
            data: result
        })
    }
    // Handle error using catch
    catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error sending message"
        })
    }
}

// 2. Recieve Message
export const getMessage = async (req: Request, res: Response) => {
    try {
        // 1. Get parameters from query (RESTful approach for GET requests)
        const userId = (req as any)?.user._id;

        // 2.Check if userID exist
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized : User not Authenticated"
            });
        }

        // 3. Get serverId and roomId from params
        const { serverId, roomId } = req.params;

        // 4. Validate serverId and roomId
        if (!serverId || !roomId) {
            return res.status(400).json({
                success: false,
                message: "serevrId and roomId are required in URL Path!!"
            });
        }

        // 5. Get page and limit parameter from and handle pagination
        const page = req.query.page ? parseInt(req.query.page as string) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 0;

        // 6. Ensure safety and negative value by early findings
        if (page < 1 || limit < 1 || limit > 100) { //max limit: 100
            return res.status(400).json({
                success: false,
                message: "Invalid Parameters"
            })
        }

        // 7. Create data object
        const data = {
            userId,
            serverId,
            roomId,
            page,
            limit
        }

        // 8. Receive message
        const result = await recieveMessage(data);

        // 9. Send Response
        return res.status(200).json({
            success: true,
            message: "Message Fetched Successfully",
            data: result
        })
    }
    // Handle error
    catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error Receiving Messages"
        })
    }
}
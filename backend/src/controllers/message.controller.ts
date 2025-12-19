import type { Request, Response } from "express";
import { recieveMessage, sendMessageService } from "../services/message.service.js";

// 1. Send Message Controller
export const sendMessage = async (req : Request, res : Response) => {
    try {
        // 1 Destructure req body
        const {userId, serverId, roomId, content} = req.body;

        // 2. Create data object
        const data = {
            userId,
            serverId,
            roomId,
            content
        }

        // 3. Send Message
        const result = await sendMessageService( data );

        // 4. Send Response
        return res.status(201).json({
            success : true,
            message : "New message created and sended successfully",
            data : result
        })
    }
    // Handle error using catch
    catch(error : any){
        return res.status(500).json({
            success : false,
            message : error.message || "Error sending message"
        })
    }
}

// 2. Recieve Message
export const getMessage = async (req : Request, res : Response) => {
    try {
        // 1. Get parameters from query (RESTful approach for GET requests)
        const userId = req.query.userId as string;
        const serverId = req.query.serverId as string;
        const roomId = req.query.roomId as string;
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

        // 2. Validate required parameters
        if (!userId || !serverId || !roomId) {
            return res.status(400).json({
                success : false,
                message : "userId, serverId, and roomId are required as query parameters"
            });
        }

        // 3. Create data object
        const data = {
            userId, 
            serverId,
            roomId,
            page,
            limit
        }

        // 4. Receive message
        const result = await recieveMessage( data );

        // 5. Send Response
        return res.status(200).json({
            success : true,
            message : "Message Fetched Successfully",
            data : result
        })
    }
    // Handle error
    catch(error : any){
        return res.status(500).json({
            success : false,
            message : error.message || "Error Receiving Messages"
        })
    }
}
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
            message : "Error sending message"
        })
    }
}

// 2. Recieve Message
export const getMessage = async (req : Request, res : Response) => {
    try {
        // 1. Destructure req body
        const{userId, serverId, roomId, page, limit} = req.body

        // 2. Create data object
        const data = {
            userId, 
            serverId,
            roomId,
            page,
            limit
        }

        // 3. Receive message
        const result = await recieveMessage( data );

        // 4. Send Response
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
            message : "Error Receiving Messages"
        })
    }
}
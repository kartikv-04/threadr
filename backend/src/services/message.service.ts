import type { Types } from "mongoose"
import logger from "../config/logger.js"
import { serverModel } from "../models/server.model.js"
import { messageModel } from "../models/message.model.js"
import type { GetMessages, MessageResponse, SendMessage, SendMessageResponse } from "../types/types.js"
import { userModel } from "../models/user.model.js"
import { roomModel } from "../models/room.model.js"


export const sendMessageService = async ( data : SendMessage ) : Promise<SendMessageResponse> => {
    try {
        // Check if all fields are valid and not empty
        if (!data.userId || !data.serverId || !data.roomId || !data.content) {
            logger.warn(`Missing Fields ${data.userId}, ${data.serverId} and many more`);
            throw new Error("Empty Fields recieved!Ensure filling details");
        }

        // Find server and Check if user exist by cheking if memebr of server 
        const findServer  = await serverModel.findById(data.serverId);
        if(!findServer){
            logger.warn("Server does not Exist!");
            throw new Error("Server does not exist !");
        }

        // if server exist check is user is member or not
        const isMember = findServer?.members.includes(data.userId);
        if(!isMember){
            logger.warn(`Unauthorized attempt to get messages by user with ${data.userId}`);
            throw new Error("Unauthorized request to view message");
        }

        // Save the message into model and update the room field
        const newMessage = await messageModel.create({
            content : data.content,
            sentBy : data.userId,
            room : data.roomId
        })
        
        // Populate message model to get username
        await newMessage.populate("sentBy", "username");

        // Return messageId, isEdited, sentBy
        const populated = newMessage as any

        // Return with valid types and info
        return {
            messageId : newMessage._id.toString(),
            content : populated.content,
            userId : data.userId.toString(),
            isEdited : newMessage.isEdited,
            sentBy : populated.sentBy,
            createdAt : populated.createdAt
        }

    }
    catch(err : any){
        logger.error({err}, "Error Sending message");
        throw new Error("Error Sending Message");
    }
}

export const recieveMessage = async ( data : GetMessages) : Promise<MessageResponse> => {
    try {
        // 1. Validatoin : Check if Fields Exist
        if(!data.userId || !data.serverId || !data.roomId){
            logger.warn("Missing fields for recieving messages!!");
            throw new Error("Missing required fields for getting messages!");
        }

        // 2. Check if Server Exist
        const ifServer = await serverModel.findById(data.serverId);
        if(!ifServer){
            logger.warn("Server not found!");
            throw new Error("Server not found!");
        }

        // 3. Check if User is part of the server or not
        const ifUser = ifServer.members.includes(data.userId as any);
        if(!ifUser){
            logger.warn(`Unauthorized attempt to view message with userid : ${data.userId}`);
            throw new Error("You are not memebr of these server!");
        }

        // 4. Check if Romm Exist or Not
        const roomExist = await roomModel.findById(data.roomId);
        if(!roomExist){
            logger.warn(`Room does not exist with these roomid : ${data.roomId}`);
            throw new Error("Room could not be found!");
        }

        // 5. Define the skip, page, and limit to fetch the message
        const page = data.page || 1;    //Default page : 1
        const limit = data.limit || 50;   //Default limit : 50
        const skip = (page -1) * limit

        // 6. Get the messages in decending order, as new ones first
        const messages = await messageModel.find({room : data.roomId})
            .sort({createdAt : -1})
            .skip(skip)
            .limit(limit)
            .populate("sentBy", "username")
            .lean();

        // 7. Reverse message arrray to reverse before sending to frontend
        const soretedMessage = messages.reverse() as any;

        return soretedMessage.map((msg:any)=>({
            messageId : msg._id.toString(),
            content : msg.content,
            userId : msg.sentBy._id.toString(),
            username : msg.sentBy.username,
            isEdited : msg.isEdited,
            createdAt : msg.createdAt

        }))
        
    }
    catch(err : any){
        logger.error({err}, `Error recieving message woth these details at function : ${data}`);
        throw new Error("Error fetching message, Try again later!!");
    }
}
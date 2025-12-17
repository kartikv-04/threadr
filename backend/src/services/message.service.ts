import type { Types } from "mongoose"
import logger from "../config/logger.js"
import { serverModel } from "../models/server.model.js"
import { messageModel } from "../models/message.model.js"
import { populate } from "dotenv"

type SendMessage = {
    userId : Types.ObjectId,
    serverId : Types.ObjectId,
    roomId : Types.ObjectId,
    content : string
}

type SendMessageResponse = {
    messageId : string,
    content : string,
    isEdited : boolean,
    userId : string,
    sentBy : string,
    createdAt : Date
}

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
        const isMemebr = findServer?.members.includes(data.userId);
        if(!isMemebr){
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
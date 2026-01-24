import logger from "../config/logger.js"
import { serverModel } from "../models/server.model.js"
import { messageModel } from "../models/message.model.js"
import type { GetMessagesRequest, MessageResponse, SendMessageRequest } from "../types/types.js"
import { roomModel } from "../models/room.model.js"
import { memberModel } from "../models/member.model.js"
import { NotFoundError, UnauthorizedError, ValidationError } from "../helper/errorClass.js";


export const sendMessageService = async (data: SendMessageRequest): Promise<MessageResponse> => {
    // Check if all fields are valid and not empty
    if (!data.userId || !data.serverId || !data.roomId || !data.content) {
        logger.warn(`Missing Fields ${data.userId}, ${data.serverId} and many more`);
        throw new ValidationError("Empty Fields recieved!Ensure filling details");
    }

    // Find server and Check if user exist by cheking if memebr of server 
    const findServer = await serverModel.findById(data.serverId);
    if (!findServer) {
        logger.warn("Server does not Exist!");
        throw new NotFoundError("Server does not exist !");
    }

    // if server exist check is user is member or not
    const isMember = await memberModel.findOne({ user: data.userId, server: data.serverId });
    if (!isMember) {
        logger.warn(`Unauthorized attempt to send message by user with ${data.userId}`);
        throw new UnauthorizedError("You are not a member of this server!");
    }

    // Save the message into model and update the room field
    const newMessage = await messageModel.create({
        content: data.content,
        sentBy: data.userId,
        room: data.roomId,
        server: data.serverId
    })

    // Populate message model to get username
    const populatedMessage = await newMessage.populate<{ sentBy: { username: string } }>("sentBy", "username");

    // Return messageId, isEdited, sentBy
    const populated = populatedMessage as any

    // Return with valid types and info
    return {
        messageId: newMessage._id.toString(),
        content: populated.content,
        userId: data.userId.toString(),
        username: populated.sentBy.username,
        isEdited: newMessage.isEdited,
        createdAt: populated.createdAt,
        roomId: data.roomId,
        serverId: data.serverId
    }
}

export const recieveMessage = async (data: GetMessagesRequest): Promise<MessageResponse> => {
    // 1. Validatoin : Check if Fields Exist
    if (!data.userId || !data.serverId || !data.roomId) {
        logger.warn("Missing fields for recieving messages!!");
        throw new ValidationError("Missing required fields for getting messages!");
    }

    // 2. Check if Server Exist
    const ifServer = await serverModel.findById(data.serverId);
    if (!ifServer) {
        logger.warn("Server not found!");
        throw new NotFoundError("Server not found!");
    }

    // 3. Check if User is part of the server or not
    const isMember = await memberModel.findOne({ user: data.userId, server: data.serverId });
    if (!isMember) {
        logger.warn(`Unauthorized attempt to view message with userid : ${data.userId}`);
        throw new UnauthorizedError("You are not memebr of these server!");
    }

    // 4. Check if Romm Exist or Not
    const roomExist = await roomModel.findById(data.roomId);
    if (!roomExist) {
        logger.warn(`Room does not exist with these roomid : ${data.roomId}`);
        throw new NotFoundError("Room could not be found!");
    }

    // 5. Define the skip, page, and limit to fetch the message
    const page = data.page || 1;    //Default page : 1
    const limit = data.limit || 50;   //Default limit : 50
    const skip = (page - 1) * limit

    // 6. Get the messages in decending order, as new ones first
    const messages = await messageModel.find({ room: data.roomId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sentBy", "username")
        .lean();

    // 7. Reverse message arrray to reverse before sending to frontend
    const soretedMessage = messages.reverse() as any;

    return soretedMessage.map((msg: any) => ({
        messageId: msg._id.toString(),
        content: msg.content,
        userId: msg.sentBy._id.toString(),
        username: msg.sentBy.username,
        isEdited: msg.isEdited,
        createdAt: msg.createdAt,
        roomId: msg.room.toString(),
        serverId: msg.server.toString()
    }))
}
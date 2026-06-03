import logger from "../config/logger.js"
import { serverModel } from "../models/server.model.js"
import { messageModel } from "../models/message.model.js"
import type { DeleteMessageRequest, EditMessageRequest, GetMessagesRequest, MessageResponse, SendMessageRequest } from "../types/message.js"
import { roomModel } from "../models/room.model.js"
import { memberModel } from "../models/member.model.js"
import { NotFoundError, UnauthorizedError, ValidationError } from "../helper/errorClass.js";


export const sendMessageService = async (data: SendMessageRequest): Promise<MessageResponse> => {
    // Check if all fields are valid and not empty
    if (!data.userId || !data.serverId || !data.roomId || !data.content) {
        logger.warn("Required fields for sending a message are missing.");
        throw new ValidationError("Required fields are missing. Please provide all details.");
    }

    // Find server and Check if user exist by cheking if memebr of server 
    const findServer = await serverModel.findById(data.serverId);
    if (!findServer) {
        logger.warn("Attempted to send a message to a non-existent server.");
        throw new NotFoundError("The specified server does not exist.");
    }

    // if server exist check is user is member or not
    const isMember = await memberModel.findOne({ user: data.userId, server: data.serverId });
    if (!isMember) {
        logger.warn("Unauthorized attempt to send a message.");
        throw new UnauthorizedError("You are not a member of this server.");
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

export const recieveMessageService = async (data: GetMessagesRequest): Promise<MessageResponse> => {
    // 1. Validatoin : Check if Fields Exist
    if (!data.userId || !data.serverId || !data.roomId) {
        logger.warn("Incomplete parameters for message retrieval.");
        throw new ValidationError("Required fields are missing for message retrieval.");
    }

    // 2. Check if Server Exist
    const ifServer = await serverModel.findById(data.serverId);
    if (!ifServer) {
        logger.warn("Server not found.");
        throw new NotFoundError("The specified server could not be found.");
    }

    // 3. Check if User is part of the server or not
    const isMember = await memberModel.findOne({ user: data.userId, server: data.serverId });
    if (!isMember) {
        logger.warn("Unauthorized server data access attempt.");
        throw new UnauthorizedError("You are not a member of this server.");
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

export const editMessageService = async (data: EditMessageRequest): Promise<MessageResponse> => {
    // cjeck to see if any field is missing
    if (!data.userId || !data.roomId || !data.messageId || !data.content) {
        logger.warn("Missing Required firelds");
        throw new ValidationError("Required fields are missing. Please provide all details.");
    }

    const room = await roomModel.findById(data.roomId).select("_id server");
    if (!room) {
        logger.warn("Room not found for edit message");
        throw new NotFoundError("Room Not Found");
    }

    // Check if user is member and not banned for the room's server
    const isMember = await memberModel.findOne({
        server: room.server,
        user: data.userId,
        isBanned: false
    });

    if (!isMember) {
        logger.warn("Unauthorized edit attempt by non-member or banned member");
        throw new UnauthorizedError("You are not allowed to edit messages in this room.");
    }

    // Now check and validate message against room, server, and owner
    const updateMessage = await messageModel
        .findOne({
            _id: data.messageId,
            room: data.roomId,
            server: room.server,
            sentBy: data.userId
        })
        .populate<{ sentBy: { _id: { toString(): string }; username: string } }>("sentBy", "username");

    if (!updateMessage) {
        logger.warn("Requested message to edit was not found or does not belong to user");
        throw new NotFoundError("Message Not Found");
    }

    // Update the message
    updateMessage.isEdited = true;
    updateMessage.content = data.content;
    updateMessage.editedAt = new Date();

    // Save updated 
    await updateMessage.save();

    return {
        messageId: updateMessage._id.toString(),
        content: updateMessage.content,
        userId: updateMessage.sentBy._id.toString(),
        username: updateMessage.sentBy.username,
        isEdited: updateMessage.isEdited,
        createdAt: updateMessage.createdAt,
        roomId: updateMessage.room.toString(),
        serverId: room.server.toString()
    };
}

export const deleteMessageService = async (data: DeleteMessageRequest): Promise<undefined> => {
    // check to see if any field is missing
    if (!data.userId || !data.roomId || !data.messageId) {
        logger.warn("Missing Required firelds");
        throw new ValidationError("Required fields are missing. Please provide all details.");
    }

    const room = await roomModel.findById(data.roomId).select("_id server");
    if (!room) {
        logger.warn("Room not found for edit message");
        throw new NotFoundError("Room Not Found");
    }

    // Check if user is member and not banned for the room's server
    const isMember = await memberModel.findOne({
        server: room.server,
        user: data.userId,
        isBanned: false
    });

    if (!isMember) {
        logger.warn("Unauthorized delete attempt by non-member or banned member");
        throw new UnauthorizedError("You are not allowed to delete messages in this room.");
    }

    // Now check and validate message against room, server, and owner
    const deleteMessage = await messageModel
        .findOne({
            _id: data.messageId,
            room: data.roomId,
            server: room.server,
            sentBy: data.userId
        })
        .populate<{ sentBy: { _id: { toString(): string }; username: string } }>("sentBy", "username");

    if (!deleteMessage) {
        logger.warn("Requested message to delete was not found or does not belong to user");
        throw new NotFoundError("Message Not Found");
    }

    // delete message 
    await messageModel.deleteOne({ _id: data.messageId });
}

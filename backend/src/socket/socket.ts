import { Socket, Server } from "socket.io";
import logger from "../config/logger.js";
import { userModel } from "../models/user.model.js";
import { messageModel } from "../models/message.model.js";
import { serverModel } from "../models/server.model.js";
import { roomModel } from "../models/room.model.js";

// Track online users: userId -> socketId
const onlineUsers = new Map<string, string>();

// Socket with user data attached
interface AuthenticatedSocket extends Socket {
    user?: {
        _id: string;
        username: string;
    };
}

export const socketHandler = async (io: Server, socket: AuthenticatedSocket) => {
    const user = socket.user;

    if (!user) {
        socket.disconnect();
        return;
    }

    const userId = user._id.toString();
    const username = user.username;

    logger.info(`User connected: ${username} - Socket: ${socket.id}`);

    // ===== USER ONLINE =====
    onlineUsers.set(userId, socket.id);
    await userModel.findByIdAndUpdate(userId, { isOnline: true });
    socket.broadcast.emit("user:online", { userId, username });

    // ===== JOIN ROOM =====
    socket.on("room:join", async (roomId: string) => {
        try {
            const room = await roomModel.findById(roomId);
            if (!room) {
                socket.emit("error", { message: "Room not found" });
                return;
            }

            socket.join(`room:${roomId}`);
            logger.info(`${username} joined room: ${room.roomName}`);
            socket.emit("room:joined", { roomId, roomName: room.roomName });

        } catch (error: any) {
            logger.error(`Error joining room: ${error.message}`);
            socket.emit("error", { message: "Failed to join room" });
        }
    });

    // ===== LEAVE ROOM =====
    socket.on("room:leave", (roomId: string) => {
        socket.leave(`room:${roomId}`);
        logger.info(`${username} left room: ${roomId}`);
    });

    // ===== SEND MESSAGE =====
    socket.on("message:send", async (data: { serverId: string; roomId: string; content: string }) => {
        try {
            const { serverId, roomId, content } = data;

            if (!content?.trim()) {
                socket.emit("error", { message: "Message cannot be empty" });
                return;
            }

            // Verify user is member of server
            const server = await serverModel.findById(serverId);
            if (!server || !server.members.some(m => m.toString() === userId)) {
                socket.emit("error", { message: "Unauthorized" });
                return;
            }

            // Save message to database
            const newMessage = await messageModel.create({
                content: content.trim(),
                sentBy: userId,
                room: roomId
            });

            await newMessage.populate("sentBy", "username");

            const messageData = {
                messageId: newMessage._id.toString(),
                content: newMessage.content,
                userId,
                username: (newMessage.sentBy as any).username,
                isEdited: newMessage.isEdited,
                roomId,
                createdAt: (newMessage as any).createdAt
            };

            // Broadcast to everyone in the room
            io.to(`room:${roomId}`).emit("message:new", messageData);
            logger.info(`Message sent by ${username} in room ${roomId}`);

        } catch (error: any) {
            logger.error(`Error sending message: ${error.message}`);
            socket.emit("error", { message: "Failed to send message" });
        }
    });

    // ===== DISCONNECT =====
    socket.on("disconnect", async () => {
        logger.info(`User disconnected: ${username}`);

        onlineUsers.delete(userId);
        await userModel.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeenAt: new Date()
        });

        socket.broadcast.emit("user:offline", { userId, username });
    });
};
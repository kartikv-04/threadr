import { Server } from "socket.io";
import logger from "../config/logger.js";
import type { AuthenticatedSocket } from "../types/socket.js";
import { sendMessageService } from "../services/message.service.js";

export const messageHandler = (io: Server, socket: AuthenticatedSocket) => {

    socket.on("send:message", async ({ serverId, roomId, msg }: { serverId: string, roomId: string, msg: string }) => {
        try {
            const userId = socket.user?._id.toString();

            if (!userId) {
                logger.warn(`Unauthenticated socket tried to send message: ${socket.id}`);
                socket.emit("error", { message: "Not authenticated" });
                return;
            }

            // Save message to database
            const newMessage = await sendMessageService({
                userId,
                serverId,
                roomId,
                content: msg
            });

            // Broadcast to everyone in the room (including sender)
            io.to(roomId).emit("send:message:room", newMessage);

        } catch (error: any) {
            logger.error(`Failed to send message: ${error.message}`);
            socket.emit("error", { message: "Failed to send message" });
        }
    });

    socket.on("disconnect", () => {
        logger.info(`Socket ${socket.id} disconnected`);
    });
};
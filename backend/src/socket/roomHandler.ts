
import type { Server } from "socket.io"
import logger from "../config/logger.js";
import type { Socket } from "socket.io";

export const roomHandler = (_io: Server, socket: Socket) => {

    socket.on("join:room", (roomId: string) => {
        socket.join(roomId);
        logger.debug(`Socket ${socket.id} joined room: ${roomId}`);

    })

    socket.on("leave:room", (roomId: string) => {
        socket.leave(roomId);
        logger.debug(`Socket ${socket.id} left room: ${roomId}`);

    })

    socket.on("join:server", (serverId: string) => {
        socket.join(`server:${serverId}`);
        logger.debug(`Socket ${socket.id} joined server room: server:${serverId}`);
    })

    socket.on("leave:server", (serverId: string) => {
        socket.leave(`server:${serverId}`);
        logger.debug(`Socket ${socket.id} left server room: server:${serverId}`);
    })
}
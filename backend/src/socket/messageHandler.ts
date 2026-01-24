import { Server } from "socket.io";
import logger from "../config/logger.js";
import type { Socket } from "socket.io";

export const messageHandler = (io : Server, socket : Socket) => {

    // user recieves message from client
    socket.on("send:message", ( {roomId, msg} : {roomId : string, msg : string}) => {
        logger.info(`Message recieved : ${msg}`);

        // User emits message to entire room currently in 
        socket.to(roomId).emit("send:message:room", ({roomId, msg}));
    })

    socket.on("disconnect", () => {
    logger.info(`Socket ${socket.id} disconnected`);
})
}




import { io } from "socket.io-client";
import { Message } from "@/feature/chat/type";

const socket = io("http://localhost:5000");

export function sendMessage(roomId : string, msg : string){
    socket.emit("send:message", ({roomId, msg}));
}

export function receiveMessage(callbackFn: (msg: Message) => void) {
    const handler = (msg: Message) => {
        callbackFn(msg);
    };
    
    socket.on("send:message:room", handler);
    
    return () => socket.off("send:message:room", handler);
}

export function joinRoom(roomId : string){
    socket.emit("join:room", roomId);
}

export function leaveRoom(roomId : string){
    socket.emit("leave:room", roomId);
}

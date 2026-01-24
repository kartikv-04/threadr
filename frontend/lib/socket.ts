import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// function to send message
export function sendMessage(roomId : string, msg : string){
    socket.emit("send:message", ({roomId, msg}));

}

export function receiveMessage(callbackFn: (msg: string) => void) {
    const handler = (msg: string) => {
        callbackFn(msg);
    };
    
    socket.on("send:message:room", handler);
    
    // Return cleanup function
    return () => socket.off("send:message:room", handler);
}

export function joinRoom(roomId : string){
    socket.emit("join:room", roomId);
}

export function leaveRoom(roomId : string){
    socket.emit("leave:room", roomId);
}





import { io, Socket } from "socket.io-client";
import { Message } from "@/feature/chat/chat.type";

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";

export const socket: Socket = io(URL, {
    autoConnect: false,
    withCredentials: true
});

export function connectSocket(token: string) {
    if (socket.connected) return;

    socket.auth = { token };
    socket.connect();
}

export function disconnectSocket() {
    if (socket.connected) {
        socket.disconnect();
    }
}

export function sendMessage(serverId: string, roomId: string, msg: string) {
    socket.emit("send:message", { serverId, roomId, msg });
}

export function receiveMessage(callbackFn: (msg: Message) => void) {
    const handler = (msg: Message) => {
        callbackFn(msg);
    };

    socket.on("send:message:room", handler);

    return () => socket.off("send:message:room", handler);
}

export function joinRoom(roomId: string) {
    socket.emit("join:room", roomId);
}

export function leaveRoom(roomId: string) {
    socket.emit("leave:room", roomId);
}

"use client";

import { useEffect, useRef } from 'react';
import { useRoomStore } from '@/store/RoomStore';
import { useMessageStore } from '@/store/MessageStore';
import { joinRoom, leaveRoom, receiveMessage, connectSocket, disconnectSocket } from './socket';
import { useGetMessages } from '@/feature/chat/hook';
import { useAuthStore } from '@/store/AuthStore';
import { useServerStore } from '@/store/ServerStore';
import { Message } from '@/feature/chat/type';

export const useSocketManager = () => {
    const { activeRoomId } = useRoomStore();
    const { activeServerId } = useServerStore();
    const { accessToken } = useAuthStore();
    const { addMessage, setMessages, clearMessages } = useMessageStore();
    const previousRoomIdRef = useRef<string | null>(null);

    const { data: initialMessages, isSuccess, isFetching } = useGetMessages(activeServerId, activeRoomId);

    // Socket Connection
    useEffect(() => {
        if (accessToken) {
            connectSocket(accessToken);
        }
        return () => {
            // Optional: only disconnect on full unmount if needed
        };
    }, [accessToken]);

    // Message Sync
    useEffect(() => {
        if (isSuccess && initialMessages?.messages) {
            console.log("Setting initial messages:", initialMessages.messages.length);
            setMessages(initialMessages.messages);
        }
    }, [isSuccess, initialMessages, setMessages]);

    // Clear messages when changing rooms
    useEffect(() => {
        if (activeRoomId !== previousRoomIdRef.current) {
            console.log("Room changed, clearing messages");
            clearMessages();
        }
    }, [activeRoomId, clearMessages]);

    // Room and Message Listeners
    useEffect(() => {
        const previousRoomId = previousRoomIdRef.current;

        if (activeRoomId && activeRoomId !== previousRoomId) {
            if (previousRoomId) {
                leaveRoom(previousRoomId);
            }
            joinRoom(activeRoomId);
            previousRoomIdRef.current = activeRoomId;
        }

        const cleanup = receiveMessage((message: Message) => {
            console.log("New message received via socket:", message);
            // Only add if it belongs to current room
            if (message.roomId === activeRoomId) {
                addMessage(message);
            }
        });

        return () => {
            cleanup();
        };
    }, [activeRoomId, addMessage]);
};

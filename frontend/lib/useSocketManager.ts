"use client";

import { useEffect, useRef } from 'react';
import { useRoomStore } from '@/store/RoomStore';
import { useMessageStore } from '@/store/MessageStore';
import { joinRoom, leaveRoom, receiveMessage } from './socket';
import { useGetMessages } from '@/feature/chat/hook';
import { useAuthStore } from '@/store/AuthStore';
import { useServerStore } from '@/store/ServerStore';
import { Message } from '@/feature/chat/type';

export const useSocketManager = () => {
    const { activeRoomId } = useRoomStore();
    const { activeServerId } = useServerStore();
    const { addMessage, setMessages, clearMessages } = useMessageStore();
    const previousRoomIdRef = useRef<string | null>(null);

    const { data: initialMessages, isSuccess } = useGetMessages(activeServerId, activeRoomId);

    useEffect(() => {
        // Set initial messages when the room changes and data is fetched
        if (isSuccess && initialMessages?.messages) {
            setMessages(initialMessages.messages);
        } else {
            // Clear messages if there are no messages or on room change
            clearMessages();
        }
    }, [isSuccess, initialMessages, setMessages, clearMessages, activeRoomId]);

    useEffect(() => {
        const previousRoomId = previousRoomIdRef.current;

        // If there's a new room, join it
        if (activeRoomId && activeRoomId !== previousRoomId) {
            // Leave the previous room if there was one
            if (previousRoomId) {
                leaveRoom(previousRoomId);
            }
            joinRoom(activeRoomId);
            previousRoomIdRef.current = activeRoomId;
        }

        // Setup message receiver
        const cleanup = receiveMessage((message: Message) => {
            addMessage(message);
        });

        return () => {
            cleanup();
            // On component unmount, leave the current room
            if (activeRoomId) {
                leaveRoom(activeRoomId);
            }
        };
    }, [activeRoomId, addMessage]);
};

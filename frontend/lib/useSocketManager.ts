"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/feature/auth/AuthStore"; 
import { connectSocket, disconnectSocket, socket } from "./socket";

export const useSocketManager = () => {
  // Watch the Access Token
  const { accessToken } = useAuthStore();

  useEffect(() => {
    // If we have a token and aren't connected, connect!
    if (accessToken) {
      console.log(" Auth detected, initializing socket...");
      connectSocket(accessToken);
    } 
    // If token is gone (logout), kill the connection
    else {
      console.log(" No auth, disconnecting socket...");
      disconnectSocket();
    }

    // Cleanup: When the app closes or unmounts, disconnect
    return () => {
      disconnectSocket();
    };
  }, [accessToken]); // Re-run this logic only when login state changes

  // Add global event listeners for debugging
  useEffect(() => {
    function onConnect() {
      console.log(" Socket Connected via Manager:", socket.id);
    }

    function onDisconnect() {
      console.log(" Socket Disconnected");
    }

    function onConnectError(err: any) {
      console.error(" Socket Connection Error:", err.message);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, []);
};
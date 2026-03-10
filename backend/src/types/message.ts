// ==========================================
// MESSAGE TYPES
// ==========================================

export type SendMessageRequest = {
    userId: string; // The sender
    serverId: string;
    roomId: string;
    content: string;
}

export type MessageResponse = {
    messageId: string;
    content: string;
    userId: string; // ID of the sender (User Model)
    username: string; // Display name
    isEdited: boolean;
    createdAt: Date;
    roomId: string;
    serverId: string;
    replyTo?: string;
}

export interface GetMessagesRequest {
    userId: string;
    serverId: string;
    roomId: string;
    page?: number;  // Optional: Default to 1
    limit?: number; // Optional: Default to 50
}
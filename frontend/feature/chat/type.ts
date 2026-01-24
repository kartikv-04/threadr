// Message Types for Chat Feature

export type Message = {
    messageId: string;
    content: string;
    userId: string;
    username: string;
    isEdited: boolean;
    createdAt: string;
    roomId?: string;
    serverId?: string;
};

// Request Types
export type SendMessageRequest = {
    serverId: string;
    roomId: string;
    content: string;
};

export type GetMessagesRequest = {
    serverId: string;
    roomId: string;
    page?: number;
    limit?: number;
};

// Response Types
export type SendMessageResponse = {
    messageId: string;
    content: string;
    userId: string;
    isEdited: boolean;
    createdAt: string;
};

export type GetMessagesResponse = {
    messages: Message[];
};

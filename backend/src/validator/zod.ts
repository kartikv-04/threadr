import * as z from "zod";

// Signup Zod Validation Schema
export const Signup = z.object({
    username: z.string().min(3).max(20).trim().lowercase(),
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(3).max(20)
})

// Signin Zod Validation Schema
export const Signin = z.object({
    email: z.email(),
    password: z.string().min(3).max(20)
})

// New Server Creation Zod Validation
export const NewServer = z.object({
    userId: z.string().min(24),
    serverName: z.string().min(2).max(50).trim()
})

// New Room Zod Validation
export const NewRoom = z.object({
    userId: z.string().min(24),
    roomName: z.string().min(2).max(50).trim().lowercase(),
    serverId: z.string().min(24)
})

// Get Message / Receive Message Zod Validation
export const RecieveMessage = z.object({
    userId: z.string().min(24),
    serverId: z.string().min(24),
    roomId: z.string().min(24),
})

// Send Message Zod Validation
export const SendMessageSchema = z.object({
    userId: z.string().min(24),
    serverId: z.string().min(24),
    roomId: z.string().min(24),
    content: z.string().min(1, "Message content is required")
})

// Get Server Members Zod Validation
export const GetServerMemberSchema = z.object({
    userId: z.string().min(24),
    serverId: z.string().min(1, "Server ID is required")
})

// Get Server List Zod Validation
export const GetServerListSchema = z.object({
    userId: z.string().min(24)
})

// Get Room List Zod Validation
export const GetRoomListSchema = z.object({
    userId: z.string().min(24),
    serverId: z.string().min(1, "Server ID is required")
})
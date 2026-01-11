import * as z from "zod";

// Signup Zod Validation Schema
export const Signup = z.object({
    username : z.string().min(3).max(20).trim().lowercase(),
    name : z.string().min(2).max(50),
    email : z.email(),
    password : z.string().min(3).max(20)
})

// Signin Zod Validation Schema
export const Signin = z.object({
    email : z.email(),
    password : z.string().min(3).max(20)
})

// New Server Creation Zod Validation
export const NewServer = z.object({
    userId : z.string().min(24),
    serverName : z.string().min(2).max(50).trim().trim()
})

// New Room Zod Validation
export const NewRoom = z.object({
    userId : z.string().min(24),
    roomName : z.string().min(2).max(50).trim().lowercase(),
    serverId : z.string().min(24)
})

// Get Message / Receive Message Zod Validation
export const RecieveMessage = z.object({
    userId : z.string().min(24),
    serverId : z.string().min(24),
    roomId : z.string().min(24),
})
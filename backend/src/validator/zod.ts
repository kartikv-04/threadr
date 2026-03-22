import * as z from "zod";

const objectId = z.string().trim().length(24);

// Signup Zod Validation Schema
export const Signup = z.object({
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
    userId: objectId,
    serverName: z.string().min(2).max(50).trim()
})

// New Room Zod Validation
export const NewRoom = z.object({
    userId: objectId,
    roomName: z.string().min(2).max(50).trim().lowercase(),
    serverId: objectId
})

// Get Message / Receive Message Zod Validation
export const RecieveMessage = z.object({
    userId: objectId,
    serverId: objectId,
    roomId: objectId,
})

// Send Message Zod Validation
export const SendMessageSchema = z.object({
    userId: objectId,
    serverId: objectId,
    roomId: objectId,
    content: z.string().trim().min(1, "Message content is required")
})

// Get Server Members Zod Validation
export const GetServerMemberSchema = z.object({
    userId: objectId,
    serverId: z.string().min(1, "Server ID is required")
})

// Get Server List Zod Validation
export const GetServerListSchema = z.object({
    userId: objectId
})

// Get Room List Zod Validation
export const GetRoomListSchema = z.object({
    userId: objectId,
    serverId: z.string().min(1, "Server ID is required")
})

// Delete Server Zod Validation
export const DeleteServerSchema = z.object({
    userId: objectId,
    serverId: objectId
})

export const LeaveServerSchema = z.object({
    userId: objectId,
    serverId: objectId
})

export const DeleteRoomSchema = z.object({
    userId: objectId,
    serverId: objectId,
    roomId: objectId
})

export const generateInviteSchema = z.object({
    serverId: z.string().min(1, "Server ID is required"),
    options: z.object({
        expiresIn: z.enum(["30m", "1h", "6h", "12h", "1d", "7d", "never"]).optional(),
        maxUses: z.number().int().min(0).optional(), // min(0) prevents negative numbers
    }).optional(),
});

export const inviteResponseSchema = z.object({
    url: z.string().url(),
    code: z.string().min(1),
    expiresAt: z.date().nullable(), // Nullable because it might be "never"
    isPermanent: z.boolean(),
});

export const SignupRequestSchema = z.object({
    body: Signup
});

export const SigninRequestSchema = z.object({
    body: Signin
});

export const GetUserRequestSchema = z.object({
    params: z.object({
        userId: objectId
    })
});

export const NewServerRequestSchema = z.object({
    body: z.object({
        serverName: z.string().min(2).max(50).trim()
    })
});

export const DeleteServerRequestSchema = z.object({
    params: z.object({
        serverId: objectId
    })
});

export const LeaveServerRequestSchema = z.object({
    params: z.object({
        serverId: objectId
    })
});

export const CreateRoomRequestSchema = z.object({
    params: z.object({
        serverId: objectId
    }),
    body: z.object({
        roomName: z.string().min(2).max(50).trim().toLowerCase()
    })
});

export const GetRoomListRequestSchema = z.object({
    params: z.object({
        serverId: objectId
    })
});

export const DeleteRoomRequestSchema = z.object({
    params: z.object({
        serverId: objectId,
        roomId: objectId
    })
});

export const SendMessageRequestSchema = z.object({
    params: z.object({
        roomId: objectId
    }),
    body: z.object({
        serverId: objectId,
        content: z.string().trim().min(1, "Message content is required")
    })
});

export const ReceiveMessageRequestSchema = z.object({
    params: z.object({
        roomId: objectId
    }),
    query: z.object({
        serverId: objectId,
        page: z.coerce.number().int().min(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional()
    })
});

export const CreateInviteRequestSchema = z.object({
    params: z.object({
        serverId: objectId
    })
});

export const GetInviteInfoRequestSchema = z.object({
    params: z.object({
        code: z.string().trim().min(1)
    })
});

export const JoinInviteRequestSchema = z.object({
    body: z.object({
        inviteCode: z.string().trim().min(1),
        serverId: objectId
    })
});

import type { Request, Response } from "express";
import { createServer, getServerMembers, getServerList } from "../services/server.service.js";
import logger from "../config/logger.js";

// 1. Controller function for New Server
export const newServer = async (req: Request, res: Response) => {
    try {
        // Get user id
        const userId = (req as any)?.user.id;

        // 1. Destructure the req body
        const { serverName } = req.body

        // 2. Crate data object for these values
        const data = {
            userId,
            serverName
        }

        // 3. Create server by using function
        const result = await createServer(data);

        logger.info(`New Server Created : ${data.serverName}`);

        // 4. Return result
        return res.status(201).json({
            success: true,
            message: "NewServer Created Successfully",
            data: result
        })

    }
    // Handle error appropriately
    catch (error: any) {
        logger.error(`Error creating New Server : ${error}`);
        return res.status(500).json({
            success: false,
            message: "Error creating New Server"
        })
    }
}

// 2. Controller Function For Getting Server Members
export const serverMember = async (req: Request, res: Response) => {
    try {
        // 1. Get userId 
        const userId = (req as any)?.user.id;

        // 2. Validate userId 
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized : Token not Found"
            });
        }

        // 3. Get serverId
        const { serverId } = req.params;

        // 4. Validate serverId
        if (!serverId) {
            return res.status(400).json({
                success: false,
                message: "serverId is required in URL Path"
            });
        }

        // 5. Create data object to store Variable
        const data = {
            userId,
            serverId
        }

        // 6. Get Result from Service Function
        const result = await getServerMembers(data);

        logger.info("Server Membrs Fetched Succssfully");

        // 7. Send the Result to User
        return res.status(200).json({
            success: true,
            message: "Members Fetched Successfully",
            data: result
        })
    }
    // Handle Error appropriately
    catch (error: any) {
        logger.error(`Error Fetching the Members for Server : ${error}`);
        return res.status(500).json({
            success: false,
            message: error.message || "Error Fetching Members For These Server!!"
        })
    }
}

// 3. Controller Function For Getting All Server Name
export const serverName = async (req: Request, res: Response) => {
    try {
        // 1. Get userId 
        const userId = (req as any)?.user.id

        // 2. Validate userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required as query parameter"
            });
        }

        // 3. Create data object to store these variable
        const data = { userId };

        // 4. Get All Server names using correct service function
        const result = await getServerList(data);

        logger.info("Server Names Fetched Successfully");

        // 5. Return the Response
        return res.status(200).json({
            success: true,
            message: "All Servers Fetched Successfully",
            data: result
        })
    }
    // Handle the Error appropriately
    catch (error: any) {
        logger.error(`Error fetching Server list : ${error}`);
        return res.status(500).json({
            success: false,
            message: error.message || "Error Getting Server list"
        });
    }
}


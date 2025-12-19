import type { Request, Response } from "express";
import { createServer, getServerMembers } from "../services/server.service.js";
import logger from "../config/logger.js";

// 1. Controller function for New Server
export const newServer = async (req : Request, res : Response) => {
    try {
        // 1. Destructure the req body
        const {userId, serverName} = req.body

        // 2. Crate data object for these values
        const data = {
            userId,
            serverName
        }

        // 3. Create server by using function
        const result = await createServer( data );

        // 4. Return result
        return res.status(201).json({
            success : true,
            message : "NewServer Created Successfully",
            data : result
        }) 

    }
    // Handle error appropriately
    catch(error : any){
        logger.error(`Error creating New Server : ${error}`);
        return res.status(500).json({
            success : false,
            message : "Error creating New Server"
        })
    }
}

// 2. Controller Function For Getting Server Members
export const serverMember = async (req : Request, res : Response) => {
    try {
        // 1. Destructure Req Body
        const {userId, serverId} = req.body;

        // 2. Create data object to store Variable
        const data = {
            userId,
            serverId
        }

        // 3. Get Result from Service Function
        const result = await getServerMembers( data );

        // 4. Send the Result to User
        return res.status(200).json({
            success : true,
            message : "Members Fetched Successfully",
            data : result
        })
    }
    // Handle Error appropriately
    catch(error : any){
        logger.error(`Error Fetching the Members for Server : ${error}`);
        return res.status(500).json({
            success : false,
            message : "Error Fetching Members For These Server!!"
        })
    }
}

// 3. Controller Function For Getting All Server Name
export const serverName = async (req : Request, res : Response) => {
    try {
        // 1. Destructure the req body
        const {userId} = req.body;

        // 2. Create data object to store these variable
        const data = {
            userId
        }

        // 3. Get All Server names 
        const result = await getServerMembers( data );

        // Return the Response
        return res.status(200).json({
            success : true,
            message : "All Servers Fetched Successfully",
            data : result
        })
    }
    // Handle the Error appropriately
    catch(error : any){
        logger.error(`Error fetching Server list : ${error}`);
        return res.status(500).json({
            success : false,
            message : "Error Getting Server list"
        });
    }
}


import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ACCESS_SECRET, REFRESH_SECRET } from '../config/env.js';
import type { Types } from 'mongoose';
import logger from '../config/logger.js';
import { createRoom } from '../services/room.service.js';
import type { NewRoomRequest } from '../types/types.js';
import { createServer } from '../services/server.service.js';


type TokenPair = {
    accessToken: string,
    refreshToken: string
}

type PersonalServer = {
    serverId : string,
    roomId : string,
    serverName: string,
    roomName: string

}

export const hashPassword = async (password: string): Promise<string> => {
    // Generate hash password for user password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
}

export const generateToken = (userId: Types.ObjectId): TokenPair => {
    // Generate AccessToken and Refrshtoken for user
    const accessToken = jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
    return {
        accessToken,
        refreshToken
    }

}

export const newPersonalServer = async (userId: string): Promise<PersonalServer> => {
    try {
        // Check if user if user id is not empty
        if (!userId) {
            throw new Error("user id Not provided!");
        }

        logger.debug("Userid provided");

        // Create a default Personal Welcome Server with Welcome room in it
        const serverData = {
            userId : userId,
            serverName : "Welcome"
        }

        const personalServer = await createServer(serverData);

        logger.debug(`Personal Server has been created for user : ${userId}`);

        // Create a New Room as general name
        const newRoom : NewRoomRequest = {
            userId : userId,
            roomName : "general",
            serverId : personalServer.serverId,
        }

        const firstRoom = await createRoom(newRoom);
        logger.debug("New room Created");

        if(!firstRoom){
            logger.info("Error creatig New Room for Server")
            throw new Error("Error in creating new room for server");
        }

        // return Created Server's Name only
        return {
            serverId : personalServer.serverId,
            roomId : firstRoom.roomId,
            serverName: personalServer.serverName,
            roomName: (firstRoom).roomName

        };

    }
    catch (err: any) {
        logger.error("Error creating new Server while sign up!!", err);
        throw new Error("Personal server could not be created!");
    }
}
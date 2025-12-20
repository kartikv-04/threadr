import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ACCESS_SECRET, REFRESH_SECRET } from '../config/env.js';
import type { Types } from 'mongoose';
import { serverModel } from '../models/server.model.js';
import logger from '../config/logger.js';
import { roomModel } from '../models/room.model.js';

type TokenPair = {
    accessToken: string,
    refreshToken: string
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

export const newPersonalServer = async (userId: string): Promise<{ serverName: string, roomName: string }> => {
    try {
        // 1. Check if user if user id is not empty
        if (!userId) {
            throw new Error("user id Not provided!");
        }

        // 2. Create a default Personal Welcome Server with Welcome room in it
        const personalNewServer = await serverModel.create({
            name: "Welcome",
            createdBy: userId,
            members: userId,
            isPersonal: true,
        })

        // 3. Create a NEw Room as Welcome OR Notes name
        const personalServerRoom = await roomModel.create({
            roomName: "notes",
            server: personalNewServer._id
        })

        // return Created Server's Name only
        return {
            serverName: personalNewServer.name,
            roomName: personalServerRoom.roomName
        };

    }
    catch (err: any) {
        logger.error("Error creating new Server while sign up!!");
        throw new Error("Personal server could not be created!");
    }
}
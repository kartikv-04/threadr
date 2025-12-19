import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ACCESS_SECRET, REFRESH_SECRET } from '../config/env.js';
import type { Types } from 'mongoose';
import { serverModel } from '../models/server.model.js';
import logger from '../config/logger.js';

type TokenPair = {
    accessToken : string,
    refreshToken : string
}

export const hashPassword = async (password : string) : Promise<string> => {
    // Generate hash password for user password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
}

export const generateToken = (userId : Types.ObjectId) : TokenPair => {
    // Generate AccessToken and Refrshtoken for user
    const accessToken =  jwt.sign({userId}, ACCESS_SECRET, {expiresIn : '30m'} );
    const refreshToken = jwt.sign({userId}, REFRESH_SECRET, {expiresIn : '7d'});
    return {
         accessToken,
         refreshToken   
    }

}

export const newPersonalServer = async ( userId : string) : Promise<{name : string}> => {
    try {
        // Check if user if user id is not empty
        if (!userId){
            throw new Error("user id Not provided!");
        }

        // Create a default PErsonal Welcome Server with Welcome room in it
        const personalNewServer = await serverModel.create({
            name : "Welcome",
            createdBy : userId,
            members : userId,
            isPersonal : true,
        })

        // return Created Server's Name only
        return {name : personalNewServer.name};
    
    }
    catch(err : any){
        logger.error("Error creating new Server while sign up!!");
        throw new Error("Personal server could not be created!");
    }
}
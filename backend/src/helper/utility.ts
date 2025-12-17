import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ACCESS_SECRET, REFRESH_SECRET } from '../config/env.js';
import type { Types } from 'mongoose';

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
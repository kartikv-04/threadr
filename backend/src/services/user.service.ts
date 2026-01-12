import { userModel } from '../models/user.model.js';
import { generateToken, hashPassword, newPersonalServer } from '../helper/utility.js';
import logger from '../config/logger.js';
import type { SignupArg, UserResponse, SigninArg, } from '../types/types.js';
import bcrypt from 'bcryptjs';
import { ConflictError, UnauthorizedError } from '../helper/errorClass.js';


// Signup Service function
export const signup = async (user: SignupArg): Promise<UserResponse> => {
    // Check if user already exist
    const userExist = await userModel.findOne({ email: user.email });
    if (userExist) {
        logger.warn("User Already exist");
        throw new ConflictError("User Already exist");
    }

    // Create hash password
    const hashedPassword = await hashPassword(user.password);

    // Save new User;
    const newUser = await userModel.create({
        username: user.username,
        name: user.name,
        email: user.email,
        password: hashedPassword
    })

    // Generate refresh and acess tokens for user
    const token = generateToken(newUser._id);

    // Save refreshtoken to database
    await userModel.findByIdAndUpdate(newUser._id, {
        refreshToken: token.refreshToken
    })

    const id = newUser._id.toString();

    // Get Personal server created for user
    const userServer = newPersonalServer(id);

    // Log successful
    logger.info("User Registeered Succssfully");

    return {
        data: {
            id: newUser._id,
            username: newUser.username,
            name: newUser.name,
            email: newUser.email,
            accessToken: token.accessToken,
            server: {
                serverName: (await userServer).serverName,
                roomName: (await userServer).roomName
            }
        },
        refreshToken: token.refreshToken
    }

}

// Signin Service Function
export const signin = async (data: SigninArg): Promise<UserResponse> => {
    // Check user exist or not
    const userExist = await userModel.findOne({ email: data.email }).select('+password');
    if (!userExist) {
        logger.error("Invalid Credentials!");
        throw new UnauthorizedError("Invalid Credentials!");
    }

    // Check user password 
    const checkPassword = await bcrypt.compare(data.password, userExist.password);
    if (!checkPassword) {
        logger.error("Invalid Credentials!");
        throw new UnauthorizedError("Invalid Credentials!");
    }

    // Generate new Set of tokens
    const token = generateToken(userExist._id);

    // Overwrite existing refreshtoken and update with new one
    await userModel.findByIdAndUpdate(userExist._id,
        {
            refreshToken: token.refreshToken
        }
    )

    // Log successful Signin Before Sending Data
    logger.info("User Signed In Successfully");

    // Return the essential data 
    return {
        data: {
            id: userExist._id,
            username: userExist.username,
            name: userExist.name,
            email: userExist.email,
            accessToken: token.accessToken,
        },
        refreshToken: token.refreshToken
    };
}

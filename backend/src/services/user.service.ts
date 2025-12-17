import { userModel } from '../models/user.model.js';
import { generateToken, hashPassword } from '../helper/utility.js';
import logger from '../config/logger.js';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';

// Type for Function arguments in Signup
type SignupArg = {
    username : string,
    name : string,
    email : string,
    password : string
}

// Return signup function type
type UserResponse = {
        id : Types.ObjectId,
        username : string,
        name : string,
        email : string,
        token : string
}

// Signin function type
type SigninArg = {
    email : string,
    password : string,
    token : string
}

// Signup Service function
export const signup = async ( user : SignupArg ) : Promise<UserResponse> => {

    try {
            // Validate and check
            if (!user.username || !user.email || !user.name || !user.password){
                logger.warn("All Fields are required !");
                throw new Error("All Fields are required")
            }

            // Check if user already exist
            const userExist = await userModel.findOne({email : user.email});
            if(userExist) {
                logger.warn("User Already exist");
                throw new Error("User Already exist");
            }

            // Create hash password
            const hashedPassword = await hashPassword(user.password);

            // Save new User;
            const newUser = await userModel.create({
                username : user.username,
                name : user.name,
                email : user.email,
                password : hashedPassword
            })

            // Generate refresh and acess tokens for user
            const token = generateToken(newUser._id);

            // Save refreshtoken to database
            await userModel.findByIdAndUpdate(newUser._id, {
                refreshToken : token.refreshToken
            })

            return {
                user : {
                    id : newUser._id,
                    username : newUser.username,
                    name : newUser.name,
                    email : newUser.email
                },
                token : token.accessToken
            }
    }
    catch(err : any){
        logger.error({err}, `Error signing up New user!!`);
        throw new Error("Error singning up new user!!");
    }
    
}

export const signin = async ( data : SigninArg) : Promise<UserResponse> => {
    try {
        // validate all incoming details
        if(!data.email || !data.password){
            logger.warn("All Fields are required!!");
            throw new Error("All Fields are required!!");
        }

        // Check user exist or not
        const userExist = await userModel.findOne({email : data.email});
        if(!userExist){
            logger.error("Invalid Credentials!");
            throw new Error("Invalid Credentials!");
        }

        // Check user password 
        const checkPassword = await bcrypt.compare(data.password, userExist.password);
        if(!checkPassword){
            logger.error("Invalid Credentials!");
            throw new Error("Invalid Credentials!");
        }

        // Generate new Set of tokens
        const token = generateToken(userExist._id);

        // Overwrite existing refreshtoken and update with new one
        await userModel.findByIdAndUpdate(userExist._id,
            {
                refreshToken : token.refreshToken
            }
        )

        // Return the essential data 
        const userData = {
            "id" : userExist._id,
            "username" : userExist.username,
            "name" : userExist.name,
            "email" : userExist.email,
            "token" : token.accessToken
        }

        return userData;
    }
    catch (err : any) {
        logger.error({err}, "Error in Signing in user!!");
        throw new Error("Error in Signing in user!!");
    }
}

import type { Request, Response } from "express";
import { signin, signup } from "../services/user.service.js";
import logger from "../config/logger.js";

// Signup Controller
export const signUp = async (req : Request, res : Response) => {

    try {
        // 1. destructure the req body 
        const {name , username, email, password} = req.body;

        // 2. Create data object that stores these variables
        const data = {
            name,
            username,
            email,
            password 
        }

        // 3. use signup controleer and get Response
        const result = await signup( data );

        //4. Send Success Response
        return res.status(201).json({
            success : true,
            message : "User Registered Succesfully",
            data : result
        });
    }
    // Handle Error appropriately
    catch (error : any){
        logger.error("Signup Error : ", error);

        // return message to user
        return res.status(500).json({
            success : false,
            message : error.message || "Internal Server Error"
        })

    }

}

// Signin Controller
export const signIn = async (req : Request, res : Response) => {
    try {
        // 1. Destructure req Body
        const {email, password} = req.body;

        // 2. Create data object
        const data = {
            email,
            password
        }

        // 3. get results from signin service function
        const result = await signin( data );

        // 4. Send Response
        return res.status(200).json({
            success : true,
            message : "User Login Successfull",
            data : result
        })
    }
    // Catch error appropriately
    catch(error : any){
        logger.error(`There was an error while signin process : ${error}`);
        return res.status(500).json({
            success : false,
            message : error.message || "Error while signing in user"
        })
    }
}
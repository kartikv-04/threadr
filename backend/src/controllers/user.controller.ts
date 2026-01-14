import type { Request, Response } from "express";
import { signin, signup } from "../services/user.service.js";
import { NODE_ENV } from "../config/env.js";
import { asyncHandler } from "../helper/asyncHandler.js";
import { Signin, Signup } from "../validator/zod.js";
import { ValidationError } from "../helper/errorClass.js";


// Signup Controller
export const signUp = asyncHandler(async (req: Request, res: Response) => {

    //  Zod Validation
    const validatedData = Signup.safeParse(req.body);

    if(!validatedData.success){
        throw new ValidationError("Validation Failed!")
    }

    //  Destructure validated data
    const { name, username, email, password } = validatedData.data;

    //  Create data object that stores these variables
    const data = {
        name,
        username,
        email,
        password
    }

    //  use signup controleer and get Response
    const result = await signup(data);

    //  Send Refreshtoken as in cookie
    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production', //true in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // valid till 7days
    })

    //  Send Response to User
    return res.status(201).json({
        success: true,
        message: "User Registered Succesfully",
        data: result
    });

});

// Signin Controller
export const signIn = asyncHandler(async (req: Request, res: Response) => {
    //  Zod Validation
    const validatedData = Signin.safeParse(req.body);

    // Handle error 
    if(!validatedData.success){
        throw new ValidationError("Validatoin Failed")
    }

    //  Destructure req Body
    const { email, password } = validatedData.data;

    //  Create data object
    const data = {
        email,
        password
    }

    //  get results from signin service function
    const result = await signin(data);

    //  Send Refreshtoken as in cookie
    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production', //true in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // valid till 7days
    })

    //  Send Response
    return res.status(200).json({
        success: true,
        message: "User Login Successfull",
        data: result
    })
});
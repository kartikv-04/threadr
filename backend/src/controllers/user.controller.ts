import type { Request, Response } from "express";
import { signin, signup } from "../services/user.service.js";
import { NODE_ENV } from "../config/env.js";
import { asyncHandler } from "../helper/asyncHandler.js";
import { Signin, Signup } from "../validator/zod.js";

// Signup Controller
export const signUp = asyncHandler(async (req: Request, res: Response) => {

    // 1. Zod Validation
    const validatedData = Signup.parse(req.body);

    // 2. Destructure validated data
    const { name, username, email, password } = validatedData;

    // 3. Create data object that stores these variables
    const data = {
        name,
        username,
        email,
        password
    }

    // 4. use signup controleer and get Response
    const result = await signup(data);

    // 5. Send Refreshtoken as in cookie
    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production', //true in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // valid till 7days
    })

    // 6. Send Response to User
    return res.status(201).json({
        success: true,
        message: "User Registered Succesfully",
        data: result.data
    });

});

// Signin Controller
export const signIn = asyncHandler(async (req: Request, res: Response) => {
    // 1. Zod Validation
    const validatedData = Signin.parse(req.body);

    // 2. Destructure req Body
    const { email, password } = validatedData;

    // 3. Create data object
    const data = {
        email,
        password
    }

    // 4. get results from signin service function
    const result = await signin(data);

    // 5. Send Refreshtoken as in cookie
    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production', //true in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // valid till 7days
    })

    // 6. Send Response
    return res.status(200).json({
        success: true,
        message: "User Login Successfull",
        data: result.data
    })
});
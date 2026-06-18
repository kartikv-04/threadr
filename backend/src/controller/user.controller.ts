import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { signin, signup, getUserById } from '../service/user.service.js';
import { NODE_ENV, ACCESS_SECRET, REFRESH_SECRET } from '../config/env.js';
import { asyncHandler } from '../helper/asyncHandler.js';
import { UnauthorizedError } from '../helper/errorClass.js';
import { userModel } from '../models/user.model.js';
import logger from '../config/logger.js';

// Signup Controller
export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const data = {
    name,
    email,
    password
  };

  //  use signup controleer and get Response
  const result = await signup(data);

  //  Send Refreshtoken as in cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production', //true in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // valid till 7days
  });

  //  Send Response to User
  return res.status(201).json({
    success: true,
    message: 'User Registered Succesfully',
    data: result
  });
});

// Signin Controller
export const signIn = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const data = {
    email,
    password
  };

  //  get results from signin service function
  const result = await signin(data);

  //  Send Refreshtoken as in cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production', //true in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // valid till 7days
  });

  //  Send Response
  return res.status(200).json({
    success: true,
    message: 'User Login Successfull',
    data: result
  });
});

// Refresh Token Controller - Exchange refresh token for new access token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  // Get refresh token from cookie
  const token = req.cookies?.refreshToken;

  if (!token) {
    logger.warn('Refresh token missing from cookies');
    throw new UnauthorizedError('No refresh token provided');
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(token, REFRESH_SECRET) as { id: string };

    // Check if user exists and token matches database
    const user = await userModel.findById(decoded.id).select('+refreshToken');

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (user.refreshToken !== token) {
      logger.warn('Refresh token mismatch - possible token reuse attack');
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Generate new access token
    const newAccessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: '15m' });

    logger.info(`Access token refreshed for user: ${user._id}`);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken: newAccessToken
    });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Refresh token expired');
      throw new UnauthorizedError('Refresh token expired, please login again');
    }
    throw error;
  }
});

// Logout Controller - Clear refresh token
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    try {
      // Verify and decode the token to get user id
      const decoded = jwt.verify(token, REFRESH_SECRET) as { id: string };

      // Clear refresh token from database
      await userModel.findByIdAndUpdate(decoded.id, { refreshToken: null });

      logger.info(`User ${decoded.id} logged out`);
    } catch (error) {
      // Token invalid/expired - just clear cookie anyway
      logger.warn('Logout with invalid token, clearing cookie anyway');
    }
  }

  // Clear the cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict'
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get User by ID Controller
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const user = await getUserById(userId);
  return res.status(200).json({
    success: true,
    message: 'User found',
    data: user
  });
});

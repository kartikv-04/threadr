import type { Request, Response, NextFunction } from "express";
import { AppError } from "../helper/errorClass.js";
import { ZodError } from "zod";
import logger from "../config/logger.js";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
        logger.warn({
            errors: err.issues
        }, `Validation Failed: ${req.method} ${req.path}`);

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.issues.map((e: any) => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }

    // Handle custom AppError
    if (err instanceof AppError) {
        // Log based on severity
        if (err.statusCode >= 500) {
            logger.error({
                statusCode: err.statusCode,
                path: req.path,
                method: req.method,
                stack: err.stack
            }, `${err.message}`);
        } else {
            logger.warn({
                statusCode: err.statusCode,
                path: req.path,
                method: req.method
            },`${err.message}`);
        }

        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        logger.warn(`Mongoose Validation Failed: ${req.method} ${req.path}`);
        
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: Object.values(err.errors || {}).map((e: any) => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    // Handle Mongoose duplicate key errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0];
        logger.warn(`Duplicate key error: ${field} already exists`);
        
        return res.status(409).json({
            success: false,
            message: `${field} already exists`
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        logger.warn(`Invalid JWT token: ${req.method} ${req.path}`);
        
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        logger.warn(`Expired JWT token: ${req.method} ${req.path}`);
        
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }

    // Handle unexpected errors (always log these!)
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body
    },'Unexpected Error');

    // Default error response
    return res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
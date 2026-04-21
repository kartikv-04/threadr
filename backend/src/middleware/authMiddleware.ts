import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { ACCESS_SECRET } from "../config/env.js";
import { userModel } from "../models/user.model.js";
import logger from "../config/logger.js";


export const authenticate = async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        // 1️. Get Authorization header
        const authHeader = _req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized: token missing",
            });
        }

        // 2️.  Extract token
        const token: any = authHeader.split(" ")[1];

        // 3️.  Verify token
        const decoded = jwt.verify(token, ACCESS_SECRET) as any;

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized: invalid token",
            });
        }

        // 4️.  Fetch user
        const user = await userModel.findById(decoded.id).lean();

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized: user not found",
            });
        }

        // 5️.  Attach user to request (no password)
        (_req as any).user = { id: user._id };

        // 6️.  Continue
        return _next();
    } catch (error: any) {
        logger.error("Auth middleware error", error);

        return res.status(401).json({
            message: "Unauthorized: token verification failed",
        });
    }
};



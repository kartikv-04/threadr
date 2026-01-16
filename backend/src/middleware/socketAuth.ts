import jwt from "jsonwebtoken";
import { ACCESS_SECRET } from "../config/env.js";
import { userModel } from "../models/user.model.js";
import logger from "../config/logger.js";

export const socketAuth = async (socket: any, next: any) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized: token missing"));
    }

    const decoded = jwt.verify(token, ACCESS_SECRET) as any ;

    if (!decoded?.id) {
      return next(new Error("Unauthorized: invalid token"));
    }

    const user = await userModel.findById(decoded.id).lean();

    if (!user) {
      return next(new Error("Unauthorized: user not found"));
    }

    // Attach user to socket
    socket.user = user;

    next();
  } catch (error : any) {
    logger.error("Socket auth error", error);
    next(new Error("Unauthorized"));
  }
};

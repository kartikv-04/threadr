
import type { Request, Response, NextFunction } from "express";
import { generateInvite, validateInvite, joinInvite } from "../services/invite.service.js";
import type { GenerateInviteRequest, JoinInviteReqest } from "../types/types.js";

// Generate Invite Link
// Route: POST /api/servers/:serverId/invite
export const createInviteController = async ( req: Request, res: Response, next: NextFunction ) => {

        // Extract Data
        const { serverId } = req.params as any;
        const userId = (req as any).user?.id; 

        // Prepare the Data Object for Service
        const serviceData: GenerateInviteRequest = {
            serverId: serverId,
            userId: userId
        };

        // Call Service
        const result = await generateInvite(serviceData);

        // Send Response
        res.status(201).json({
            success: true,
            message: "Invite generated successfully",
            data: result
        });
};

// Validate/Get Invite Info
// Route: GET /api/invite/:code
export const getInviteInfoController = async ( req: Request, res: Response, next: NextFunction ) => {

        const { code } = req.params as any;

        // Call Service
        const result = await validateInvite(code);

        // Send Response
        res.status(200).json({
            success: true,
            data: result
        });
};

// 3. Join Server via Invite
// Route: POST /api/invite/join
export const joinInviteController = async ( req: Request, res: Response, next: NextFunction ) => {

        const userId = (req as any).user?.id;
        const { inviteCode, serverId } = req.body as any;

        const serviceData: JoinInviteReqest = {
            inviteCode: inviteCode,
            serverId: serverId,
            userId: userId
        };

        // Call Service
        const result = await joinInvite(serviceData);

        res.status(200).json({
            success: true,
            message: "Joined server successfully",
            data: result
        });
};
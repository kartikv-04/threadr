import type { Request, Response } from 'express';
import { generateInvite, validateInvite, joinInvite } from '../service/invite.service.js';
import type { GenerateInviteRequest, JoinInviteReqest } from '../types/invite.js';
import { asyncHandler } from '../helper/asyncHandler.js';

// Generate Invite Link
// Route: POST /api/v1/s/:serverId/invite
export const createInviteController = asyncHandler(async (req: Request, res: Response) => {
  const { serverId } = req.params as { serverId: string };
  const userId = (req as any).user.id.toString() as string;

  // Prepare the Data Object for Service
  const serviceData: GenerateInviteRequest = {
    serverId,
    userId
  };

  // Call Service
  const result = await generateInvite(serviceData);

  // Send Response
  res.status(201).json({
    success: true,
    message: 'Invite generated successfully',
    data: result
  });
});

// Validate/Get Invite Info
// Route: GET /api/v1/invite/:code
export const getInviteInfoController = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params as { code: string };

  // Call Service
  const result = await validateInvite(code);

  // Send Response
  res.status(200).json({
    success: true,
    data: result
  });
});

// Join Server via Invite
// Route: POST /api/v1/invite/join
export const joinInviteController = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id.toString() as string;
  const { inviteCode, serverId } = req.body as {
    inviteCode: string;
    serverId: string;
  };

  const serviceData: JoinInviteReqest = {
    inviteCode,
    serverId,
    userId
  };

  // Call Service
  const result = await joinInvite(serviceData);

  res.status(200).json({
    success: true,
    message: 'Joined server successfully',
    data: result
  });
});

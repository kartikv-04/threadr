import { nanoid } from "nanoid";
import type {
    GenerateInviteRequest,
    GenerateInviteResponse,
    InviteValidResponse,
    JoinInviteReqest
} from "../types/types.js";
import logger from "../config/logger.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "../helper/errorClass.js";
import { memberModel } from "../models/member.model.js";
import { inviteModel } from "../models/invite.model.js";
import { CLIENT_URL } from "../config/env.js";
import { calculateExpiryDate } from "../helper/utility.js";
import { serverModel } from "../models/server.model.js";


export const generateInvite = async (data: GenerateInviteRequest): Promise<GenerateInviteResponse> => {

    // Validate incoming details
    if (!data.userId || !data.serverId) {
        logger.warn("Server id and userid are required!!");
        throw new ValidationError("Server and userid are required!");
    }

    // Check user is existing member and server exist
    const isMember = await memberModel.findOne({ user: data.userId, server: data.serverId });
    if (!isMember) {
        logger.warn("Unauthorized to access resource");
        throw new UnauthorizedError("Unauthorized to access resource");
    }

    // allow existing member even if its not admin to generate link
    const inviteLink: string = nanoid(8);

    // Create ExpiryDate
    const expiryDate = calculateExpiryDate("6h")

    // Update invite link into invite model
    const newInvite = await inviteModel.create({
        code: inviteLink,
        serverId: data.serverId,
        creatorId: data.userId,
        expiresAt: expiryDate
    })

    if (!newInvite) {
        logger.error("Error in generataing newInvite link");
        throw new Error("Error in generating invite link")
    }

    logger.debug("New Invite link generated");

    const res = {
        url: `${CLIENT_URL}/invite/${inviteLink}`,
        code: inviteLink,
        expiresAt: newInvite.expiresAt as any,
        isPermanent: newInvite.expiresAt === null
    }

    // Create clean Response JSON
    return res;

}

export const validateInvite = async (code: string): Promise<InviteValidResponse> => {

    // Validate incoming details
    if (!code) {
        logger.warn("Code needed");
        throw new ValidationError("Code needed");
    }

    // Check if code exist in database
    const invite = await inviteModel.findOne({ code: code });

    // If code not found return with proper error
    if (!invite) {
        logger.debug("Invalid Invite Code");
        throw new NotFoundError("Invalid Invite Code")
    }

    // 1. ADD: Expiry Check
    if (invite.expiresAt && new Date() > invite.expiresAt) {
        throw new ValidationError("This invite has expired");
    }

    // 2. ADD: Max Uses Check (Optional but recommended)
    if (invite.maxUses && invite.uses >= invite.maxUses) {
        throw new ValidationError("This invite has reached its limit");
    }

    // Extract ServerId and find out Server Details
    let serverId = invite.serverId;
    const findServer = await serverModel.findOne({ _id: serverId });
    if (!findServer) {
        logger.warn("Server no longer exists");
        throw new NotFoundError("Server no longer exists");
    }

    logger.debug("Ivite tried to join");


    // Create proper response object
    const inviteRes = {
        serverId: findServer._id.toString(),
        serverName: findServer?.name,
        serverIcon: findServer?.icon,
    }
    return inviteRes;

}

export const joinInvite = async (data: JoinInviteReqest): Promise<{ serverId: string }> => {

    // Validate incoming details
    if (!data.inviteCode || !data.userId || !data.serverId) {
        logger.warn("Empty Fields");
        throw new ValidationError("Empty Fields");
    }

    // Validate the invite code is actually real and valid
    const validInvite = await inviteModel.findOne({ code: data.inviteCode });

    if (!validInvite) {
        throw new NotFoundError("Invalid Invite Code");
    }

    // Check Expiry (Crucial for security)
    if (validInvite.expiresAt && new Date() > validInvite.expiresAt) {
        throw new ValidationError("Invite expired");
    }

    // Validate correct server (Prevent Cross-Server spoofing)
    // Ensure the invite code actually belongs to the server user is trying to join
    if (validInvite.serverId.toString() !== data.serverId) {
        throw new ValidationError("Invite code does not match this server");
    }

    // Check if user is ALREADY a member (Prevent Duplicates)
    const existingMember = await memberModel.findOne({
        user: data.userId,
        server: data.serverId
    });

    if (existingMember) {
        // Just return success if user already in
        return { serverId: data.serverId };
    }

    // Create Member
    await memberModel.create({
        server: data.serverId,
        user: data.userId,
        role: "guest", // Default to guest/member
        isBanned: false
    });

    // Update Invite Uses Count
    await inviteModel.updateOne({ code: data.inviteCode }, { $inc: { uses: 1 } });

    return { serverId: data.serverId };
}


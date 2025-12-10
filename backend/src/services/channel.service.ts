// import type { Request, Response } from "express";
import channelModel from "../model/channel.model.js";
import logger from "../config/logger.js";
import mongoose from "mongoose";

export const getAllChannel = async (workspaceId: string) => {
    try {
        // Find all channels where workspace matches these ID
        const channels = await channelModel.find({
            workspace: workspaceId
        })
        return channels;

    }
    catch (error: any) {
        logger.error("Error in fetching channels : " + error.message);
        throw new Error("Error ftching channels");
    }

}

export const createChannelService = async (channelName: string, channelDescription: string, workspaceId: string, userId: string) => {
    try {
        // Create channel with all required details
        const newchannel = new channelModel({
            name: channelName,
            description: channelDescription,
            workspace: new mongoose.Types.ObjectId(workspaceId),
            createdBy: new mongoose.Types.ObjectId(userId),
        })

        // Save new Channel
        await newchannel.save();
        // Return new channel
        return newchannel;
    }
    catch (error: any) {
        logger.error("Error in creating channel : " + error.message);
        throw error;
    }
}

export const getChannelInfoService = async (channelId: string) => {
    try {
        // Find Channel by id
        const channelinfo = await channelModel.findById(channelId)
            .populate("createdBy", "username email")
            .populate("members", "username isOnline lastSeen")
        logger.info("channle info fetched successfully");
        return channelinfo;
    }
    catch (error: any) {
        logger.error("Error getting channel details  : " + error.message);
        throw new Error("Error getting channel details");
    }
}

export const channelUpdateService = async (channelId: string, updateData: { name: string, description: string }) => {

    try {
        // Find channel 
        const updateChannel = await channelModel.findById(channelId);
        if (!updateChannel) {
            logger.error("channel not Found");
            throw new Error("Channel not Found");
        }

        // Update the channel details
        updateChannel.name = updateData.name || updateChannel.name;
        updateChannel.description = updateData.description || updateChannel.description;

        // Save new channel details after updating
        await updateChannel.save();
        logger.info("Channel updated successfully");
        return updateChannel;
    }
    catch (error: any) {
        logger.error("Error updating channel : " + error.message);
        throw new Error("Error updating channel");
    }
}

export const deleteChannelService = async (channelId: string) => {
    try {
        // Delete the channel
        const result = await channelModel.findByIdAndDelete(channelId);
        if (!result) {
            logger.error("Channel not found to delete");
            throw new Error("Channel not found to delete");
        }
        logger.info("Channel deletedd Successfully");
        return { message: "Channel Deleted Successfully" };
    }
    catch (error: any) {
        logger.error("Error deleting channel : " + error.message);
        throw new Error("Error deleting channel");
    }

}

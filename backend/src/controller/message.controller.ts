import type { Request, Response } from 'express';
import {
  editMessageService,
  recieveMessageService,
  sendMessageService,
  deleteMessageService
} from '../service/message.service.js';
import logger from '../config/logger.js';
import { asyncHandler } from '../helper/asyncHandler.js';
import type {
  DeleteMessageRequest,
  EditMessageRequest,
  GetMessagesRequest,
  SendMessageRequest
} from '../types/message.js';

// 1. Send Message Controller
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  // 1 Destructure req body
  const userId = (req as any).user.id.toString() as string;
  const { roomId } = req.params as { roomId: string };
  const { content, serverId } = req.body as { content: string; serverId: string };

  // Structure Data
  const data: SendMessageRequest = {
    userId,
    roomId,
    content,
    serverId
  };

  //  Send Message
  const result = await sendMessageService(data);

  // Emit socket event for real-time update
  const io = req.app.get('io');
  if (io) {
    io.to(roomId).emit('send:message:room', result);
  } else {
    logger.warn('Socket.io instance not found on app, real-time update failed');
  }

  logger.info('Message Sent Successfully');

  //  Send Response
  return res.status(201).json({
    success: true,
    message: 'New message created and sended successfully',
    data: result
  });
});

//  Recieve Message
export const getMessage = asyncHandler(async (req: Request, res: Response) => {
  //  Get parameters from query (RESTful approach for GET requests)
  const userId = (req as any).user.id.toString() as string;
  const { roomId } = req.params as { roomId: string };
  const {
    serverId,
    page = 1,
    limit = 50
  } = req.query as unknown as {
    serverId: string;
    page?: number;
    limit?: number;
  };

  //  Create data object
  const data: GetMessagesRequest = {
    userId,
    serverId,
    roomId,
    page,
    limit
  };

  //  Receive message
  const result = await recieveMessageService(data);

  logger.info('Message Recieved Successfully');

  //  Send Response
  return res.status(200).json({
    success: true,
    message: 'Message Fetched Successfully',
    data: result
  });
});

export const editMessage = asyncHandler(async (req: Request, res: Response) => {
  // Parameters from req
  const userId = (req as any).user.id.toString() as string;
  const { roomId } = req.params as { roomId: string };
  const { messageId, content } = req.body as { messageId: string; content: string };

  const data: EditMessageRequest = {
    userId,
    roomId,
    messageId,
    content
  };

  // Get the result from service function
  const result = await editMessageService(data);

  // return response
  return res.status(200).json({
    success: true,
    message: 'Message Updated Successfully',
    data: result
  });
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  // Parameters from req
  const userId = (req as any).user.id.toString() as string;
  const { roomId } = req.params as { roomId: string };
  const { messageId } = req.body as { messageId: string };

  const data: DeleteMessageRequest = {
    userId,
    roomId,
    messageId
  };

  // Get the result from service function
  const result = await deleteMessageService(data);

  // return response
  return res.status(200).json({
    success: true,
    message: 'Message deleted Successfully',
    data: result
  });
});

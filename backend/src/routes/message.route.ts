import { Router } from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const router = Router();

// POST /api/v1/message - Send a new message
router.post('/', sendMessage);
// GET /api/v1/message?userId=xxx&serverId=xxx&roomId=xxx&page=1&limit=10 - Get messages for a room
router.get('/', getMessage);

export default router;
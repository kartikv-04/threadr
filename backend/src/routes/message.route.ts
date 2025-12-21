import { Router } from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const router = Router();

// POST 
router.post('/:serverId/:roomId', sendMessage);
// GET 
router.get('/:serverId/:roomId', getMessage);

export default router;
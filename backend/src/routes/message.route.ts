import { Router } from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const router = Router({ mergeParams: true });

// Mounted as /rooms/:roomId/messages in index.route.ts
// POST 
router.post('/', sendMessage);
// GET 
router.get('/', getMessage);

export default router;
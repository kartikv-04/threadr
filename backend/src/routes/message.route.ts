import { Router } from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import { validate } from "../middleware/validatemiddleware.js";
import { ReceiveMessageRequestSchema, SendMessageRequestSchema } from "../validator/zod.js";

const router = Router({ mergeParams: true });

// Mounted as /rooms/:roomId/messages in index.route.ts
// POST 
router.post('/', validate(SendMessageRequestSchema), sendMessage);
// GET 
router.get('/', validate(ReceiveMessageRequestSchema), getMessage);

export default router;

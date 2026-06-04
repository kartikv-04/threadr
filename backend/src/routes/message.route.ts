import { Router } from "express";
import { deleteMessage, editMessage, getMessage, sendMessage } from "../controller/message.controller.js";
import { validate } from "../middleware/validatemiddleware.js";
import { DeleteMessageRequestSchema, EditMessageRequestSchema, ReceiveMessageRequestSchema, SendMessageRequestSchema } from "../validator/zod.js";

const router = Router({ mergeParams: true });

// Mounted as /rooms/:roomId/messages in index.route.ts
// POST 
router.post('/', validate(SendMessageRequestSchema), sendMessage);
// GET 
router.get('/', validate(ReceiveMessageRequestSchema), getMessage);
// PUT
router.put('/', validate(EditMessageRequestSchema), editMessage);
// Delete
router.delete('/', validate(DeleteMessageRequestSchema), deleteMessage);

export default router;

import { Router } from "express";
import authRouter from '../routes/user.route.js';
import serverRouter from '../routes/server.route.js';
import roomRouter from '../routes/room.route.js';
import messageRouter from '../routes/message.route.js';
import { authenticate } from "../middleware/authMiddleware.js";
import { getInviteInfoController, joinInviteController } from "../controllers/invite.controller.js";
import { validate } from "../middleware/validatemiddleware.js";
import { GetInviteInfoRequestSchema, JoinInviteRequestSchema } from "../validator/zod.js";

const router = Router();

router.use('/users', authRouter);
router.use('/servers', authenticate, serverRouter);
router.use('/servers/:serverId/rooms', authenticate, roomRouter);
router.use('/rooms/:roomId/messages', authenticate, messageRouter);
router.get('/invite/:code', validate(GetInviteInfoRequestSchema), getInviteInfoController);
router.post('/invite/join', authenticate, validate(JoinInviteRequestSchema), joinInviteController);

export default router;

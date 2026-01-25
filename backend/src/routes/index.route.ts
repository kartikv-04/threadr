import { Router } from "express";
import authRouter from '../routes/user.route.js';
import serverRouter from '../routes/server.route.js';
import roomRouter from '../routes/room.route.js';
import messageRouter from '../routes/message.route.js';
import { authenticate } from "../middleware/authMiddleware.js";
import { getInviteInfoController, joinInviteController } from "../controllers/invite.controller.js";

const router = Router();

router.use('/users', authRouter);
router.use('/servers', authenticate, serverRouter);
router.use('/servers/:serverId/rooms', authenticate, roomRouter);
router.use('/rooms/:roomId/messages', authenticate, messageRouter);
router.get('/invite/:code', getInviteInfoController);
router.post('/invite/join', authenticate, joinInviteController);

export default router;
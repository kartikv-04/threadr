import { Router } from "express";
import authRouter from '../routes/user.route.js';
import serverRouter from '../routes/server.route.js';
import roomRouter from '../routes/room.route.js';
import messageRouter from '../routes/message.route.js';
import { authenticate } from "../middleware/authMiddleware.js";
import { generateInvite } from "../services/invite.service.js";

const router = Router();

router.use('/auth', authRouter);
router.use('/s', authenticate, serverRouter);
router.use('/r', authenticate, roomRouter);
router.use('/m', authenticate, messageRouter);
router.use('/invite/:code', authenticate, );
router.use('/invite/:code/join', authenticate, messageRouter);

export default router;
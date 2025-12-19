import { Router } from "express";
import authRouter from '../routes/user.route.js';
import serverRouter from '../routes/server.route.js';
import roomRouter from '../routes/room.route.js';
import messageRouter from '../routes/message.route.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/server', serverRouter);
router.use('/room', roomRouter);
router.use('/message', messageRouter);

export default router;
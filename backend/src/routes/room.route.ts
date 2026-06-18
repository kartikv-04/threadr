import { Router } from 'express';
import { deleteRoomController, getRoom, newRoom } from '../controller/room.controller.js';
import { validate } from '../middleware/validatemiddleware.js';
import {
  CreateRoomRequestSchema,
  DeleteRoomRequestSchema,
  GetRoomListRequestSchema
} from '../validator/zod.js';

const router = Router({ mergeParams: true });

// GET  - Get all rooms for a server
router.get('/', validate(GetRoomListRequestSchema), getRoom);
// POST  Create a new room
router.post('/', validate(CreateRoomRequestSchema), newRoom);
router.delete('/:roomId', validate(DeleteRoomRequestSchema), deleteRoomController);

export default router;

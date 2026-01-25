import { Router } from "express";
import { deleteRoomController, getRoom, newRoom } from "../controllers/room.controller.js";

const router = Router({ mergeParams: true });

// GET  - Get all rooms for a server
router.get('/', getRoom);
// POST  Create a new room
router.post('/', newRoom);
router.delete('/:roomId', deleteRoomController);

export default router;
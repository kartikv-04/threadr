import { Router } from "express";
import { deleteRoomController, getRoom, newRoom } from "../controllers/room.controller.js";

const router = Router();

// GET  - Get all rooms for a server
router.get('/:serverId/', getRoom);
// POST  Create a new room
router.post('/:serverId/', newRoom);
router.delete('/', deleteRoomController);

export default router;
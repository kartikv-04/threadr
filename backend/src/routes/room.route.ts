import { Router } from "express";
import { getRoom, newRoom } from "../controllers/room.controller.js";

const router = Router();

// GET  - Get all rooms for a server
router.get('/:serverId/', getRoom);
// POST  Create a new room
router.post('/:serverId/', newRoom);

export default router;
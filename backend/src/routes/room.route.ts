import { Router } from "express";
import  { getRoom, newRoom } from "../controllers/room.controller.js";

const router = Router();

// GET /api/v1/room?userId=xxx&serverId=xxx - Get all rooms for a server
router.get('/', getRoom);
// POST /api/v1/room - Create a new room
router.post('/', newRoom);

export default router;
import { Router } from "express";
import  { newServer, serverName, serverMember } from "../controllers/server.controller.js";

const router = Router();

router.get('/', serverName); // GET /api/v1/server?userId=xxx - Get all servers for a user
router.get('/members', serverMember); // GET /api/v1/server/members?userId=xxx&serverId=xxx - Get server members
router.post('/', newServer); // POST /api/v1/server - Create a new server

export default router;
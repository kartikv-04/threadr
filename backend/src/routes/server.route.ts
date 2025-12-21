import { Router } from "express";
import { newServer, serverName, serverMember } from "../controllers/server.controller.js";

const router = Router();

router.get('/', serverName); // GET 
router.get('/:serverId/members', serverMember); // GET 
router.post('/', newServer); // POST 

export default router;
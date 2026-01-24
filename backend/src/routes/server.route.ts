import { Router } from "express";
import { newServer, serverName, deleteServer } from "../controllers/server.controller.js";
import { generateInvite } from "../services/invite.service.js";


const router = Router();

router.get('/',  serverName); // GET 
router.post('/',  newServer); // POST 
router.delete('/:serverId', deleteServer); // DELETE
router.post('/:serverId/invite', generateInvite); // POST

export default router;
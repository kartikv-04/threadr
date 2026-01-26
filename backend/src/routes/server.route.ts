import { Router } from "express";
import { newServer, serverName, deleteServer, leaveServerController } from "../controllers/server.controller.js";
import { createInviteController } from "../controllers/invite.controller.js";


const router = Router();

router.get('/', serverName); // GET 
router.post('/', newServer); // POST 
router.delete('/:serverId', deleteServer); // DELETE
router.post('/:serverId/invite', createInviteController); // POST
router.post('/:serverId/leave', leaveServerController); // POST

export default router;
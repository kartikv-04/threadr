import { Router } from "express";
import { newServer, serverName, deleteServer, leaveServerController } from "../controllers/server.controller.js";
import { createInviteController } from "../controllers/invite.controller.js";
import { validate } from "../middleware/validatemiddleware.js";
import { CreateInviteRequestSchema, DeleteServerRequestSchema, LeaveServerRequestSchema, NewServerRequestSchema } from "../validator/zod.js";


const router = Router();

router.get('/', serverName); // GET 
router.post('/', validate(NewServerRequestSchema), newServer); // POST 
router.delete('/:serverId', validate(DeleteServerRequestSchema), deleteServer); // DELETE
router.post('/:serverId/invite', validate(CreateInviteRequestSchema), createInviteController); // POST
router.post('/:serverId/leave', validate(LeaveServerRequestSchema), leaveServerController); // POST

export default router;

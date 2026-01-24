import { Router } from "express";
import { newServer, serverName, deleteServer } from "../controllers/server.controller.js";

const router = Router();

router.get('/',  serverName); // GET 
router.post('/',  newServer); // POST 
router.delete('/:serverId', deleteServer); // DELETE
router.delete('/:serverId/invite', deleteServer); // DELETE

export default router;
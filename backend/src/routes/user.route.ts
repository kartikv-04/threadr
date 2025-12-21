import { Router } from "express";
import { signIn, signUp } from "../controllers/user.controller.js";

const router = Router();

// POST  - Register a new user
router.post('/signup', signUp);
// POST  - Login user
router.post('/signin', signIn);

export default router;
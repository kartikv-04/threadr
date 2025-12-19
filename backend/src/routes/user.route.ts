import { Router } from "express";
import { signIn, signUp } from "../controllers/user.controller.js";

const router = Router();

// POST /api/v1/auth/signup - Register a new user
router.post('/signup', signUp);
// POST /api/v1/auth/signin - Login user
router.post('/signin', signIn);

export default router;
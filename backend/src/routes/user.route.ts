import { Router } from "express";
import { signIn, signUp, refreshToken, logout, getUser } from "../controllers/user.controller.js";

const router = Router();

// POST  - Register a new user
router.post('/signup', signUp);
// POST  - Login user
router.post('/signin', signIn);
// POST  - Refresh access token using refresh token from cookie
router.post('/refresh', refreshToken);
// POST  - Logout user and clear refresh token
router.post('/logout', logout);
// GET - Get user by ID
router.get('/:userId', getUser);

export default router;
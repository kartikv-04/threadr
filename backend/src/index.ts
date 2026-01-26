// Import neccessary packages
import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import logger from './config/logger.js';
import { connectDB } from './config/db.js';
import indexRouter from '../src/routes/index.route.js';
import { socketAuth } from './middleware/socketAuth.js';
import { ValidationError } from './helper/errorClass.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { roomHandler } from './socket/roomHandler.js';
import { messageHandler } from './socket/messageHandler.js';
import { CLIENT_URL } from './config/env.js';
import type { Request, Response } from 'express';

const PORT = process.env.PORT || 5001;

// Initializaton and Middleware
const app = express();
app.use(cors({
    origin: CLIENT_URL, // Use env variable
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true // Allow cookies to be sent
}));
app.use(cookieParser()); // Parse cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route - add to see error middleware
app.get('/test-error', (_req : Request, _res : Response, next) => {
    next(new ValidationError("Test error"));
});

app.use('/api/v1', indexRouter);
app.use(errorHandler);

// Create Server and io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
});

// Attach io to app
app.set("io", io);

// Apply socket authentication middleware
io.use(socketAuth);

const onConnection = (socket: Socket) => {
    roomHandler(io, socket);
    messageHandler(io, socket);
}

// Start connection and handle socket events
io.on("connection", onConnection);

// start Server
server.listen(PORT, () => {
    logger.info("Initializing server components...");
    connectDB();
    logger.info(`Server is running on port ${PORT}`);
});





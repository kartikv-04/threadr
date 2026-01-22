// Import neccessary packages
import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import logger from './config/logger.js';
import { connectDB } from './config/db.js';
import indexRouter from '../src/routes/index.route.js';
import { socketAuth } from './middleware/socketAuth.js';
import { socketHandler } from './socket/socket.js';
import { ValidationError } from './helper/errorClass.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const PORT = 5000;

// Initializaton and Middleware
const app = express();
app.use(cors({
    origin: "http://localhost:3000", // Frontend URL - must be specific for credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true // Allow cookies to be sent
}));
app.use(cookieParser()); // Parse cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route - add to see error middleware
app.get('/test-error', (req, res, next) => {
    next(new ValidationError("Test error"));
});

app.use('/api/v1', indexRouter);
app.use(errorHandler);

// Create Server and io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
});

// Apply socket authentication middleware
io.use(socketAuth);

// Start connection and handle socket events
io.on("connection", (socket) => {
    logger.info(`User connected with socketId: ${socket.id}`);
    socketHandler(io, socket);
});

// start Server
server.listen(PORT, () => {
    logger.info("Server Started");
    connectDB();
    logger.info(`Server Running at http://localhost:${PORT}`);
});





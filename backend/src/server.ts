import http from 'http';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io'; // Import Socket type
import app from './app.js';
import { CLIENT_URL } from './config/env.js';

// Add the missing imports
import logger from './config/logger.js';
import { connectDB } from './config/db.js';
import { socketAuth } from './middleware/socketAuth.js';
import { roomHandler } from './socket/roomHandler.js';
import { messageHandler } from './socket/messageHandler.js';

const PORT = process.env.PORT || 5001; // Define PORT

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
});

// Attach io to app before listening
app.set("io", io);

io.use(socketAuth);

const onConnection = (socket: Socket) => {
    roomHandler(io, socket);
    messageHandler(io, socket);
}

io.on("connection", onConnection);

// start Server
server.listen(PORT, async () => {
    logger.info("Initializing server components...");
    await connectDB();
    logger.info(`Server is running on port ${PORT}`);
});
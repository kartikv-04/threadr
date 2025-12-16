// Import neccessary packages
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import logger from './config/logger.js';
import { connectDB } from './config/db.js';

const PORT = 5000;

// Initializaton and Middleware
const app = express();
app.use(cors({
    origin : "*",
    methods : ['GET', 'POST']

}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// Create Server and io
const server = http.createServer(app);
const io = new Server(server, {
    cors : {
        origin : "*",
        methods : ["GET, POST"]
    }
});

// start Server
server.listen(PORT,()=>{
    logger.info("Server Started")
    connectDB();
})

// Start connection
io.on("connection", (socket)=>{
    logger.info(`User connected with socektif : ${socket}`);
})




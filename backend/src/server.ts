import express from "express";
import http from "http";
import cors from "cors";
import { connectDatabase } from "./config/db.js";
import logger from "./config/logger.js";
import { MONGO_URI, PORT } from "./config/env.js";
import type { Request, Response } from "express";
import indexrouter from "./routes/routes.js";
import { Server } from "socket.io";

// socket imports
import { socketAuth } from "./middleware/socketauth.js";
import registerChatSocketHandlers from "./sockets/sockets.chat.js";

// --------------------- EXPRESS ---------------------

const app = express();
const server = http.createServer(app);

// --------------------- MIDDLEWARE ---------------------

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------- ROUTES ---------------------

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/v1", indexrouter);

// --------------------- SERVER BOOT ---------------------

const startServer = async () => {
  if (!MONGO_URI) {
    logger.error("MONGO_URI is not defined");
    process.exit(1);
  }

  try {
    await connectDatabase(MONGO_URI);
    logger.info("Database connected successfully");

    const port = PORT || 5000;

    // --------------------- SOCKET.IO ---------------------

    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
      },
    });

    // Auth middleware for socket
    io.use(socketAuth);

    // Register handlers
    io.on("connection", (socket) => {
      logger.info(`Socket connected: ${socket.id}`);
      registerChatSocketHandlers(io, socket);
    });

    // Expose io to controllers if needed
    app.set("io", io);

    server.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info(`Health check: http://localhost:${port}/health`);
    });
  } catch (err: any) {
    logger.error("Server failed to start");
    logger.error(err.message);
    process.exit(1);
  }
};

startServer();

export default app;
export { server };
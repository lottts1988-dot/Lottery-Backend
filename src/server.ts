// server.ts
import app from "./app";
import "dotenv/config";
import { startTicketCron } from "./utils/cron";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

// ✅ Create HTTP server from Express app
const server = http.createServer(app);

// ✅ Attach Socket.IO to the same HTTP server
export const io = new Server(server, {
  cors: {
    origin: "*", // restrict in production
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ✅ Start the HTTP server (not app.listen)
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startTicketCron();
});

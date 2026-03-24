import app from "./app";
import "dotenv/config";
import { startTicketCron } from "./utils/cron";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

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

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startTicketCron();
});

import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./sockets/socketServer.js";
dotenv.config();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
initSocket(server);
const start = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
const gracefulShutdown = async () => {
  try {
    server.close(() => {});
    await mongoose.connection.close(false);
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
};
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
start();
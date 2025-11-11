import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || "*" }
  });

  io.on("connection", (socket) => {
    socket.on("join", ({ shopId }) => socket.join(String(shopId)));
    socket.on("join-shop", (shopId) => socket.join(String(shopId)));
  });

  return io;
};

export { io };
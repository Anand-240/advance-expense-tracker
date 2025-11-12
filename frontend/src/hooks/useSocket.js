import { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

let socket;

export const useSocket = (shopId, onEvent) => {
  useEffect(() => {
    if (!shopId) return;
    if (!socket) socket = io(SOCKET_URL, { transports: ["websocket"] });
    socket.emit("join-shop", shopId);

    socket.on("payment:new", p => onEvent && onEvent({ type: "payment:new", payload: p }));
    socket.on("payment:update", p => onEvent && onEvent({ type: "payment:update", payload: p }));
    socket.on("expense:new", e => onEvent && onEvent({ type: "expense:new", payload: e }));

    return () => {
      socket.off("payment:new");
      socket.off("payment:update");
      socket.off("expense:new");
    };
  }, [shopId]);
};
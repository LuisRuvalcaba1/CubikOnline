import { Server as WebSocketServer } from "socket.io";
import { handleConfrontationEvents } from "./socketActions.js";
export function initializeWebSocket(httpServer) {
  const io = new WebSocketServer(httpServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const confrontationNS = io.of("/confrontation");
  handleConfrontationEvents(confrontationNS);
}

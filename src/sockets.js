import { Server as WebSocketServer } from "socket.io";
import { handleConfrontationEvents } from "./socketConf.js";
import { handleJoinTournament } from "./socketJoin.js";

export function initializeWebSocket(httpServer) {
  const io = new WebSocketServer(httpServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const confrontationNS = io.of("/confrontation");
  handleConfrontationEvents(confrontationNS);

  const joinNS = io.of("/join");
  handleJoinTournament(joinNS);
}

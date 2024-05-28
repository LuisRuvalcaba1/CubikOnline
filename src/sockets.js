import { Server as WebSocketServer } from "socket.io";
import { handleConfrontationEvents } from "./socketConf.js";
import { handleJoinTournament } from "./socketJoin.js";
const CLIENT = process.env.CLIENT;

export function initializeWebSocket(httpServer) {
  const io = new WebSocketServer(httpServer, {
    cors: {
      origin: CLIENT,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  const confrontationNS = io.of("/confrontation");
  handleConfrontationEvents(confrontationNS);

  const joinNS = io.of("/join");
  handleJoinTournament(joinNS);
}

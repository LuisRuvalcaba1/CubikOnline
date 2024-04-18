import { Server as WebSocketCon } from "socket.io";

export function conSocket(httpServer) {
  const io = new WebSocketCon(httpServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("conn", (socket) => {
    socket.on("user", (user) => {
      socket.userId = user;
      socket.emit("user", user);
    });

    socket.on("disconnect", () => {
      console.log(`user ${socket.userId} disconnected`);
    });
    
  });
}


export function handleRoundsTournament(torneoNS){
  let participants = [];
  let judgesID = [];

  torneoNS.on("connection", (socket) => {
    console.log("Conectado al espacio de nombres de torneos");

    socket.on("n_participants", (n) => {
      socket.n_p = n;
      socket.emit("n_participants", n);
    });

    socket.on("judge", (judge) => {
      socket.judgeID = judge;
      socket.emit("judge", judge);
      judgesID.push(socket);
      console.log(judgesID.length);
      console.log(`Judge connected: ${socket.judgeID}`);
    });

    socket.on("user", (user) => {
      socket.userId = user;
      socket.emit("user", user);
      participants.push(socket);
      console.log(participants.length);

      if(participants.length == socket.n_p){
        const [user1, user2] = participants.splice(0, 2);
        const pair = { user1, user2 };
        user1.emit("paired", user2.userId);
        user2.emit("paired", user1.userId);
        console.log(pair);
      }
      console.log(`User connected: ${socket.userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      participants = participants.filter(
        (client) => client.userId !== socket.userId
      );
    });
  }
  );
}

export function handleRoundsTournament(torneoNS){
  let participants = [];
  let judgesID = [];

  torneoNS.on("connection", (socket) => {
    socket.on("n_participants", (n) => {
      socket.n_p = n;
      socket.emit("n_participants", n);
    }
    );

    socket.on("judge", (judge) => {
      socket.juezID = judge;
      judgesID.push(socket);
    });

    socket.on("user", (user) => {
      socket.userId = user;
      socket.emit("user", user);
      participants.push(socket);

      if (participants.length == socket.n_p) {
        judgesID.forEach((client) => {
          client.emit("all_users", participants);
        });
      }
    });
  });
}
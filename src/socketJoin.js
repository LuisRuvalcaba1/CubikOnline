export function handleJoinTournament(joinNS) {
  let participantes = [];
  let juezID = [];

  joinNS.on("connection", (socket) => {
    console.log("Conectado al espacio de nombres de torneos");

    socket.on("n_participantes", (n) => {
      socket.n_p = n;
      socket.emit("n_participantes", n);
    });

    socket.on("juez", (juez) => {
      socket.juezID = juez;
      socket.emit("juez", juez);
      juezID.push(socket);
      console.log(juezID.length);
      console.log(`Juez connected: ${socket.juezID}`);
    });

    socket.on("user", (user) => {
      socket.userId = user;
      socket.emit("user", user);
      participantes.push(socket);
      console.log(participantes.length);

      console.log(`User connected: ${socket.userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      participantes = participantes.filter(
        (client) => client.userId !== socket.userId
      );

      juezID = juezID.filter(
        (client) => client.juezID !== socket.juezID
      );
    });
  });
}
